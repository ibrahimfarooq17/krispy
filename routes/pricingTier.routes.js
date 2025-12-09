const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middleware/errorHandler');
const { getAllPricingTiers } = require('../controllers/pricingTier.controller');

//GET routes
router.get('/', errorHandler(getAllPricingTiers));

module.exports = router;
