const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'checkoutSubscription': {
      return [
        body('pricingTierId')
          .notEmpty()
          .withMessage('pricingTierId is required.')
          .isMongoId()
          .withMessage('pricingTierId must be a valid ObjectId'),
        body('successUrl')
          .notEmpty()
          .withMessage('successUrl is required.')
          .isURL()
          .withMessage('successUrl must be a valid URL'),
        body('cancelUrl')
          .notEmpty()
          .withMessage('cancelUrl is required.')
          .isURL()
          .withMessage('cancelUrl must be a valid URL'),
      ];
    }
  }
};
