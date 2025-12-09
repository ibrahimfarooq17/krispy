const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'messageOnAbandonedCart': {
      return [
        body('phone')
          .trim()
          .notEmpty()
          .withMessage('Phone is required.'),
        body('name')
          .trim()
          .notEmpty()
          .withMessage('Name is required.'),
        body('checkoutUrl')
          .trim()
          .notEmpty()
          .withMessage('Checkout URL is required.'),
        body('shopName')
          .trim()
          .notEmpty()
          .withMessage('Shop name is required.'),
      ];
    }
  }
};
