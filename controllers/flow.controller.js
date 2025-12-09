const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { convertToObjectIds, formatIds } = require('../utils');

const Flow = getCollection('flows');
const QueuedMessage = getCollection('queuedMessages');
const CtaClick = getCollection('ctaClicks');
const Attribution = getCollection('attributions');

// @desc    Create a new flow
// @route   POST /api/flows
// @access  PRIVATE
const createFlow = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { parentFlowId, name, trigger, metadata, actions, tree, isActive } =
		req.body;

	const existingFlow = await Flow.findOne({
		entity: new ObjectId(entityId),
		trigger: trigger,
	});
	if (
		existingFlow &&
		(trigger === 'SHOPIFY_ORDER_RECEIVED' ||
			trigger === 'SHOPIFY_ABANDONED_CHECKOUT')
	)
		return res.status(409).json({
			msg: 'Only one flow is allowed to be set up for this type of trigger.',
		});

	const { insertedId } = await Flow.insertOne({
		entity: new ObjectId(entityId),
		...(parentFlowId && { parentFlowId: new ObjectId(parentFlowId) }),
		name: name,
		trigger: trigger,
		actions: convertToObjectIds(actions),
		isActive: isActive,
		...(tree && { tree }),
		...(trigger === 'SHOPIFY_ABANDONED_CHECKOUT'
			? {
					metadata: {
						latestCheckoutCreatedAt: new Date(),
					},
			  }
			: { metadata: metadata || {} }),
		createdAt: new Date(),
	});
	const foundFlow = await Flow.findOne({ _id: insertedId });
	return res
		.status(201)
		.json({ msg: 'Flow created.', flow: formatIds(foundFlow, 'flow') });
};

// @desc    Get all flows
// @route   GET /api/flows
// @access  PRIVATE
const getAllFlows = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const flows = await Flow.aggregate([
		{
			$match: {
				entity: new ObjectId(entityId),
				parentFlowId: null,
			},
		},
		{
			$lookup: {
				from: 'messages',
				localField: '_id',
				foreignField: 'metadata.flow',
				as: 'messages',
			},
		},
		{
			$lookup: {
				from: 'ctaClicks',
				localField: '_id',
				foreignField: 'flow',
				as: 'ctaClicks',
			},
		},
		{
			$lookup: {
				from: 'attributions',
				localField: '_id',
				foreignField: 'flow',
				as: 'orderMetrics',
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
				totalRevenue: { $sum: '$orderMetrics.amount' },
				totalOrders: { $size: '$orderMetrics' },
				messagesCount: { $size: '$messages' },
				unopenedCount: { $size: '$unopenedMessages' },
				openedCount: { $size: '$openedMessages' },
				ctaClicksCount: { $size: '$ctaClicks' },
			},
		},
		{
			$project: {
				tree: 0,
				actions: 0,
				unopenedMessages: 0,
				openedMessages: 0,
				messages: 0,
				ctaClicks: 0,
				orderMetrics: 0,
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]).toArray();
	return res.status(200).json({ flows: formatIds(flows, 'flow') });
};

// @desc    Get single flow
// @route   GET /api/flows/:flowId
// @access  PRIVATE
const getSingleFlow = async (req, res) => {
	const { flowId } = req.params;

	const [foundFlow] = await Flow.aggregate([
		{
			$match: {
				_id: new ObjectId(flowId),
			},
		},
		{
			$lookup: {
				from: 'messages',
				localField: '_id',
				foreignField: 'metadata.flow',
				as: 'messages',
			},
		},
		{
			$unwind: {
				path: '$messages',
				preserveNullAndEmptyArrays: true,
			},
		},
		{
			$group: {
				_id: {
					flowId: '$_id',
					template: '$messages.metadata.template',
				},
				totalMessages: {
					$sum: { $cond: [{ $ifNull: ['$messages', false] }, 1, 0] },
				},
				readMessages: {
					$sum: {
						$cond: [
							{ $and: [{ $ifNull: ['$messages', false] }, '$messages.read'] },
							1,
							0,
						],
					},
				},
				unreadMessages: {
					$sum: {
						$cond: [
							{
								$and: [
									{ $ifNull: ['$messages', false] },
									{ $eq: ['$messages.read', false] },
								],
							},
							1,
							0,
						],
					},
				},
			},
		},
		{
			$group: {
				_id: '$_id.flowId',
				templates: {
					$push: {
						templateId: '$_id.template',
						totalMessages: '$totalMessages',
						readMessages: '$readMessages',
						unreadMessages: '$unreadMessages',
					},
				},
			},
		},
		{
			$lookup: {
				from: 'flows',
				localField: '_id',
				foreignField: '_id',
				as: 'flow',
			},
		},
		{
			$unwind: '$flow',
		},
		{
			$addFields: {
				'flow.openRate': {
					$cond: {
						if: { $eq: ['$templates', [{}]] },
						then: [],
						else: '$templates',
					},
				},
			},
		},
		{
			$replaceRoot: {
				newRoot: '$flow',
			},
		},
		{
			$sort: {
				createdAt: -1,
			},
		},
	]).toArray();
	const subFlows = await Flow.find({
		parentFlowId: foundFlow._id,
	}).toArray();

	const ctaClicks = await CtaClick.aggregate([
		{
			$match: {
				flow: new ObjectId(flowId),
			},
		},
		{
			$group: {
				_id: '$template',
				count: { $sum: 1 },
			},
		},
		{
			$project: {
				_id: 0,
				templateId: '$_id',
				count: 1,
			},
		},
	]).toArray();

	const orderMetrics = await Attribution.aggregate([
		{
			$match: {
				flow: new ObjectId(flowId),
			},
		},
		{
			$group: {
				_id: '$template',
				totalAmount: { $sum: '$amount' },
				count: { $sum: 1 },
			},
		},
		{
			$project: {
				_id: 0,
				templateId: '$_id',
				totalAmount: 1,
				count: 1,
			},
		},
	]).toArray();

	return res.status(200).json({
		flow: formatIds(
			{ ...foundFlow, subFlows, ctaClicks, orderMetrics },
			'flow'
		),
	});
};

// @desc    Update a flow
// @route   PATCH /api/flows/:flowId
// @access  PRIVATE
const updateFlow = async (req, res) => {
	const { flowId } = req.params;
	const { name, trigger, metadata, actions, tree, isActive } = req.body;

	if (!isActive) {
		await QueuedMessage.deleteMany({
			'metadata.flow': new ObjectId(flowId),
		});
	}
	await Flow.findOneAndUpdate(
		{ _id: new ObjectId(flowId) },
		{
			$set: {
				...(isActive != null && { isActive }),
				...(name && { name }),
				...(trigger && { trigger }),
				...(actions && { actions: convertToObjectIds(actions) }),
				...(tree && { tree }),
				...(metadata && { metadata }),
			},
		}
	);
	return res.status(200).json({ msg: 'Flow updated.' });
};

// @desc    Delete a flow
// @route   DELETE /api/flows/:flowId
// @access  PRIVATE
const deleteFlow = async (req, res) => {
	const { flowId } = req.params;
	await QueuedMessage.deleteMany({
		'metadata.flow': new ObjectId(flowId),
	});
	await Flow.deleteMany({
		$or: [
			{ _id: new ObjectId(flowId) },
			{ parentFlowId: new ObjectId(flowId) },
		],
	});
	return res.status(200).json({ msg: 'Flow deleted.' });
};

module.exports = {
	createFlow,
	getAllFlows,
	getSingleFlow,
	updateFlow,
	deleteFlow,
};
