const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const {
  updatePreferences,
  getPreferences,
  uploadFiles,
  addPhoneBinding,
} = require('../controllers/preference.controller');
const { errorHandler } = require('../middleware/errorHandler');
const {
  validate,
} = require('../middleware/validators/preference.controller.validator');

//POST routes
router.post(
  '/upload-files',
  authToken,
  errorHandler(uploadFiles)
);

//PATCH routes
router.patch(
  '/update',
  authToken,
  validate('updatePreferences'),
  errorHandler(updatePreferences)
);
router.patch(
  '/add-phone-binding',
  authToken,
  validate('addPhoneBinding'),
  errorHandler(addPhoneBinding)
);

//GET routes
router.get('/get', authToken, errorHandler(getPreferences));

module.exports = router;
