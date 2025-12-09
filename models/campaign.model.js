const campaignSchema = {
	$jsonSchema: {
		bsonType: 'object',
		required: [
			'entity',
			'name',
			'totalContacts',
			'contactsReached',
			'createdAt',
		],
		properties: {
			_id: {
				bsonType: 'objectId',
			},
			entity: {
				bsonType: 'objectId',
				description:
					'Reference to the business to whom this campaign belongs to.',
			},
			name: {
				bsonType: 'string',
				description: 'The name of the campaign',
			},
			template: {
				bsonType: 'objectId',
				description:
					'Reference to the template that will be sent on this campaign.',
			},
			totalContacts: {
				bsonType: 'number',
				description:
					'The total number of contacts to be reached for this campaign.',
			},
			contactsReached: {
				bsonType: 'number',
				description: 'The total number of contacts reached yet.',
			},
			scheduledFor: {
				bsonType: 'date',
				description: 'Date to run campaign',
			},
			createdAt: {
				bsonType: 'date',
				description: 'Date of automation activation',
			},
		},
		additionalProperties: false,
	},
};

module.exports = campaignSchema;
