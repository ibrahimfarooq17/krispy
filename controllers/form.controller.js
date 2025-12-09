const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { formatIds } = require('../utils');

const Form = getCollection('forms');

// @desc    Creates a new form
// @route   POST /api/forms
// @access  PRIVATE
const createForm = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { name, description, fields } = req.body;
	const { insertedId } = await Form.insertOne({
		entity: new ObjectId(entityId),
		name,
		description,
		fields,
	});
	const createdForm = await Form.findOne({
		_id: insertedId,
	});
	return res.status(201).json({ form: formatIds(createdForm, 'form') });
};

module.exports = {
	createForm,
};
