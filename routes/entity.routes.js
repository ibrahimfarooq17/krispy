const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middleware/errorHandler');
const { getAllEntities } = require('../controllers/entity.controller');

//POST routes

//GET routes
router.get(
  '/',
  errorHandler(getAllEntities)
);

module.exports = router;
