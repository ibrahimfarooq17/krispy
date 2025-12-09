const flowSchema = {
	$jsonSchema: {
		bsonType: 'object',
		required: ['entity', 'name', 'trigger', 'actions', 'isActive', 'createdAt'],
		properties: {
			_id: {
				bsonType: 'objectId',
			},
			entity: {
				bsonType: 'objectId',
				description: 'Reference to the business to whom this flow belongs to.',
			},
			parentFlowId: {
				bsonType: 'objectId',
				description:
					'If current flow is a subflow, this refers to the parent flow object id.',
			},
			name: {
				bsonType: 'string',
				description: 'Name of the flow',
			},
			trigger: {
				enum: [
					'KLAVIYO_WEBHOOK',
					'SHOPIFY_ORDER_RECEIVED',
					'SHOPIFY_ABANDONED_CHECKOUT',
					'MATCHED_MESSAGE',
					'CTA',
				],
				bsonType: 'string',
				description: 'The type of trigger, which will invoke the actions.',
			},
			actions: {
				bsonType: 'array',
				items: {
					bsonType: 'object',
					required: ['type'],
					properties: {
						type: {
							enum: ['REPLY_TEMPLATE', 'REPLY_TEXT'],
							bsonType: 'string',
						},
					},
					additionalProperties: true,
				},
			},
			isActive: {
				bsonType: 'bool',
				description: 'Whether the flow is active or not.',
			},
			tree: {
				bsonType: 'object',
				description: 'The tree of the node and edges of the flow.',
				additionalProperties: true,
			},
			metadata: {
				bsonType: 'object',
				description: 'Any additional details about the flow.',
				additionalProperties: true,
			},
			createdAt: {
				bsonType: 'date',
				description: 'Date of flow creation',
			},
		},
		additionalProperties: false,
	},
};

module.exports = flowSchema;
