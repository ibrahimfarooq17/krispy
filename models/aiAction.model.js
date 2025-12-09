const aiActionSchema = {
	$jsonSchema: {
		bsonType: 'object',
		required: ['name', 'type', 'description'],
		properties: {
			_id: {
				bsonType: 'objectId',
			},
			name: {
				bsonType: 'string',
				description: 'Name of the action',
			},
			type: {
				enum: ['SEND_EMAIL', 'WEBHOOK'],
				bsonType: 'string',
				description: 'The unique enum type of action.',
			},
			description: {
				bsonType: 'string',
				description:
					'The description and any additional details about the action to perform',
			},
		},
		additionalProperties: false,
	},
};

module.exports = aiActionSchema;
