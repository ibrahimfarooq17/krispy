const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { sendEmail } = require('../services/emailingService');
const { krispyAxios } = require('../utils');

const AiAction = getCollection('aiActions');
const User = getCollection('users');

const runAiActions = async ({ entityId, aiActionSession, formData }) => {
	const foundAction = await AiAction.findOne({
		_id: new ObjectId(aiActionSession?.action),
	});
	if (foundAction?.type === 'SEND_EMAIL') {
		const foundUser = await User.findOne({
			entity: new ObjectId(entityId),
		});
		await sendEmail({
			to: foundUser.email,
			subject: 'Action performed',
			text: `The following conversation requires your attention. Data: ${JSON.stringify(
				data
			)}`,
		});
		console.log('AI ACTION RUN: SEND_EMAIL');
	} else if (foundAction?.type === 'WEBHOOK') {
		await krispyAxios({
			method: 'POST',
			url: aiActionSession?.webhookUrl,
			body: formData,
		});
		console.log('AI ACTION RUN: WEBHOOK');
	}
	return;
};

module.exports = runAiActions;
