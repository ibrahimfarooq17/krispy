const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { formatIds, krispyAxios } = require('../utils');
const { getQueryFromMsg } = require('../@helpers/getQueryFromMsg');
const { embedText } = require('../services/aiService');

const Message = getCollection('messages');
const Chat = getCollection('chats');

// @desc    Gets all messages of a chat
// @route   GET /api/messages/chat/:chatId
// @access  PRIVATE
const getMessagesOfChat = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const { chatId } = req.params;

  const foundChat = await Chat.findOne({
    _id: new ObjectId(chatId),
  });
  if (!foundChat)
    return res.status(404).json({
      msg: "Chat not found. Make sure the chat id correct and belongs to your business."
    })
  const messages = await Message.find({ chat: new ObjectId(chatId) }).toArray();
  return res.status(200).json({ messages: formatIds(messages, 'message') });
};

// @desc    Adds rating on message
// @route   POST /api/messages/add-rating/:messageId
// @access  PRIVATE
const addMessageRating = async (req, res) => {
  const { messageId } = req.params;
  const { feedbackRating } = req.body;

  const foundMessage = await Message.findOne({
    _id: new ObjectId(messageId)
  });
  if (!foundMessage)
    return res.status(404).json({ msg: "Message not found." });

  if (foundMessage?.sentBy !== 'AI')
    return res.status(400).json({ msg: "Rating can only be added on a message sent by AI" });

  await Message.updateOne(
    { _id: new ObjectId(messageId) },
    { $set: { feedbackRating } }
  );
  return res.status(200).json({ msg: "Rating added on message." });
};

// @desc    Adds feedback on message
// @route   POST /api/messages/add-feedback/:messageId
// @access  PRIVATE
const addMessageFeedback = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const { messageId } = req.params;
  const { feedback } = req.body;

  const foundMessage = await Message.findOne({
    _id: new ObjectId(messageId)
  });
  if (!foundMessage)
    return res.status(404).json({ msg: "Message not found." });

  const userQueries = await getQueryFromMsg(messageId);
  let queryStr = '';
  userQueries?.map(query => queryStr += query?.content + '? ');

  const { error } = await embedText({
    text: queryStr + feedback,
    metadata: {
      category: "feedback",
      user_query: queryStr
    },
    entityId
  });
  if (error)
    return res.status(500).json({ msg: 'Error embedding feedback.', details: error });

  await Message.findOneAndUpdate(
    { _id: new ObjectId(messageId) },
    {
      $set: {
        content: feedback,
        originalContent: foundMessage?.content
      }
    }
  );
  return res.status(200).json({ msg: "Feedback added on message." });
};

module.exports = {
  getMessagesOfChat,
  addMessageRating,
  addMessageFeedback
};
