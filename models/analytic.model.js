const analyticsSchema = {
	$jsonSchema: {
		bsonType: 'object',
		required: ['entity'],
		properties: {
			_id: {
				bsonType: 'objectId',
			},
			entity: {
				bsonType: 'objectId',
				description:
					'Reference to the business to whom this automation belongs.',
			},
			shopifyAttributionRevenue: {
				bsonType: 'number',
				description: 'Amount of revenue generated through Krispy in USD.',
			},
		},
		additionalProperties: true,
	},
};

module.exports = analyticsSchema;
