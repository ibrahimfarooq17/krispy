const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const moment = require('moment');

const Flow = getCollection('flows');
const CtaClick = getCollection('ctaClicks');
const Template = getCollection('templates');

const trackCtaClick = async ({ contactId, buttonPayload }) => {
	if (!buttonPayload) return false;

	const parsedPayload = buttonPayload?.split(':');
	const ctaId = parsedPayload?.[0];
	const objectId = parsedPayload?.[1]; //this could be either campaign or flow id

	if (!ctaId || !objectId) return;

	const foundFlow = await Flow.findOne({ _id: new ObjectId(objectId) });
	const foundTemplate = await Template.findOne({
		'components.buttons.id': ctaId,
	});
	await CtaClick.insertOne({
		ctaId,
		contact: new ObjectId(contactId),
		...(foundFlow
			? { flow: new ObjectId(objectId) }
			: { campaign: new ObjectId(objectId) }),
		...(foundTemplate && { template: foundTemplate._id }),
		createdAt: new Date(),
	});
	return;
};

module.exports = trackCtaClick;
