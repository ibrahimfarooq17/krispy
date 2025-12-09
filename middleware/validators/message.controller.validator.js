const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'addMessageRating': {
      return [
        body('feedbackRating')
          .notEmpty()
          .withMessage('Rating is required.')
          .isInt()
          .withMessage('Rating must be an integer.')
          .isInt({ min: 0, max: 10 })
          .withMessage('Feedback rating must be between 0 and 10.'),
      ];
    }
  }
};
