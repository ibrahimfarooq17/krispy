const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createQrCode': {
      return [
        body('title')
          .notEmpty()
          .withMessage('Title is required.')
          .isString()
          .withMessage('Title should be a string.')
          .isLength({ min: 1, max: 512 })
          .withMessage('Title length should be between 1 and 512 characters.'),
        body('message')
          .notEmpty()
          .withMessage('Message is required.')
          .isString()
          .withMessage('Message should be a string.')
          .isLength({ min: 1, max: 1000 })
          .withMessage('Message length should be between 1 and 1000 characters.'),
      ];
    }
    case 'updateQrCode': {
      return [
        body('title')
          .optional()
          .isString()
          .withMessage('Title should be a string.')
          .isLength({ min: 1, max: 512 })
          .withMessage('Title length should be between 1 and 512 characters.'),
        body('message')
          .optional()
          .isString()
          .withMessage('Message should be a string.')
          .isLength({ min: 1, max: 1000 })
          .withMessage('Message length should be between 1 and 1000 characters.'),
      ];
    }
  }
};
