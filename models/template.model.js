const templateSchema = {
	$jsonSchema: {
		bsonType: 'object',
		required: [
			'entity',
			'name',
			'language',
			'category',
			'flow',
			'components',
			'createdAt',
		],
		properties: {
			_id: {
				bsonType: 'objectId',
			},
			entity: {
				bsonType: 'objectId',
				description:
					'Reference to the business to whom this template belongs to.',
			},
			name: {
				bsonType: 'string',
				description: 'Name of the template.',
			},
			language: {
				enum: ['fr', 'en_US', 'it', 'de'],
				bsonType: 'string',
				description: 'The language of the template',
			},
			category: {
				enum: ['MARKETING'],
				bsonType: 'string',
				description: 'The meta category of the template',
			},
			flow: {
				enum: ['GENERAL', 'SHOPIFY_ABANDONED_CHECKOUT', 'OPT_IN'],
				bsonType: 'string',
				description: 'The flow upon which this template could be employed.',
			},
			components: {
				bsonType: 'array',
				items: {
					bsonType: 'object',
					required: ['type'],
					properties: {
						type: {
							enum: ['BODY', 'BUTTONS', 'FOOTER', 'HEADER'],
							bsonType: 'string',
							description: 'The type of component.',
						},
					},
					additionalProperties: true,
				},
			},
			status: {
				bsonType: 'string',
				description: 'The Meta approval status of the template.',
			},
			createdAt: {
				bsonType: 'date',
				description: 'Creation timestamp of chat',
			},
		},
		additionalProperties: false,
	},
};

module.exports = templateSchema;
