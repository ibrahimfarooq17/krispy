const subscriptionSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "entity",
      "pricingTier",
      "isActive",
      "createdAt"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      entity: {
        bsonType: "objectId",
        description: "Reference to the business to who subscribed.",
      },
      pricingTier: {
        bsonType: "objectId",
        description: "ID of the pricing tier which was subscribed to.",
      },
      isActive: {
        bsonType: "bool",
        description: "Whether the subscription is active or not.",
      },
      metadata: {
        bsonType: "object",
        description: "The additional details of the subscription",
        additionalProperties: true,
      },
      createdAt: {
        bsonType: "date",
        description: "Date of creation",
      },
    },
    additionalProperties: false,
  },
};

module.exports = subscriptionSchema;

