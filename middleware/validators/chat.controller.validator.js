const { body } = require('express-validator');

exports.validate = (method) => {
	switch (method) {
		case 'connectMetaChat': {
			return [
				body('channelId')
					.trim()
					.notEmpty()
					.withMessage('Channel ID is required.')
					.isString()
					.withMessage('Channel ID should be a string.'),
				body('partnerId')
					.trim()
					.notEmpty()
					.withMessage('Partner ID is required.')
					.isString()
					.withMessage('Partner ID should be a string.'),
			];
		}
		case 'sendWhatsappMessage': {
			return [
				body('text')
					.notEmpty()
					.withMessage('Message text is required.')
					.isString()
					.withMessage('Message text should be a string.'),
			];
		}
		case 'sendDemoMessage': {
			return [
				body('text')
					.notEmpty()
					.withMessage('Message text is required.')
					.isString()
					.withMessage('Message text should be a string.'),
			];
		}
	}
};
