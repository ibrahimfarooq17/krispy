const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middleware/errorHandler');
const { authToken } = require('../middleware/authToken');
const { getKnowledgeBase, updateKnowledgeBase, updateShopifyProduct, deleteShopifyProduct } = require('../controllers/knowledgeBase.controller');
const { validate } = require('../middleware/validators/knowledgeBase.controller.validator');
//POST routes


//PATCH routes
router.patch(
  '/',
  authToken,
  validate('updateKnowledgeBase'),
  errorHandler(updateKnowledgeBase)
);
router.patch(
  '/shopify/products/:productId',
  authToken,
  // validate('updateKnowledgeBase'),
  errorHandler(updateShopifyProduct)
);

//GET routes
router.get(
  '/',
  authToken,
  errorHandler(getKnowledgeBase)
);

//DELETE routes
router.delete(
  '/shopify/products/:productId',
  authToken,
  errorHandler(deleteShopifyProduct)
);

module.exports = router;
