const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { formatIds } = require('../utils');
const moment = require('moment');

const Chat = getCollection('chats');
const Message = getCollection('messages');
const Analytic = getCollection('analytics');
const Contact = getCollection('contacts');

// @desc    Gets the analytics of the business
// @route   GET /api/analytics
// @access  PRIVATE
const getAnalytics = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const analytics = await Analytic.findOne({
    entity: new ObjectId(entityId)
  });

  //getting count of chats with non-repeating contacts
  const chatAggregationRes = await Chat.aggregate([
    {
      $match: { entity: new ObjectId(entityId) }
    },
    {
      $group: {
        _id: "$contact",
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        totalCount: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        totalCount: 1
      }
    }
  ]).toArray();

  const conversingContactsCount = chatAggregationRes.pop()?.totalCount;
  const revenuePerRecipient = analytics?.shopifyAttributionRevenue / conversingContactsCount;

  //calculating open rate
  const chatsOfEntity = await Chat.find({
    entity: new ObjectId(entityId)
  }).toArray();
  const allMessagesCount = await Message.countDocuments({
    chat: { $in: chatsOfEntity.map(chat => chat._id) },
    read: { $ne: null }
  });
  const readMessagesCount = await Message.countDocuments({
    chat: { $in: chatsOfEntity.map(chat => chat._id) },
    read: true
  });

  return res.status(200).json({
    analytics: {
      shopifyAttributionRevenue: Number(analytics?.shopifyAttributionRevenue).toFixed(2),
      revenuePerRecipient: isNaN(revenuePerRecipient) ? "0.00" :
        Number(revenuePerRecipient).toFixed(2),
      openRate: Number((readMessagesCount / allMessagesCount) * 100).toFixed(2)
    }
  });
};

// @desc    Gets number of chats within a date period on each date
// @route   GET /api/analytics/chats/count
// @access  PRIVATE
const getChatsCount = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const daysInterval = parseInt(req.query.interval) || 30;
  const results = []; //contain the number of chats by date
  let totalChats = 0; //total number of chats during interval
  let highestChat = { date: null, totalChats: 0 }; //date and highest chats count of the interval

  const today = new Date();
  const daysAgo = new Date(today);
  daysAgo.setDate(today.getDate() - daysInterval);

  const previousDateRange = [...new Array(daysInterval)].map(
    (i, idx) => moment().startOf("day").subtract(idx, "days").format("YYYY-MM-DD")
  ).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  const aggregationRes = await Chat.aggregate([
    {
      $match: {
        entity: new ObjectId(entityId),
        createdAt: { $gte: daysAgo, $lte: today },
        channel: { $ne: 'DEMO' }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        totalChats: { $sum: 1 }
      }
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          }
        },
        totalChats: 1,
        _id: 0
      }
    },
    {
      $sort: {
        date: 1
      }
    }
  ]).toArray();

  aggregationRes?.forEach(res => {
    totalChats += res?.totalChats; //total chats calc
    //highest chat calc
    if (res?.totalChats > highestChat.totalChats) {
      highestChat.totalChats = res?.totalChats;
      highestChat.date = res?.date;
    }
  });

  for (let prevDate of previousDateRange) {
    const chatsExistOnDate = aggregationRes.find(
      res => moment(res?.date).format("YYYY-MM-DD") === prevDate
    );
    if (chatsExistOnDate)
      results.push({
        totalChats: chatsExistOnDate?.totalChats,
        date: moment(chatsExistOnDate?.date).format("YYYY-MM-DD")
      });
    else
      results.push({
        totalChats: 0,
        date: prevDate
      });
  }

  return res.status(200).json({
    analytics: {
      totalChats,
      highestChat,
      results,
    }
  });
};

