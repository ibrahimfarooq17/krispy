const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const { errorHandler } = require('../middleware/errorHandler');

const {
	validate,
} = require('../middleware/validators/form.controller.validator');
const { createForm } = require('../controllers/form.controller');

//POST Routes
router.post('/', authToken, validate('createForm'), errorHandler(createForm));

//GET Routes
//PATCH Routes
//DELETE Routes

module.exports = router;
