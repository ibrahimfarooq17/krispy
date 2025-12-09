const express = require('express');
const router = express.Router();
const { authToken } = require('../middleware/authToken');
const {
  signUpUser,
  logInUser,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  verifyUserEmail,
  updatePassword,
  adminLogIn,
} = require('../controllers/user.controller');
const { errorHandler } = require('../middleware/errorHandler');
const {
  validate,
} = require('../middleware/validators/user.controller.validator');

router.post('/sign-up', validate('signUpUser'), errorHandler(signUpUser));
router.post('/log-in', validate('logInUser'), errorHandler(logInUser));
router.post('/forgot-password', validate('forgotPassword'), errorHandler(forgotPassword));
router.post('/reset-password', validate('resetPassword'), errorHandler(resetPassword));
router.post('/update-password', authToken, validate('updatePassword'), errorHandler(updatePassword));
router.post('/verify-email', validate('verifyUserEmail'), errorHandler(verifyUserEmail));
router.post('/admin/log-in', validate('adminLogIn'), errorHandler(adminLogIn));

router.get('/me', authToken, errorHandler(getCurrentUser));

module.exports = router;
