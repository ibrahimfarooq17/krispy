const { body } = require('express-validator');

const capitalize = (value) => {
  return value.replace(/\b\w/g, (match) => match.toUpperCase());
};

exports.validate = (method) => {
  switch (method) {
    case 'signUpUser': {
      return [
        body('businessName')
          .trim()
          .notEmpty()
          .withMessage('Business name is required')
          .isLength({ max: 50 })
          .withMessage('Business name must be no more than 50 characters')
          .customSanitizer((value) => capitalize(value)),
        body('firstName')
          .trim()
          .notEmpty()
          .withMessage('First name is required')
          .isLength({ max: 50 })
          .withMessage('First name must be no more than 50 characters')
          .customSanitizer((value) => capitalize(value)),
        body('lastName')
          .trim()
          .notEmpty()
          .withMessage('Last name is required')
          .isLength({ max: 50 })
          .withMessage('Last name must be no more than 50 characters')
          .customSanitizer((value) => capitalize(value)),
        body('email')
          .trim()
          .notEmpty()
          .withMessage('Email is required')
          .isEmail()
          .withMessage('Email is invalid')
          .normalizeEmail(),
        body('password')
          .trim()
          .notEmpty()
          .withMessage('Password is required')
          .isLength({ min: 8 })
          .withMessage('Password must be at least 8 characters')
          .matches(/\d/)
          .withMessage('Password must contain at least one number')
          .matches(/[a-zA-Z]/)
          .withMessage('Password must contain at least one letter'),
      ];
    }
    case 'logInUser': {
      return [
        body('email')
          .trim()
          .notEmpty()
          .withMessage('Email is required')
          .isEmail()
          .withMessage('Email is invalid')
          .normalizeEmail(),
        body('password').trim().notEmpty(),
      ];
    }
    case 'forgotPassword': {
      return [
        body('email')
          .trim()
          .notEmpty()
          .withMessage('Email is required')
          .isEmail()
          .withMessage('Email is invalid')
          .normalizeEmail(),
      ];
    }
    case 'resetPassword': {
      return [
        body('newPassword')
          .trim()
          .notEmpty()
          .withMessage('Password is required')
          .isLength({ min: 8 })
          .withMessage('Password must be at least 8 characters')
          .matches(/\d/)
          .withMessage('Password must contain at least one number')
          .matches(/[a-zA-Z]/)
          .withMessage('Password must contain at least one letter'),
        body('resetPasswordToken')
          .trim()
          .notEmpty()
          .withMessage('No reset password token provided')
      ]
    }
    case 'verifyUserEmail': {
      return [
        body('emailVerificationToken')
          .trim()
          .notEmpty()
          .withMessage('No email verification token provided')
      ]
    }
    case 'updatePassword': {
      return [
        body('newPassword')
          .trim()
          .notEmpty()
          .withMessage('New password is required.')
          .isLength({ min: 8 })
          .withMessage('Password must be at least 8 characters')
          .matches(/\d/)
          .withMessage('Password must contain at least one number')
          .matches(/[a-zA-Z]/)
          .withMessage('Password must contain at least one letter'),
        body('currentPassword')
          .trim()
          .notEmpty()
          .withMessage('Current password is required.')
      ]
    }
    case 'adminLogIn': {
      return [
        body('email')
          .trim()
          .notEmpty()
          .withMessage('Email is required')
          .isEmail()
          .withMessage('Email is invalid')
          .normalizeEmail(),
        body('password').trim().notEmpty(),
        body('entityId').trim().notEmpty().isMongoId(),
      ];
    }
  }
};
