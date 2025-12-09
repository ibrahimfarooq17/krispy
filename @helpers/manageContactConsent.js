const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { sendWhatsappTextMessage } = require('../services/chatService');

const Contact = getCollection('contacts');

const manageContactConsent = async ({
	chatId,
	contactId,
	receivedMessage,
	buttonPayload,
	rejectedReply,
}) => {
	let updatedConsent = null;
	const parsedPayload = buttonPayload?.split('-')?.[1];
	if (parsedPayload === 'accept_marketing') updatedConsent = true;
	else if (parsedPayload === 'reject_marketing') updatedConsent = false;
	else if (receivedMessage?.toUpperCase() === 'STOP') updatedConsent = false;
	else updatedConsent = true;

	if (updatedConsent == false) {
		//send confirmation message for opt out
		await sendWhatsappTextMessage({
			chatId: chatId,
			messages: [rejectedReply],
			sentBy: 'AI',
		});
	}
	//update consent on contact
	await Contact.findOneAndUpdate(
		{ _id: new ObjectId(contactId) },
		{ $set: { consent: updatedConsent } }
	);
	return updatedConsent;
};

module.exports = manageContactConsent;
