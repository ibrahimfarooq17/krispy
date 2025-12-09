const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const moment = require('moment');

const Flow = getCollection('flows');
const QueuedMessage = getCollection('queuedMessages');

const runTriggers = async ({ entityId, contactId, receivedMessage }) => {
	const messageFlows = await Flow.find({
		entity: new ObjectId(entityId),
		isActive: true,
		trigger: 'MATCHED_MESSAGE',
	}).toArray();

	const foundFlow = messageFlows?.find((messageFlow) =>
		receivedMessage
			?.toUpperCase()
			?.includes(messageFlow?.metadata?.textToMatch?.toUpperCase())
	);
	if (!foundFlow) return false;

	const batchQueuedMessages = QueuedMessage.initializeOrderedBulkOp();
	for (let action of foundFlow.actions) {
		const messageScheduledFor = moment()
			.add(action?.delay?.days, 'days')
			.add(action?.delay?.hours, 'hours');

		if (action?.type == 'REPLY_TEXT' && action?.textMessage)
			batchQueuedMessages.insert({
				entity: new ObjectId(entityId),
				contact: new ObjectId(contactId),
				priority: 1,
				status: 'OPEN',
				metadata: {
					textMessage: action?.textMessage,
					flow: new ObjectId(foundFlow._id),
				},
				scheduledFor: messageScheduledFor.toDate(),
				createdAt: new Date(),
			});
		else if (action?.type == 'REPLY_TEMPLATE' && action?.template)
			batchQueuedMessages.insert({
				entity: new ObjectId(entityId),
				contact: new ObjectId(contactId),
				priority: 1,
				status: 'OPEN',
				metadata: {
					template: action?.template,
					flow: new ObjectId(foundFlow._id),
				},
				scheduledFor: messageScheduledFor.toDate(),
				createdAt: new Date(),
			});
	}
	await batchQueuedMessages.execute();
	return true;
};

module.exports = runTriggers;
