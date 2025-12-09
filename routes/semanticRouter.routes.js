const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const { errorHandler } = require('../middleware/errorHandler');

const {
	validate,
} = require('../middleware/validators/semanticRouter.controller.validator');
const {
	createSemanticRouter,
	updateSemanticRouter,
	getSemanticRouters,
	deleteSemanticRouter,
} = require('../controllers/semanticRouter.controller');

//POST Routes
router.post(
	'/',
	authToken,
	validate('createSemanticRouter'),
	errorHandler(createSemanticRouter)
);

//GET Routes
router.get('/', authToken, errorHandler(getSemanticRouters));

//PATCH Routes
router.patch(
	'/:semanticRouterId',
	authToken,
	validate('updateSemanticRouter'),
	errorHandler(updateSemanticRouter)
);

//DELETE Routes
router.delete(
	'/:semanticRouterId',
	authToken,
	errorHandler(deleteSemanticRouter)
);

module.exports = router;
