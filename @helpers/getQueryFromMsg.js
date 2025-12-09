const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

const Message = getCollection('messages');

const getQueryFromMsg = async (aiMessageId) => {
  //this will hold the query messages that the user
  //sent in which the AI responded
  const queryMsgs = [];
  let aiMessageFound = false;

  const foundMessage = await Message.findOne({
    _id: new ObjectId(aiMessageId)
  });
  if (!foundMessage)
    return [];

  const chatThread = await Message.find({
    chat: new ObjectId(foundMessage?.chat)
  })
    .sort({ msgTimestamp: -1 })
    .toArray();

  for (let msg of chatThread) {
    if (msg._id.equals(new ObjectId(aiMessageId))) {
      aiMessageFound = true;
      continue;
    }
    if (aiMessageFound) {
      if ((msg?.sentBy === 'AI' || msg?.sentBy === 'INTERNAL_USER') && queryMsgs.length != 0)
        break;
      else {
        if (msg?.sentBy === 'CONTACT')
          queryMsgs.push(msg)
      }
    }
  }
  queryMsgs.reverse();
  return queryMsgs;
};

module.exports = { getQueryFromMsg };
