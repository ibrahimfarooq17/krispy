const { getCollection } = require('../db');
const { formatIds } = require('../utils');
const { ObjectId } = require('mongodb');
const csv = require('csvtojson');
const { createBulkContacts } = require('../services/chatService');

const Contact = getCollection('contacts');

// @desc    Returns paginated contacts of business - pagination starts from 0
// @route   GET /api/contacts/:page?consent={bool}
// @access  PRIVATE
const getAllContacts = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const page = parseInt(req.params.page);
	const { consent } = req.query;

	const queryFilters = {
		entity: new ObjectId(entityId),
		...(consent && {
			consent: consent === 'true',
		}),
	};

	const PAGE_SIZE = 10;
	const skip = page * PAGE_SIZE;
	const totalContacts = await Contact.countDocuments(queryFilters);
	const totalPages = Math.ceil(totalContacts / PAGE_SIZE);
	const nextPage = page + 1 >= totalPages ? null : page + 1;
	const prevPage = page - 1 < 0 ? null : page - 1;

	const contacts = await Contact.aggregate([
		{
			$match: queryFilters,
		},
		{ $sort: { totalSpent: -1 } },
		{ $skip: skip },
		{ $limit: PAGE_SIZE },
	]).toArray();
	return res.status(200).json({
		contacts: formatIds(contacts, 'contact'),
		pagination: {
			totalRecords: totalContacts,
			totalPages,
			currentPage: page,
			nextPage,
			prevPage,
		},
	});
};

// @desc    Import contacts
// @route   POST /api/contacts/import
// @access  PRIVATE
const importContacts = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const contactsCsvFile = req.files?.contactsCsvFile;
	let contactListToReach = [];

	if (!contactsCsvFile)
		return res
			.status(400)
			.json({ msg: 'Please provide a CSV file of the contacts.' });

	if (contactsCsvFile?.mimetype != 'text/csv')
		return res.status(422).json({ msg: 'Only CSV file allowed.' });

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
	const { data, error } = await createBulkContacts({
		entityId: entityId,
		contacts: jsonCsv,
	});
	if (error) return res.status(500).json({ msg: error });
	contactListToReach = data?.contacts;

	return res.status(201).json({
		msg: `${contactListToReach.length} contacts imported.`,
		contacts: contactListToReach,
	});
};

module.exports = {
	getAllContacts,
	importContacts,
};
