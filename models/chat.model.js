const chatSchema = {
	$jsonSchema: {
		bsonType: 'object',
		required: [
			'channel',
			'entity',
			'isActive',
			'aiConversing',
			'lastMsgTimestamp',
			'createdAt',
		],
		properties: {
			_id: {
				bsonType: 'objectId',
			},
			entity: {
				bsonType: 'objectId',
				description: 'Reference to the business to whom this chat belongs',
			},
			contact: {
				bsonType: 'objectId',
				description: 'Reference to the contact with whom the chat is started.',
			},
			aiConversing: {
				bsonType: 'bool',
				description: 'Whether the AI is conversing or not',
			},
			channel: {
				enum: ['SHOPIFY_EXTENSION', 'WHATSAPP', 'DEMO', 'SLACK'],
				bsonType: 'string',
				description: 'The channel from where the chat started',
			},
			isActive: {
				bsonType: 'bool',
				description:
					'Whether the chat is active or not. Chat inactivates after 24 hours of last message.',
			},
			threadId: {
				bsonType: 'string',
				description: 'Only for DEMO chats.',
			},
			lastMsgTimestamp: {
				bsonType: 'date',
				description: 'Timestamp of last message sent.',
			},
			createdAt: {
				bsonType: 'date',
				description: 'Creation timestamp of chat',
			},
			metadata: {
				bsonType: 'object',
				description: 'Additional info of this chat.',
				additionalProperties: true,
			},
		},
		additionalProperties: false,
	},
};

module.exports = chatSchema;
