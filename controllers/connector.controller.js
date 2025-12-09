const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { formatIds, krispyAxios } = require('../utils');
const {
	deleteShopifyEmbedding,
	embedShopifyStoreData,
} = require('../services/aiService');
const { createGorgiasCustomer } = require('../@helpers/gorgiasHelpers');

const Connector = getCollection('connectors');
const Entity = getCollection('entities');
const ShopifyAppSession = getCollection('shopifyAppSessions');

// @desc    Gets all connectors of business
// @route   GET /api/connectors/all
// @access  PRIVATE
const getAllConnectors = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const connectors = await Connector.find({ entity: new ObjectId(entityId) })
		.project({ key: 0, referrer: 0 })
		.toArray();
	return res.status(200).json({
		connectors: formatIds(connectors, 'connector'),
	});
};

// @desc    Checks if business is connected to Shopify via extension
// @route   POST /api/connectors/shopify/check-connector
// @access  PUBLIC
const checkShopifyConnection = async (req, res) => {
	const { storeUri } = req.body;

	const foundShopifyConnector = await Connector.findOne({
		$and: [{ name: 'shopify', uri: storeUri }],
	});
	if (!foundShopifyConnector)
		return res.status(404).json({ msg: 'Shopify not connected to business.' });

	return res.status(200).json({
		msg: 'Shopify connector found for business.',
		connector: formatIds(foundShopifyConnector, 'connector'),
	});
};

// @desc    Connects a shopify store through the installation of the public app
// @route   POST /api/connectors/shopify/connect-public
// @access  PUBLIC
const connectShopifyPublic = async (req, res) => {
	const { storeUri, entityId } = req.body;

	const foundEntity = await Entity.findOne({ _id: new ObjectId(entityId) });
	if (!foundEntity)
		return res.status(404).json({ msg: 'Entity not found with provided ID.' });
	const foundShopifyConnector = await Connector.findOne({
		$and: [{ entity: new ObjectId(entityId) }, { name: 'shopify' }],
	});
	if (foundShopifyConnector)
		return res
			.status(409)
			.json({ msg: 'Shopify is already connected to your business.' });

	//get access token from app sessions
	const foundSession = await ShopifyAppSession.findOne({
		shop: storeUri,
	});
	if (!foundSession)
		return res.status(404).json({
			msg: 'Shopify app session not found. Please make sure you have installed the app on your shopify store.',
		});
	const accessToken = foundSession.accessToken;

	//post webhooks here
	const shopifyWebhookRes = await krispyAxios({
		method: 'POST',
		url: `https://${storeUri}/admin/api/2023-07/webhooks.json`,
		headers: {
			'X-Shopify-Access-Token': accessToken,
		},
		body: {
			webhook: {
				address: `${process.env.KRISPY_WEBHOOK_BASE_URL}/webhooks/shopify-order-created/${entityId}`,
				topic: 'orders/create',
				format: 'json',
			},
		},
	});
	if (shopifyWebhookRes.error)
		return res.status(500).json({
			msg: 'Error posting webhook.',
			details: shopifyWebhookRes.error,
		});

	//create connector
	const { insertedId } = await Connector.insertOne({
		entity: new ObjectId(entityId),
		name: 'shopify',
		uri: storeUri,
		key: accessToken,
		referrer: 'PUBLIC',
		metadata: {
			webhooks: [
				{
					id: shopifyWebhookRes.data?.webhook?.id,
					topic: 'orders/create',
				},
			],
		},
	});

	//embed data in AI
	const { error } = await embedShopifyStoreData({
		entityId,
		shopifyStoreUri: storeUri,
		shopifyStoreKey: accessToken,
		allowScraping: storeUri !== 'quickstart-e069bef2.myshopify.com',
	});
	if (error) {
		//embedding failed, rollback everything
		await krispyAxios({
			method: 'DELETE',
			url: `https://${storeUri}/admin/api/2023-07/webhooks/${shopifyWebhookRes.data?.webhook?.id}.json`,
			headers: {
				'X-Shopify-Access-Token': accessToken,
			},
		});
		await Connector.findOneAndDelete({ _id: insertedId });
		return res.status(500).json({
			msg: 'Error embedding data.',
			details: error,
		});
	}
	return res.status(201).json({ msg: 'Shopify connected!' });
};

// @desc    Connect shopify through private app
// @route   POST /api/connectors/shopify/connect-private
// @access  PRIVATE
const connectShopifyPrivate = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { storeUri, accessToken } = req.body;

	const foundShopifyConnector = await Connector.findOne({
		$and: [{ entity: new ObjectId(entityId) }, { name: 'shopify' }],
	});
	if (foundShopifyConnector)
		return res
			.status(409)
			.json({ msg: 'Shopify is already connected to your business.' });

	//post webhooks here
	const shopifyWebhookRes = await krispyAxios({
		method: 'POST',
		url: `https://${storeUri}/admin/api/2023-07/webhooks.json`,
		headers: {
			'X-Shopify-Access-Token': accessToken,
		},
		body: {
			webhook: {
				address: `${process.env.KRISPY_WEBHOOK_BASE_URL}/webhooks/shopify-order-created/${entityId}`,
				topic: 'orders/create',
				format: 'json',
			},
		},
	});
	if (shopifyWebhookRes.error)
		return res.status(500).json({
			msg: 'Error posting webhook.',
			details: shopifyWebhookRes.error,
		});

	await Connector.insertOne({
		entity: new ObjectId(entityId),
		name: 'shopify',
		uri: storeUri,
		key: accessToken,
		referrer: 'PRIVATE',
		metadata: {
			webhooks: [
				{
					id: shopifyWebhookRes.data?.webhook?.id,
					topic: 'orders/create',
				},
			],
		},
	});
	return res.status(201).json({ msg: 'Private shopify connector created!' });
};

