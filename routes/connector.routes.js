const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const { errorHandler } = require('../middleware/errorHandler');
const {
	connectShopifyPublic,
	connectShopifyPrivate,
	getAllConnectors,
	checkShopifyConnection,
	disconnectShopify,
	embedShopifyData,
	connectKlaviyo,
	connectGorgias,
	sendMessageToGorigias,
} = require('../controllers/connector.controller');
const { validate } = require('../middleware/validators/connector.controller');

//POST routes
router.post('/shopify/check-connector', errorHandler(checkShopifyConnection));
router.post(
	'/shopify/connect-public',
	validate('connectShopifyPublic'),
	errorHandler(connectShopifyPublic)
);
router.post(
	'/shopify/connect-private',
	authToken,
	validate('connectShopifyPrivate'),
	errorHandler(connectShopifyPrivate)
);
router.post('/shopify/embed', authToken, errorHandler(embedShopifyData));
router.post(
	'/klaviyo',
	authToken,
	validate('connectKlaviyo'),
	errorHandler(connectKlaviyo)
);
router.post(
	'/gorgias',
	authToken,
	validate('connectGorgias'),
	errorHandler(connectGorgias)
);

//GET routes
router.get('/all', authToken, errorHandler(getAllConnectors));

//DELETE routes
router.delete('/shopify', authToken, errorHandler(disconnectShopify));

module.exports = router;
