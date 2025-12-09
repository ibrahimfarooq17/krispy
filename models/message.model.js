const messageSchema = {
	$jsonSchema: {
		bsonType: 'object',
		required: ['content', 'sentBy', 'chat', 'msgTimestamp'],
		properties: {
			_id: {
				bsonType: 'objectId',
			},
			externalId: {
				bsonType: 'string',
				description: 'The ID of the resource created externally.',
			},
			content: {
				bsonType: 'string',
				description: 'The content of the message.',
			},
			originalContent: {
				bsonType: 'string',
				description:
					'If a feedback/suggested message is added, the original message is stored here.',
			},
			links: {
				bsonType: 'array',
				items: {
					bsonType: 'string',
				},
			},
			sentBy: {
				enum: ['CONTACT', 'INTERNAL_USER', 'AI'],
				bsonType: 'string',
				description:
					'Whether the message has been sent by the customer (client), internal user of Krispy, or the AI.',
			},
			chat: {
				bsonType: 'objectId',
				description: 'The chat ID to which this message belongs.',
			},
			feedbackRating: {
				bsonType: 'number',
				bsonType: 'int',
				minimum: 0,
				maximum: 10,
				exclusiveMaximum: false,
				description: 'The rating of the message made by the AI.',
			},
			exitState: {
				bsonType: 'bool',
			},
			lastFormSession: {
				bsonType: 'objectId',
			},
			conversationRoute: {
				bsonType: 'objectId',
			},
			msgTimestamp: {
				bsonType: 'date',
				description: 'Timestamp of when the message was sent.',
			},
			read: {
				bsonType: 'bool',
				description: 'Whether message has been read by contact or no.',
			},
			action: {
				bsonType: 'object',
				additionalProperties: true,
			},
			metadata: {
				bsonType: 'object',
				description:
					'Any additional info of the message i.e. templateId, campaignId etc.',
				additionalProperties: true,
			},
		},
		additionalProperties: false,
	},
};

module.exports = messageSchema;
