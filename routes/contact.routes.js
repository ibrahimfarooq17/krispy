const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const { errorHandler } = require('../middleware/errorHandler');
const {
	getAllContacts,
	importContacts,
} = require('../controllers/contact.controller');

//POST routes
router.post('/import', authToken, errorHandler(importContacts));

//GET routes
router.get('/:page', authToken, errorHandler(getAllContacts));

module.exports = router;
