const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'updatePreferences': {
      return [
        body('aiActive').optional().isBoolean().withMessage('Ai Active should be boolean'),
        body('onboardingStep').optional().isInt({ min: 0, max: 4 }).toInt(),
        body('agentName').optional().isString(),
        body('initialMessage').optional().isString(),
        body('storeLink').optional().isString(),
        body('brandVoice.friendly').optional().isInt({ min: 0, max: 100 }).toInt(),
        body('brandVoice.emojis').optional().isInt({ min: 0, max: 100 }).toInt(),
        body('brandVoice.serious').optional().isInt({ min: 0, max: 100 }).toInt(),
        body('brandVoice.caring').optional().isInt({ min: 0, max: 100 }).toInt(),
        body('utms')
          .optional()
          .isArray({ min: 1 })
          .withMessage('Atleast one UTM should be present.'),
        body('utms.*.key')
          .optional()
          .isString()
          .notEmpty().withMessage('UTM key is required.'),
        body('utms.*.value')
          .optional()
          .isString()
          .notEmpty().withMessage('UTM value is required.'),
      ];
    }
    case 'uploadFiles': {
      return body('textFile')
        .notEmpty()
        .withMessage('File object must not be empty')
        .isObject()
        .withMessage('File object must be an object')
        .bail()
        .custom((file) => {
          const requiredProperties = ['name', 'data', 'size', 'encoding', 'mimetype', 'md5', 'mv'];
          const missingProps = requiredProperties.filter((prop) => !file.hasOwnProperty(prop));
          if (missingProps.length > 0) return false;
          return true;
        })
        .withMessage('File must contain all properties.')
        .bail()
        .custom((file) => {
          const maxSizeBytes = 5 * 1024 * 1024; // 5 MB in bytes
          if (file.size > maxSizeBytes)
            return false
          return true;
        })
        .withMessage('File must be less than 5MB')
    }
    case 'addPhoneBinding': {
      return [
        body('type')
          .notEmpty()
          .withMessage('Type is required')
          .isString()
          .withMessage('Type should be a string.'),
        body('phoneNumber')
          .notEmpty()
          .withMessage('Phone number is required')
          .isString()
          .withMessage('Phone number should be a string.')
      ];
    }
  }
};
