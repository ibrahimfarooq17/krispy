const semanticRouterSchema = {
	$jsonSchema: {
		bsonType: 'object',
		required: ['entity', 'name', 'utterances'],
		properties: {
			entity: {
				bsonType: 'objectId',
			},
			name: {
				bsonType: 'string',
			},
			utterances: {
				bsonType: 'array',
				items: {
					bsonType: 'string',
				},
			},
			forms: {
				bsonType: 'array',
				items: {
					bsonType: 'objectId',
				},
			},
			aiActionSessions: {
				bsonType: 'array',
				items: {
					bsonType: 'objectId',
					description: 'This refs to the Ai Action Session collection',
				},
			},
		},
	},
};

module.exports = semanticRouterSchema;
