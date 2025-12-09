const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const {
	formatIds,
	krispyAxios,
	normalizePhoneNumber,
	convertToUTC,
} = require('../utils');
const createTemplateBody = require('../@helpers/createTemplateBody');
const csv = require('csvtojson');
const { createBulkContacts } = require('../services/chatService');

const Campaign = getCollection('campaigns');
const Contact = getCollection('contacts');
const Chat = getCollection('chats');
const QueuedMessage = getCollection('queuedMessages');
const Template = getCollection('templates');
const KnowledgeBase = getCollection('knowledgeBases');
const Preference = getCollection('preferences');

// @desc    Create new campaign
// @route   POST /api/campaigns
// @access  PRIVATE
const createCampaign = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { name, templateId, date, time, timezone } = req.body;

	const contactsCsvFile = req.files?.contactsCsvFile;
	let contactListToReach = [];
	const MAX_CONTACTS_LIMIT = 800;

	const foundTemplate = await Template.findOne({
		_id: new ObjectId(templateId),
	});
	if (!foundTemplate)
		return res.status(404).json({ msg: 'Template not found.' });

	if (foundTemplate?.status !== 'approved')
		return res.status(400).json({ msg: 'Template not approved by meta yet.' });

	if (foundTemplate?.flow === 'SHOPIFY_ABANDONED_CHECKOUT')
		return res.status(400).json({
			msg: 'Only the templates with flow GENERAL or OPT_IN can be hooked with campaign.',
		});

	if (contactsCsvFile) {
		//CSV file provided - run necessary check and convert to json
		if (contactsCsvFile?.mimetype !== 'text/csv')
			return res.status(422).json({ msg: 'Only CSV files allowed.' });

		let jsonCsv = await csv().fromString(contactsCsvFile?.data?.toString());
		const headers = Object.keys(jsonCsv?.[0]);
		if (!headers.includes('name') || !headers.includes('phoneNumber')) {
			return res.status(400).json({
				msg: "CSV file must contain 'name' and 'phoneNumber' columns. Please double check the format of provided CSV.",
			});
		}

		jsonCsv = jsonCsv
			.filter((contact) => contact?.name && contact?.phoneNumber)
			.map((contact) => {
				return {
					name: contact?.name,
					phoneNumber: contact?.phoneNumber,
				};
			});

		const contactList = await Contact.find({
			entity: new ObjectId(entityId),
			phoneNumber: {
				$in: jsonCsv.map((contact) =>
					normalizePhoneNumber(contact.phoneNumber)
				),
			},
			...(foundTemplate?.flow !== 'OPT_IN' && { consent: true }),
		})
			.limit(MAX_CONTACTS_LIMIT)
			.toArray();
		contactListToReach = contactList;
	} else {
		//CSV file not provided, run for all contacts in db
		const contactList = await Contact.find({
			entity: new ObjectId(entityId),
			...(foundTemplate?.flow !== 'OPT_IN' && { consent: true }),
		})
			.limit(MAX_CONTACTS_LIMIT)
			.toArray();
		contactListToReach = contactList;
	}

	//further filter on contacts for only those that
	//have previously received a whatsapp msg
	if (foundTemplate?.flow !== 'OPT_IN') {
		const filteredContacts = await Contact.aggregate([
			{
				$match: {
					_id: {
						$in: contactListToReach?.map(
							(contact) => new ObjectId(contact._id)
						),
					},
				},
			},
			{
				$lookup: {
					from: 'chats',
					localField: '_id',
					foreignField: 'contact',
					as: 'chats',
				},
			},
			{
				$match: {
					chats: { $exists: true, $ne: [] },
				},
			},
		]).toArray();
		contactListToReach = filteredContacts;
	}

	if (contactListToReach.length == 0)
		return res.status(404).json({ msg: 'No contacts found to reach.' });

	console.log(contactListToReach);

	const createdCampaign = await Campaign.insertOne({
		entity: new ObjectId(entityId),
		name: name,
		template: new ObjectId(templateId),
		totalContacts: contactListToReach.length,
		contactsReached: 0,
		scheduledFor: convertToUTC({ date, time, timezone }),
		createdAt: new Date(),
	});

	//insert all messages in queue
	await QueuedMessage.insertMany(
		contactListToReach?.map((contact) => {
			return {
				entity: new ObjectId(entityId),
				contact: new ObjectId(contact._id),
				priority: 2,
				status: 'OPEN',
				metadata: {
					campaign: new ObjectId(createdCampaign.insertedId),
					template: new ObjectId(templateId),
				},
				scheduledFor: convertToUTC({ date, time, timezone }),
				createdAt: new Date(),
			};
		})
	);
	return res.status(201).json({
		msg: `Campaign successfully launched for ${contactListToReach.length} contacts.`,
	});
};

// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:campaignId
// @access  PRIVATE
const deleteCampaign = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { campaignId } = req.params;

	const deletedMsgs = await QueuedMessage.deleteMany({
		'metadata.campaign': new ObjectId(campaignId),
		status: 'OPEN',
	});
	const deletedCampaign = await Campaign.findOneAndDelete({
		_id: new ObjectId(campaignId),
		entity: new ObjectId(entityId),
	});
	if (!deletedCampaign.value)
		return res
			.status(404)
			.json({ msg: 'Campaign with provided id not found.' });
	return res.status(200).json({
		msg: `Campaign successfully deleted with ${deletedMsgs.deletedCount} queued messages.`,
	});
};

// @desc    Test a campaign
// @route   POST /api/campaigns/test
// @access  PRIVATE
const testCampaign = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { contacts, templateId } = req.body;

	const foundKnowledgeBase = await KnowledgeBase.findOne({
		entity: new ObjectId(entityId),
	});
	const foundPreference = await Preference.findOne({
		entity: new ObjectId(entityId),
	});

	if (!foundPreference?.d360ApiKey)
		return res.status(404).json({
			msg: 'No 360Dialog API Key found. Please make sure you have connected first.',
		});

	for (let contact of contacts) {
		const templateBodyToSend = await createTemplateBody(templateId, {
			customerName: contact?.name,
			storeName: foundKnowledgeBase?.storeName,
		});
		const { error } = await krispyAxios({
			method: 'POST',
			url: 'https://waba-v2.360dialog.io/messages',
			headers: {
				'D360-API-KEY': foundPreference?.d360ApiKey,
			},
			body: {
				messaging_product: 'whatsapp',
				recipient_type: 'individual',
				to: normalizePhoneNumber(contact?.phoneNumber),
				type: 'template',
				template: templateBodyToSend,
			},
		});
		if (error)
			return res.status(500).json({
				msg: `Error sending message to ${contact?.phoneNumber}.`,
				details: error,
			});
	}
	return res.status(200).json({ msg: 'Sent test messages successfully!' });
};

// @desc    Get all campaigns of a business
// @route   GET /api/campaigns
// @access  PRIVATE
const getAllCampaigns = async (req, res) => {
	const entityId = req.user.entity.entityId;

	const campaigns = await Campaign.aggregate([
		{
			$match: {
				entity: new ObjectId(entityId),
			},
		},
		{
			$lookup: {
				from: 'templates',
				localField: 'template',
				foreignField: '_id',
				as: 'template',
			},
		},
		{
			$lookup: {
				from: 'attributions',
				localField: '_id',
				foreignField: 'campaign',
				as: 'orderMetrics',
			},
		},
		{
			$lookup: {
				from: 'messages',
				localField: '_id',
				foreignField: 'metadata.campaign',
				as: 'messages',
			},
		},
		{
			$lookup: {
				from: 'ctaClicks',
				localField: '_id',
				foreignField: 'campaign',
				as: 'ctaClicks',
			},
		},
		{
			$addFields: {
				openedMessages: {
					$filter: {
						input: '$messages',
						as: 'message',
						cond: { $eq: ['$$message.read', true] },
					},
				},
				unopenedMessages: {
					$filter: {
						input: '$messages',
						as: 'message',
						cond: { $eq: ['$$message.read', false] },
					},
				},
			},
		},
		{
			$addFields: {
				ctaClicksCount: { $size: '$ctaClicks' },
				totalRevenue: { $sum: '$orderMetrics.amount' },
				totalOrders: { $size: '$orderMetrics' },
				messagesCount: { $size: '$messages' },
				unopenedCount: { $size: '$unopenedMessages' },
				openedCount: { $size: '$openedMessages' },
				template: { $arrayElemAt: ['$template', 0] },
			},
		},
		{
			$project: {
				messages: 0,
				unopenedMessages: 0,
				openedMessages: 0,
				ctaClicks: 0,
				orderMetrics: 0,
			},
		},
		{ $sort: { createdAt: -1 } },
	]).toArray();

	return res.status(200).json({
		campaigns: formatIds(campaigns, 'campaign'),
	});
};

module.exports = {
	createCampaign,
	deleteCampaign,
	testCampaign,
	getAllCampaigns,
};
