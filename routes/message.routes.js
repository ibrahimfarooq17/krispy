const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const { errorHandler } = require('../middleware/errorHandler');
const {
  getMessagesOfChat, addMessageRating, addMessageFeedback
} = require('../controllers/message.controller');
const { validate } = require('../middleware/validators/message.controller.validator');

//POST routes
router.post(
  '/add-rating/:messageId',
  authToken,
  validate('addMessageRating'),
  errorHandler(addMessageRating)
);
router.post(
  '/add-feedback/:messageId',
  authToken,
  errorHandler(addMessageFeedback)
);

//GET routes
router.get(
  '/chat/:chatId',
  authToken,
  errorHandler(getMessagesOfChat)
);

module.exports = router;