// @desc    Disconnect shopify connection
// @route   DELETE /api/connectors/shopify
// @access  PRIVATE
const disconnectShopify = async (req, res) => {
	const entityId = req.user.entity.entityId;

	const foundShopifyConnector = await Connector.findOne({
		$and: [{ name: 'shopify' }, { entity: new ObjectId(entityId) }],
	});
	if (!foundShopifyConnector)
		return res.status(404).json({ msg: 'Shopify not connected to business.' });

	//delete all embedded data
	const { error } = await deleteShopifyEmbedding({ entityId });
	if (error)
		return res.status(500).json({
			msg: 'Error deleting embedding.',
			details: error,
		});
	//delete shopify webhooks
	if (foundShopifyConnector?.metadata?.webhooks?.length > 0) {
		for (let webhook of foundShopifyConnector?.metadata?.webhooks) {
			await krispyAxios({
				method: 'DELETE',
				url: `https://${foundShopifyConnector?.uri}/admin/api/2023-07/webhooks/${webhook?.id}.json`,
				headers: {
					'X-Shopify-Access-Token': foundShopifyConnector?.key,
				},
			});
		}
	}
	//delete connector
	await Connector.findOneAndDelete({
		_id: new ObjectId(foundShopifyConnector._id),
	});
	return res.status(200).json({ msg: 'Shopify connector deleted!' });
};

// @desc    Embeds shopify data
// @route   POST /api/connectors/shopify/embed
// @access  PRIVATE
const embedShopifyData = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { allowScraping, baseProductUrl, skus } = req.body;
	const foundShopifyConnector = await Connector.findOne({
		$and: [{ entity: new ObjectId(entityId) }, { name: 'shopify' }],
	});
	if (!foundShopifyConnector)
		return res.status(404).json({ msg: 'Shopify not connected.' });

	const { error } = await embedShopifyStoreData({
		entityId,
		shopifyStoreUri: foundShopifyConnector.uri,
		shopifyStoreKey: foundShopifyConnector.key,
		allowScraping: allowScraping || true,
		baseProductUrl: baseProductUrl,
		filters: {
			skus: skus,
		},
	});
	if (error)
		return res.status(500).json({
			msg: 'Error embedding data.',
			details: error,
		});
	return res.status(200).json({ msg: 'Shopify embedding in progress!' });
};

// @desc    Connect Klaviyo
// @route   POST /api/connectors/klaviyo
// @access  PRIVATE
const connectKlaviyo = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { apiKey } = req.body;

	const foundKlaviyoConnector = await Connector.findOne({
		$and: [{ entity: new ObjectId(entityId) }, { name: 'klaviyo' }],
	});
	if (foundKlaviyoConnector)
		return res
			.status(409)
			.json({ msg: 'Klaviyo is already connected to your business.' });

	await Connector.insertOne({
		entity: new ObjectId(entityId),
		name: 'klaviyo',
		key: apiKey,
		referrer: 'PRIVATE',
	});
	return res.status(201).json({ msg: 'Klaviyo connected successfully!' });
};

// @desc    Connect Gorgias
// @route   POST /api/connectors/gorgias
// @access  PRIVATE
const connectGorgias = async (req, res) => {
	const entityId = req.user.entity.entityId;
	const { domain, email, key } = req.body;

	const foundGorgiasConnector = await Connector.findOne({
		$and: [{ entity: new ObjectId(entityId) }, { name: 'gorgias' }],
	});
	if (foundGorgiasConnector)
		return res
			.status(409)
			.json({ msg: 'Gorgias is already connected to your business.' });

	const encodedString = Buffer.from(`${email}:${key}`).toString('base64');

	const options = {
		method: 'GET',
		url: `https://${domain}.gorgias.com/api/account`,
		headers: {
			accept: 'application/json',
			Authorization: `Basic ${encodedString}`,
		},
	};

	const gorgiasResponse = await krispyAxios(options);

	if (gorgiasResponse.data) {
		const newConnector = await Connector.insertOne({
			entity: new ObjectId(entityId),
			name: 'gorgias',
			domain: `${domain}.gorgias.com`,
			email: email,
			key: key,
			referrer: 'PRIVATE',
		});
		// * create krispy ai customer
		const krispyCustomer = await createGorgiasCustomer(entityId, 'krispy');
		// * create agent customer
		const agentCustomer = await createGorgiasCustomer(entityId, 'agent');
		// * save their customer ids in the connector
		await Connector.updateOne(
			{ _id: new ObjectId(newConnector.insertedId) },
			{
				$set: {
					metadata: {
						krispyAiId: krispyCustomer.id,
						agentId: agentCustomer.id,
					},
				},
			}
		);
		return res.status(201).json({ msg: 'Gorgias connected successfully!' });
	}
	if (gorgiasResponse.error) {
		console.error(gorgiasResponse.error);
		return res
			.status(400)
			.json({ msg: 'Some credentials might be incorrect.' });
	}
};

module.exports = {
	getAllConnectors,
	checkShopifyConnection,
	connectShopifyPublic,
	connectShopifyPrivate,
	disconnectShopify,
	embedShopifyData,
	connectKlaviyo,
	connectGorgias,
};
