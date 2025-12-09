const { body } = require('express-validator');
const { ObjectId } = require('mongodb');

exports.validate = (method) => {
	switch (method) {
		case 'createForm': {
			return [
				body('name')
					.notEmpty()
					.withMessage('name is required.')
					.isString()
					.withMessage('name should be a string.'),
				body('description')
					.notEmpty()
					.withMessage('Description is required.')
					.isString()
					.withMessage('Description should be a string.'),
				body('fields')
					.notEmpty()
					.withMessage('Fields is required')
					.isObject()
					.withMessage('Fields must be an object')
					.custom((value) => {
						if (Object.keys(value).length === 0) {
							throw new Error('Names must contain at least one nested object');
						}
						return true;
					}),
				body('fields.*.type')
					.isIn(['str', 'int'])
					.withMessage('Type must be "str" or "int"'),
				body('fields.*.description')
					.isString()
					.withMessage('Description must be a string'),
			];
		}
	}
};
