const { getCollection } = require('../db');
const { formatIds } = require('../utils');

const Entity = getCollection('entities');

// @desc    Gets all entites
// @route   GET /api/entities
// @access  PUBLIC
const getAllEntities = async (req, res) => {
  const entities = await Entity.find().toArray();
  return res.status(200).json({ entities: formatIds(entities, 'entity') });
};

module.exports = {
  getAllEntities,
};
