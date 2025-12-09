const { body } = require('express-validator');

exports.validate = (method) => {
  switch (method) {
    case 'updateKnowledgeBase': {
      return [
        body('additionalInfo')
          .trim()
          .optional()
          .isString()
          .withMessage('Additional Information should be a string.')
          .isLength({ min: 40 })
          .withMessage('Additional Information length should be atleast 40 characters.'),
        body('aboutUs')
          .trim()
          .optional()
          .isString()
          .withMessage('About us should be a string.')
          .isLength({ min: 40 })
          .withMessage('About us length should be atleast 40 characters.'),
        body('scrapingUrl')
          .trim()
          .optional()
          .isURL()
          .withMessage('Scraping URL should be valid.'),
        body('systemPrompt')
          .trim()
          .optional()
          .isString()
          .withMessage('System prompt should be a string.')
          .isLength({ min: 10, max: 2000 })
          .withMessage('System prompt length should be between 40 and 2000'),
        body('aiName')
          .trim()
          .optional()
          .isString()
          .withMessage('System prompt should be a string.')
          .isLength({ min: 5, max: 100 })
          .withMessage('AI name length should be between 5 and 100'),
      ];
    }
  }
};
