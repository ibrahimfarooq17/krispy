const { krispyAxios } = require('../utils');
const {
	checkGorgiasConnection,
	sendMessageToGorigias,
} = require('../@helpers/gorgiasHelpers');

const chatServiceBaseUrl = process.env.CHAT_API_URL;

const getContact = async ({ entityId, phoneNumber }) => {
	const { data, error } = await krispyAxios({
		method: 'GET',
		url: `${chatServiceBaseUrl}/api/contacts/${entityId}/${phoneNumber}`,
	});
	if (error) return { error };
	return { data };
};

const createContact = async ({ entityId, name, phoneNumber, consent }) => {
	const { data, error } = await krispyAxios({
		method: 'POST',
		url: `${chatServiceBaseUrl}/api/contacts`,
		body: {
			entityId,
			name,
			phoneNumber,
			consent,
		},
	});
	if (error) return { error };
	return { data };
};

const createBulkContacts = async ({ entityId, contacts }) => {
	const { data, error } = await krispyAxios({
		method: 'POST',
		url: `${chatServiceBaseUrl}/api/contacts/bulk`,
		body: {
			entityId,
			contacts,
		},
	});
	if (error) return { error };
	return { data };
};

const getActiveChat = async ({ contactId }) => {
	const { data, error } = await krispyAxios({
		method: 'GET',
		url: `${chatServiceBaseUrl}/api/chats/${contactId}`,
	});
	if (error) return { error };
	return { data };
};

const createChat = async ({ contactId, channel }) => {
	const { data, error } = await krispyAxios({
		method: 'POST',
		url: `${chatServiceBaseUrl}/api/chats`,
		body: {
			contactId,
			channel,
		},
	});
	if (error) return { error };
	return { data };
};

const sendWhatsappTextMessage = async ({
	chatId,
	messages,
	sentBy,
	exitState,
	conversationRoute,
	lastFormSession,
	action,
	entityId,
}) => {
	const { data, error } = await krispyAxios({
		method: 'POST',
		url: `${chatServiceBaseUrl}/api/chats/whatsapp/text-message/${chatId}`,
		body: {
			messages,
			sentBy,
			exitState,
			conversationRoute,
			lastFormSession,
			action,
		},
	});

	if (error) return { error };

	// ! ********** GORGIAS SEND MESSAGE **********
	const isGorgiasConnected = await checkGorgiasConnection(entityId);
	if (isGorgiasConnected) {
		sendMessageToGorigias({ messages, sentBy, entityId, chatId });
	}
	// ! ********** GORGIAS SEND MESSAGE **********

	return { data };
};

const sendWhatsappTemplateMessage = async ({
	chatId,
	templateId,
	templateVariables,
}) => {
	const { data, error } = await krispyAxios({
		method: 'POST',
		url: `${chatServiceBaseUrl}/api/chats/whatsapp/template-message/${chatId}`,
		body: {
			templateId,
			templateVariables,
		},
	});
	if (error) return { error };

	return { data };
};

module.exports = {
	createBulkContacts,
	getContact,
	createContact,
	getActiveChat,
	createChat,
	sendWhatsappTextMessage,
	sendWhatsappTemplateMessage,
};
