const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'createCampaign': {
      return [
        body('name')
          .notEmpty()
          .withMessage('Campaign name is required.'),
        body('templateId')
          .notEmpty()
          .withMessage('Template is required.')
      ];
    }
    case 'testCampaign': {
      return [
        body('templateId')
          .notEmpty()
          .withMessage('Template is required.'),
        body('contacts')
          .isArray().withMessage('Contacts must be an array')
          .isArray({ min: 1, max: 4 }).withMessage('Contacts array must have a length between 1 and 4'),
        body('contacts.*')
          .isObject().withMessage('Each contact must be an object'),
        body('contacts.*.phoneNumber')
          .isString().withMessage('Phone number must be a string')
          .notEmpty().withMessage('Phone number is required'),
        body('contacts.*.name')
          .isString().withMessage('Name must be a string')
          .notEmpty().withMessage('Name is required'),
      ];
    }
  }
};
