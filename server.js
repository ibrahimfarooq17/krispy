const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
require('dotenv').config();
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const entityRoutes = require('./routes/entity.routes');
const userRoutes = require('./routes/user.routes');
const preferenceRoutes = require('./routes/preference.routes');
const connectorRoutes = require('./routes/connector.routes');
const analyticRoutes = require('./routes/analytic.routes');
const chatRoutes = require('./routes/chat.routes');
const messageRoutes = require('./routes/message.routes');
const templateRoutes = require('./routes/template.routes');
const knowledgeBaseRoutes = require('./routes/knowledgeBase.routes');
const campaignRoutes = require('./routes/campaign.routes');
const qrCodeRoutes = require('./routes/qrCode.routes');
const contactRoutes = require('./routes/contact.routes');
const flowRoutes = require('./routes/flow.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const semanticRouterRoutes = require('./routes/semanticRouter.routes');
const formRoutes = require('./routes/form.routes');
const aiActionRoutes = require('./routes/aiAction.routes');
const pricingTierRoutes = require('./routes/pricingTier.routes');

const { connectToDB } = require('./db');
const chalk = require('chalk');

//-------------MIDDLEWARE----------
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));
app.use(fileUpload());
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, OPTIONS, PUT, PATCH, DELETE'
	);
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	next();
});
//-------------MIDDLEWARE----------

app.use('/api/entities', entityRoutes);
app.use('/api/users', userRoutes);
app.use('/api/preferences', preferenceRoutes);
app.use('/api/connectors', connectorRoutes);
app.use('/api/analytics', analyticRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/knowledge-bases', knowledgeBaseRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/qr-codes', qrCodeRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/flows', flowRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/semantic-routers', semanticRouterRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/ai-actions', aiActionRoutes);
app.use('/api/pricing-tiers', pricingTierRoutes);

//api docs
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

//global error handler
app.use((err, req, res, next) => {
	console.error(chalk.bgRedBright(err));
	res.status(500).json({
		msg: err.message,
		details: err,
	});
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, async () => {
	console.log(`Server started on PORT ${PORT}`);
	await connectToDB();
});

module.exports = { app, server };
