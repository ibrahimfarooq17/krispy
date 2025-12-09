const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middleware/errorHandler');
const { getAllAiActions } = require('../controllers/aiAction.controller');

//GET routes
router.get('/', errorHandler(getAllAiActions));

module.exports = router;
