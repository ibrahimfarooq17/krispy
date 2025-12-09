const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const {
	getAllTemplates,
	deleteTemplate,
	addTemplate,
} = require('../controllers/template.controller');
const { errorHandler } = require('../middleware/errorHandler');
const {
	validate,
} = require('../middleware/validators/template.controller.validator');

//POST Routes
router.post('/', authToken, validate('addTemplate'), errorHandler(addTemplate));

//GET Routes
router.get('/', authToken, errorHandler(getAllTemplates));

//DELETE Routes
router.delete('/:templateId', authToken, errorHandler(deleteTemplate));

module.exports = router;
