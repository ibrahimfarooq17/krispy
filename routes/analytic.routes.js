const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const { errorHandler } = require('../middleware/errorHandler');
const { getChatsCount, getAiChatsCount, getMessagesRatingCount, getAnalytics, getContactsCount } = require('../controllers/analytic.controller');

//POST routes

//GET routes
router.get(
  '/',
  authToken,
  errorHandler(getAnalytics)
);
router.get(
  '/chats/count',
  authToken,
  errorHandler(getChatsCount)
);
router.get(
  '/chats/ai-count',
  authToken,
  errorHandler(getAiChatsCount)
);
router.get(
  '/messages/rating-count',
  authToken,
  errorHandler(getMessagesRatingCount)
);
router.get(
  '/contacts/count',
  authToken,
  errorHandler(getContactsCount)
);

module.exports = router;
