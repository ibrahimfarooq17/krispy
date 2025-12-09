const aiActionSessionSchema = {
	$jsonSchema: {
		bsonType: 'object',
		required: ['action'],
		properties: {
			_id: {
				bsonType: 'objectId',
			},
			action: {
				bsonType: 'objectId',
				description: 'Object ID of the action hooked with this session',
			},
		},
		additionalProperties: true,
	},
};

module.exports = aiActionSessionSchema;
