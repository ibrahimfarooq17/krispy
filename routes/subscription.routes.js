const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const { errorHandler } = require('../middleware/errorHandler');
const { validate } = require('../middleware/validators/subscription.controller.validator');
const { checkoutSubscription } = require('../controllers/subscription.controller');

//POST Routes
router.post(
  '/checkout',
  authToken,
  validate('checkoutSubscription'),
  errorHandler(checkoutSubscription)
);

//GET Routes
//PATCH Routes
//DELETE Routes

module.exports = router;
