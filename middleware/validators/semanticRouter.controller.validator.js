const { body } = require('express-validator');
const { ObjectId } = require('mongodb');

exports.validate = (method) => {
	switch (method) {
		case 'createSemanticRouter': {
			return [
				body('name')
					.notEmpty()
					.withMessage('Name is required.')
					.isString()
					.withMessage('Name should be a string.'),
				body('utterances')
					.notEmpty()
					.withMessage('utterances is required.')
					.isArray({ min: 1, max: 20 })
					.withMessage(
						'Utterances should be an array with atleast one string.'
					),
				body('utterances.*')
					.notEmpty()
					.isString()
					.withMessage('Utterance must be a string only'),
				body('forms')
					.notEmpty()
					.isArray({ min: 1, max: 20 })
					.withMessage('Forms should be an array with atleast 1 item.'),
				body('forms.*')
					.notEmpty()
					.isMongoId()
					.withMessage('Form must be a valid ID')
					.customSanitizer((formId) => {
						return new ObjectId(formId);
					}),
				body('actions')
					.isArray({ min: 1, max: 1 })
					.withMessage('actions must be a non-empty array'),
				body('actions.*.actionId')
					.notEmpty()
					.withMessage('actionId is required')
					.isMongoId()
					.withMessage('actionId must be a valid MongoDB ObjectId'),
				body('actions.*.actionMetadata')
					.notEmpty()
					.withMessage('actionMetadata is required')
					.isObject()
					.withMessage('actionMetadata must be an object'),
			];
		}
		case 'updateSemanticRouter': {
			return [
				body('name')
					.optional()
					.isString()
					.withMessage('Name should be a string.'),
				body('utterances')
					.optional()
					.isArray({ min: 1, max: 20 })
					.withMessage(
						'Utterances should be an array with atleast one string.'
					),
				body('utterances.*')
					.optional()
					.isString()
					.withMessage('Utterance must be a string only'),
				body('forms')
					.optional()
					.isArray({ min: 1, max: 20 })
					.withMessage('Forms should be an array with atleast 1 item.'),
				body('forms.*')
					.optional()
					.isMongoId()
					.withMessage('Form must be a valid ID')
					.customSanitizer((formId) => {
						return new ObjectId(formId);
					}),
				body('actionId')
					.optional()
					.isMongoId()
					.withMessage('actionId must be a valid ID.'),
				body('actionMetadata')
					.optional()
					.isObject()
					.withMessage('actionMetadata must be an object'),
			];
		}
	}
};
