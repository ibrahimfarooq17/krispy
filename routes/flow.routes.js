const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middleware/errorHandler');
const { authToken } = require('../middleware/authToken');
const {
  validate,
} = require('../middleware/validators/flow.controller.validator');
const { createFlow, getAllFlows, updateFlow, deleteFlow, getSingleFlow } = require('../controllers/flow.controller');

//POST routes
router.post(
  '/',
  authToken,
  validate('createFlow'),
  errorHandler(createFlow)
);

//GET routes
router.get(
  '/',
  authToken,
  errorHandler(getAllFlows)
);
router.get(
  '/:flowId',
  authToken,
  errorHandler(getSingleFlow)
);

//PATCH routes
router.patch(
  '/:flowId',
  authToken,
  validate('updateFlow'),
  errorHandler(updateFlow)
);

//DELETE routes
router.delete(
  '/:flowId',
  errorHandler(deleteFlow)
);

module.exports = router;
