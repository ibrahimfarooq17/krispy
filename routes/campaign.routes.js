const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middleware/errorHandler');
const { authToken } = require('../middleware/authToken');
const {
	validate,
} = require('../middleware/validators/campaign.controller.validator');
const {
	createCampaign,
	testCampaign,
	getAllCampaigns,
	deleteCampaign,
} = require('../controllers/campaign.controller');

//POST routes
router.post(
	'/',
	authToken,
	validate('createCampaign'),
	errorHandler(createCampaign)
);
router.post(
	'/test',
	authToken,
	validate('testCampaign'),
	errorHandler(testCampaign)
);

//GET routes
router.get('/', authToken, errorHandler(getAllCampaigns));

//DELETE ROUTES
router.delete('/:campaignId', authToken, errorHandler(deleteCampaign));

module.exports = router;
