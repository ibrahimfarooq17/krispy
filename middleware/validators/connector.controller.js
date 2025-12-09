const { body } = require('express-validator');

const validShopifyStoreNameRegex =
	/^(?!http(s)?:\/\/)([a-zA-Z0-9][a-zA-Z0-9-_]*\.)*[a-zA-Z0-9][a-zA-Z0-9-_]*\.myshopify\.com$/;

exports.validate = (method) => {
	switch (method) {
		case 'connectShopifyPublic': {
			return [
				body('storeUri')
					.notEmpty()
					.withMessage('Store URI is required')
					.isString()
					.withMessage('Shopify store uri must be a string'),
				body('entityId')
					.trim()
					.notEmpty()
					.withMessage('Entity ID is required.')
					.isMongoId()
					.withMessage('Entity ID invalid.'),
			];
		}
		case 'connectShopifyPrivate': {
			return [
				body('storeUri')
					.trim()
					.notEmpty()
					.withMessage('Store name is required')
					.isString()
					.withMessage('Shopify store uri must be a string')
					.matches(validShopifyStoreNameRegex)
					.withMessage('Invalid Shopify store name.'),
				body('accessToken')
					.trim()
					.notEmpty()
					.withMessage('Shopify access token is required')
					.isString()
					.withMessage('Shopify access token must be a string'),
			];
		}
		case 'uploadShopifyStoreProducts': {
			return [
				body('products').isArray().notEmpty(),
				body('products.*.id').isNumeric().notEmpty(),
				body('products.*.title').isString().notEmpty(),
				body('products.*.desc').isString().optional(),
				body('products.*.handle').isString().optional(),
				body('products.*.status').isString().optional(),
				body('products.*.options').isArray().optional(),
				body('products.*.imageLink').isURL().optional(),
				body('products.*.variants').isArray().optional(),
				body('products.*.variants.*.variantId').isNumeric().optional(),
				body('products.*.variants.*.title').isString().optional(),
				body('products.*.variants.*.price').isString().optional(),
				body('products.*.variants.*.variantImageLink').isURL().optional(),
			];
		}
		case 'connectKlaviyo': {
			return [
				body('apiKey')
					.trim()
					.notEmpty()
					.withMessage('Connector key is required!')
					.isString()
					.withMessage('Connector key must be a string'),
			];
		}
		case 'connectGorgias': {
			return [
				body('key')
					.trim()
					.notEmpty()
					.withMessage('API key is required!')
					.isString()
					.withMessage('API key must be a string'),
				body('domain')
					.trim()
					.notEmpty()
					.withMessage('Gorgias domain is required!')
					.isString()
					.withMessage('Gorgias domain must be a string'),
				body('email')
					.trim()
					.notEmpty()
					.withMessage('Email is required!')
					.isString()
					.withMessage('Email must be a string')
					.isEmail()
					.withMessage('Email must be in email@example.com format'),
			];
		}
	}
};
