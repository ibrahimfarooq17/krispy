const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const { errorHandler } = require('../middleware/errorHandler');
const { validate } = require('../middleware/validators/qrCode.controller.validator');
const {
  createQrCode,
  getAllQrCodes,
  updateQrCode,
  deleteQrCode
} = require('../controllers/qrCode.controller');

//POST Routes
router.post(
  '/',
  authToken,
  validate('createQrCode'),
  errorHandler(createQrCode)
);

//GET Routes
router.get(
  '/',
  authToken,
  errorHandler(getAllQrCodes)
);

//PATCH Routes
router.patch(
  '/:qrCodeId',
  authToken,
  validate('updateQrCode'),
  errorHandler(updateQrCode)
);

//DELETE Routes
router.delete(
  '/:qrCodeId',
  authToken,
  errorHandler(deleteQrCode)
);

module.exports = router;