// @desc    Gets number of chats where AI is active and false
// @route   GET /api/analytics/chats/ai-count
// @access  PRIVATE
const getAiChatsCount = async (req, res) => {
  const entityId = req.user.entity.entityId;
  let totalChats = 0;
  let totalAIChats = 0;
  let totalNonAIChats = 0;

  const aggregationRes = await Chat.aggregate([
    {
      $match: {
        entity: new ObjectId(entityId),
        channel: { $ne: 'DEMO' }
      }
    },
    {
      $group: {
        _id: '$aiConversing',
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        aiConversing: '$_id',
        count: 1,
      },
    },
  ]).toArray();

  //Calculate the total counts and percentages
  for (const group of aggregationRes) {
    totalChats += group.count;
    if (group.aiConversing) {
      totalAIChats += group.count;
    } else {
      totalNonAIChats += group.count;
    }
  }

  return res.status(200).json({
    analytics: {
      totalChats,
      totalAIChats,
      totalNonAIChats
    }
  });
};

// @desc    Gets number of messages where feedback rating is 0 and 10
// @route   GET /api/analytics/messages/rating-count
// @access  PRIVATE
const getMessagesRatingCount = async (req, res) => {
  const entityId = req.user.entity.entityId;

  const chatsOfEntity = await Chat.find({
    entity: new ObjectId(entityId),
    channel: {
      $ne: 'DEMO'
    }
  }).toArray();
  const allChatIds = chatsOfEntity.map(chat => new ObjectId(chat._id));

  const aggregationRes = await Message.aggregate([
    {
      $match: {
        chat: {
          $in: allChatIds
        }
      }
    },
    {
      $group: {
        _id: "$feedbackRating",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        feedbackRating: "$_id",
        count: 1
      }
    },
    {
      $group: {
        _id: null,
        ratings: {
          $push: {
            feedbackRating: "$feedbackRating",
            count: "$count"
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        ratings: 1
      }
    }
  ]).toArray();

  return res.status(200).json({
    analytics: aggregationRes?.[0]?.ratings
  });
};

// @desc    Gets number of contacts created within a date period on each date
// @route   GET /api/analytics/contacts/count
// @access  PRIVATE
const getContactsCount = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const daysInterval = parseInt(req.query.interval) || 30;
  const { consent } = req.query;

  const results = []; //contain the number of chats by date
  let totalContacts = 0; //total number of chats during interval
  let highestContact = { date: null, totalContacts: 0 }; //date and highest chats count of the interval

  const today = new Date();
  const daysAgo = new Date(today);
  daysAgo.setDate(today.getDate() - daysInterval);

  const previousDateRange = [...new Array(daysInterval)].map(
    (i, idx) => moment().startOf("day").subtract(idx, "days").format("YYYY-MM-DD")
  ).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  const aggregationRes = await Contact.aggregate([
    {
      $match: {
        entity: new ObjectId(entityId),
        createdAt: { $gte: daysAgo, $lte: today },
        ...(consent && {
          consent: consent === 'true'
        })
      }
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
          day: { $dayOfMonth: "$createdAt" }
        },
        totalContacts: { $sum: 1 }
      }
    },
    {
      $project: {
        date: {
          $dateFromParts: {
            year: "$_id.year",
            month: "$_id.month",
            day: "$_id.day",
          }
        },
        totalContacts: 1,
        _id: 0
      }
    },
    {
      $sort: {
        date: 1
      }
    }
  ]).toArray();

  aggregationRes?.forEach(res => {
    totalContacts += res?.totalContacts; //total chats calc
    //highest chat calc
    if (res?.totalContacts > highestContact.totalContacts) {
      highestContact.totalContacts = res?.totalContacts;
      highestContact.date = res?.date;
    }
  });

  for (let prevDate of previousDateRange) {
    const contactsExistOnDate = aggregationRes.find(
      res => moment(res?.date).format("YYYY-MM-DD") === prevDate
    );
    if (contactsExistOnDate)
      results.push({
        totalContacts: contactsExistOnDate?.totalContacts,
        date: moment(contactsExistOnDate?.date).format("YYYY-MM-DD")
      });
    else
      results.push({
        totalContacts: 0,
        date: prevDate
      });
  }

  return res.status(200).json({
    analytics: {
      totalContacts,
      highestContact,
      results,
    }
  });
};

module.exports = {
  getAnalytics,
  getChatsCount,
  getAiChatsCount,
  getMessagesRatingCount,
  getContactsCount
};
