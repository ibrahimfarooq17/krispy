const { getCollection } = require('../db');
const { formatIds } = require('../utils');

const AiAction = getCollection('aiActions');

// @desc    Gets all ai actions
// @route   GET /api/ai-actions
// @access  PRIVATE
const getAllAiActions = async (req, res) => {
	const aiActions = await AiAction.find({}).toArray();
	return res.status(200).json({ aiActions: formatIds(aiActions, 'aiAction') });
};

module.exports = {
	getAllAiActions,
};
