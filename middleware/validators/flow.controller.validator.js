const { body } = require('express-validator');

exports.validate = (method) => {
	switch (method) {
		case 'createFlow': {
			return [
				body('name').notEmpty().withMessage('Name is required'),
				body('trigger')
					.notEmpty()
					.withMessage('Trigger is required')
					.isString()
					.withMessage('Trigger should be a string')
					.isIn([
						'KLAVIYO_WEBHOOK',
						'SHOPIFY_ORDER_RECEIVED',
						'SHOPIFY_ABANDONED_CHECKOUT',
						'MATCHED_MESSAGE',
						'CTA',
					])
					.withMessage('Invalid trigger.'),
				body('isActive')
					.notEmpty()
					.withMessage('isActive is required.')
					.isBoolean()
					.withMessage('isActive should be a boolean.'),
				body('actions')
					.isArray({ min: 1 })
					.withMessage('Actions should be an array with at least one element'),
				body('actions.*.type')
					.isString()
					.withMessage('Action type should be a string')
					.isIn(['REPLY_TEMPLATE', 'REPLY_TEXT'])
					.withMessage('Invalid action type.'),
				body('actions.*.delay.hours')
					.notEmpty()
					.withMessage('Delay hours is required')
					.isNumeric()
					.withMessage('Delay hours must be a number'),
				body('actions.*.delay.days')
					.notEmpty()
					.withMessage('Delay days is required')
					.isInt({ min: 0, max: 10000 })
					.withMessage('Delay days should be an integer between 0 and 10000.')
					.toInt(),
			];
		}
		case 'updateFlow': {
			return [
				body('name').optional(),
				body('trigger')
					.optional()
					.isString()
					.withMessage('Trigger should be a string')
					.isIn([
						'KLAVIYO_WEBHOOK',
						'SHOPIFY_ORDER_RECEIVED',
						'SHOPIFY_ABANDONED_CHECKOUT',
						'MATCHED_MESSAGE',
						'CTA',
					])
					.withMessage('Invalid trigger.'),
				body('isActive')
					.optional()
					.isBoolean()
					.withMessage('isActive should be a boolean.'),
				body('actions')
					.optional()
					.isArray({ min: 1 })
					.withMessage('Actions should be an array with at least one element'),
				body('actions.*.type')
					.optional()
					.isString()
					.withMessage('Action type should be a string')
					.isIn(['REPLY_TEMPLATE', 'REPLY_TEXT'])
					.withMessage('Invalid action type.'),
				body('actions.*.delay.hours')
					.notEmpty()
					.withMessage('Delay hours is required')
					.isNumeric()
					.withMessage('Delay hours must be a number'),
				body('actions.*.delay.days')
					.optional()
					.notEmpty()
					.withMessage('Delay days is required')
					.isInt({ min: 0, max: 10000 })
					.withMessage('Delay days should be an integer between 0 and 10000.')
					.toInt(),
			];
		}
	}
};
