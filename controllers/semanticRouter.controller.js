const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { formatIds } = require('../utils');

const SemanticRouter = getCollection('semanticRouters');
const AiActionSession = getCollection('aiActionSessions');

// @desc    Creates a new semantic router
// @route   POST /api/semantic-routers
// @access  PRIVATE
const createSemanticRouter = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { name, utterances, forms, actions } = req.body;

	const insertedAiActionSessions = await AiActionSession.insertMany(
		actions.map((action) => {
			return {
				action: new ObjectId(action.actionId),
				...(action.actionMetadata.webhookUrl && {
					webhookUrl: action.actionMetadata.webhookUrl,
				}),
			};
		})
	);
	const insertedSemanticRouter = await SemanticRouter.insertOne({
		entity: new ObjectId(entityId),
		name,
		utterances,
		forms,
		aiActionSessions: Object.entries(insertedAiActionSessions.insertedIds).map(
			([key, value]) => new ObjectId(value)
		),
	});
	const foundSemanticRouter = await SemanticRouter.findOne({
		_id: insertedSemanticRouter.insertedId,
	});
	return res
		.status(201)
		.json({ semanticRouter: formatIds(foundSemanticRouter, 'semanticRouter') });
};

// @desc    Updates  semantic router
// @route   PATCH /api/semantic-routers/:semanticRouterId
// @access  PRIVATE
const updateSemanticRouter = async (req, res) => {
	const { name, utterances, forms, actions } = req.body;
	const { semanticRouterId } = req.params;
	// const foundSemanticRouter = await SemanticRouter.findOne({
	// 	_id: new ObjectId(semanticRouterId),
	// });
	// if (!foundSemanticRouter)
	// 	return res.status(404).json({ msg: 'Semantic router not found.' });
	// await SemanticRouter.updateOne(
	// 	{ _id: foundSemanticRouter._id },
	// 	{
	// 		$set: {
	// 			...(name && { name }),
	// 			...(utterances && { utterances }),
	// 			...(forms && { forms }),
	// 			...(actions && { actions }),
	// 		},
	// 	}
	// );
	return res.status(200).json({ msg: 'Semantic router updated.' });
};

// @desc    Gets all  semantic routers
// @route   GET /api/semantic-routers
// @access  PRIVATE
const getSemanticRouters = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const foundRouters = await SemanticRouter.aggregate([
		{
			$match: {
				entity: new ObjectId(entityId),
			},
		},
		{
			$lookup: {
				from: 'aiActionSessions',
				localField: 'aiActionSessions',
				foreignField: '_id',
				as: 'aiActionSessions',
			},
		},
	]).toArray();
	return res
		.status(200)
		.json({ semanticRouters: formatIds(foundRouters, 'semanticRouter') });
};

// @desc    Deletes a  semantic router
// @route   GET /api/semantic-routers/:semanticRouterId
// @access  PRIVATE
const deleteSemanticRouter = async (req, res) => {
	const { semanticRouterId } = req.params;
	await SemanticRouter.deleteOne({ _id: new ObjectId(semanticRouterId) });
	return res.status(200).json({ msg: 'Route deleted.' });
};

module.exports = {
	createSemanticRouter,
	updateSemanticRouter,
	getSemanticRouters,
	deleteSemanticRouter,
};
