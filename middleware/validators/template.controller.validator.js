const { body } = require('express-validator');

exports.validate = (method) => {
	switch (method) {
		case 'addTemplate': {
			return [
				body('name')
					.isString()
					.isLength({ max: 512 })
					.matches(/^[a-z0-9_]+$/)
					.custom((value) => value === value.toLowerCase())
					.notEmpty()
					.withMessage(
						'Name is required and should be lowercase alphanumeric, max 512 characters'
					),
				body('language')
					.isString()
					.isIn(['fr', 'en_US', 'it', 'de'])
					.notEmpty()
					.withMessage(
						'Language is required and should be "fr", "en_US", "it", or "de"'
					),
				body('category')
					.isString()
					.equals('MARKETING')
					.notEmpty()
					.withMessage('Category should be "MARKETING"'),
				body('flow')
					.isString()
					.isIn(['GENERAL', 'SHOPIFY_ABANDONED_CHECKOUT', 'OPT_IN'])
					.notEmpty()
					.withMessage(
						'Flow should be "GENERAL", "SHOPIFY_ABANDONED_CHECKOUT", or "OPT_IN"'
					),
				body('components')
					.customSanitizer((value, { req }) => {
						return JSON.parse(value);
					})
					.isArray({ min: 1 })
					.custom((components) => {
						const hasBodyType = components.some(
							(component) => component.type === 'BODY'
						);
						return hasBodyType;
					})
					.withMessage('Components should be an array with at least BODY.'),
			];
		}
	}
};
