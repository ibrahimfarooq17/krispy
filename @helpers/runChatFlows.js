const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const moment = require('moment');

const Flow = getCollection('flows');
const QueuedMessage = getCollection('queuedMessages');

const runChatFlows = async ({ entityId, contactId, buttonPayload }) => {
	if (!buttonPayload) return false;
	console.log(buttonPayload); //expected like cta-98127hewuh:flowId

	const parsedPayload = buttonPayload?.split(':');
	const ctaId = parsedPayload?.[0];
	const flowId = parsedPayload?.[1];

	if (!ctaId || !flowId) return false;

	const foundFlow = await Flow.findOne({
		parentFlowId: new ObjectId(flowId),
		'actions.ctaId': ctaId,
	});
	const foundAction = foundFlow?.actions?.find(
		(action) => action?.ctaId == ctaId
	);

	if (!foundAction) return false;

	const messageScheduledFor = moment()
		.add(foundAction?.delay?.days, 'days')
		.add(foundAction?.delay?.hours, 'hours');
	if (foundAction?.type == 'REPLY_TEXT' && foundAction?.textMessage)
		await QueuedMessage.insertOne({
			entity: new ObjectId(entityId),
			contact: new ObjectId(contactId),
			priority: 1,
			status: 'OPEN',
			metadata: {
				textMessage: foundAction?.textMessage,
				flow: new ObjectId(flowId),
			},
			scheduledFor: messageScheduledFor.toDate(),
			createdAt: new Date(),
		});
	else if (foundAction?.type == 'REPLY_TEMPLATE' && foundAction?.template)
		await QueuedMessage.insertOne({
			entity: new ObjectId(entityId),
			contact: new ObjectId(contactId),
			priority: 1,
			status: 'OPEN',
			metadata: {
				template: foundAction?.template,
				flow: new ObjectId(flowId),
			},
			scheduledFor: messageScheduledFor.toDate(),
			createdAt: new Date(),
		});
	return true;
};

module.exports = runChatFlows;
