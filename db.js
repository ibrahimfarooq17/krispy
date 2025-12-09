const { MongoClient, ServerApiVersion } = require('mongodb');

const userSchema = require('./models/user.model');
const preferenceSchema = require('./models/preference.model');
const entitySchema = require('./models/entity.model');
const connectorSchema = require('./models/connector.model');
const chatSchema = require('./models/chat.model');
const messageSchema = require('./models/message.model');
const knowledgeBaseSchema = require('./models/knowledgeBase.model');
const analyticsSchema = require('./models/analytic.model');
const templateSchema = require('./models/template.model');
const formSchema = require('./models/form.model');
const campaignSchema = require('./models/campaign.model');
const queuedMessageSchema = require('./models/queuedMessage.model');
const contactSchema = require('./models/contact.model');
const qrCodeSchema = require('./models/qrCode.model');
const flowSchema = require('./models/flow.model');
const notificationSchema = require('./models/notification.model');
const formSessionSchema = require('./models/formSession.model');
const pricingTierSchema = require('./models/pricingTier.model');
const subscriptionSchema = require('./models/subscription.model');
const aiActionSchema = require('./models/aiAction.model');
const semanticRouterSchema = require('./models/semanticRouter.model');
const aiActionSessionSchema = require('./models/aiActionSession.model');

const dbCollections = [
	{
		collectionName: 'users',
		schema: userSchema,
	},
	{
		collectionName: 'preferences',
		schema: preferenceSchema,
	},
	{
		collectionName: 'connectors',
		schema: connectorSchema,
	},
	{
		collectionName: 'entities',
		schema: entitySchema,
	},
	{
		collectionName: 'chats',
		schema: chatSchema,
	},
	{
		collectionName: 'messages',
		schema: messageSchema,
	},
	{
		collectionName: 'knowledgeBases',
		schema: knowledgeBaseSchema,
	},
	{
		collectionName: 'analytics',
		schema: analyticsSchema,
	},
	{
		collectionName: 'templates',
		schema: templateSchema,
	},
	{
		collectionName: 'forms',
		schema: formSchema,
	},
	{
		collectionName: 'formSessions',
		schema: formSessionSchema,
	},
	{
		collectionName: 'campaigns',
		schema: campaignSchema,
	},
	{
		collectionName: 'queuedMessages',
		schema: queuedMessageSchema,
	},
	{
		collectionName: 'contacts',
		schema: contactSchema,
	},
	{
		collectionName: 'qrCodes',
		schema: qrCodeSchema,
	},
	{
		collectionName: 'flows',
		schema: flowSchema,
	},
	{
		collectionName: 'notifications',
		schema: notificationSchema,
	},
	{
		collectionName: 'semanticRouters',
		schema: semanticRouterSchema,
	},
	{
		collectionName: 'aiWorkers',
	},
	{
		collectionName: 'workerForms',
	},
	{
		collectionName: 'workerPlans',
	},
	{
		collectionName: 'workerRouters',
	},
	{
		collectionName: 'pricingTiers',
		schema: pricingTierSchema,
	},
	{
		collectionName: 'subscriptions',
		schema: subscriptionSchema,
	},
	{
		collectionName: 'aiActions',
		schema: aiActionSchema,
	},
	{
		collectionName: 'aiActionSessions',
		schema: aiActionSessionSchema,
	},
	{
		collectionName: 'ctaClicks',
	},
	{
		collectionName: 'attributions',
	},
];

const uri = process.env.DB_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

const connectToDB = async () => {
	try {
		await client.connect();
		console.log('You successfully connected to MongoDB!', dbName);
		//Collections instantiation
		console.log('Instantiating database collections...');
		const collections = await client.db(dbName).listCollections().toArray();
		const collectionNames = collections.map((c) => c.name);
		for (let collection of dbCollections) {
			if (!collectionNames.includes(collection.collectionName))
				await client.db(dbName).createCollection(collection.collectionName);
			await client.db(dbName).command({
				collMod: collection.collectionName,
				validator: collection.schema,
			});
		}
		console.log('Collections instantiated!');
	} catch (e) {
		console.error(e);
	}
};

const getCollection = (collectionName) => {
	return client.db(dbName).collection(collectionName);
};

module.exports = {
	connectToDB,
	getCollection,
};
