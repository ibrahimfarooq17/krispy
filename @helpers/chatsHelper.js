const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

const Chat = getCollection('chats');
const Message = getCollection('messages');

const getChatByChatId = async (chatId) => {
	return await Chat.findOne({ _id: new ObjectId(chatId) });
};

const updateChatMetadata = async (chatId, gorgiasTicketId) => {
	await Chat.findOneAndUpdate(
		{ _id: new ObjectId(chatId) },
		{ $set: { metadata: { gorgiasTicketId } } }
	);
};

const getAllMessagesInChat = async (chatId) => {
	return await Message.find({ chat: new ObjectId(chatId) })
		.sort({ msgTimestamp: 1 })
		.toArray();
};

module.exports = {
	getChatByChatId,
	updateChatMetadata,
	getAllMessagesInChat,
};
