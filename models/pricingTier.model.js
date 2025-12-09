const pricingTierSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "name",
      "type",
      "externalPriceId",
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      name: {
        bsonType: "string",
        description: "Name of the tier.",
      },
      type: {
        enum: [
          "STARTER",
          "PRO",
          "ELITE",
        ],
        bsonType: "string",
        description: "The type of tier",
      },
      externalPriceId: {
        bsonType: "string",
        description: "Stripe priceId to hook with this tier.",
      },
    },
    additionalProperties: false,
  },
};

module.exports = pricingTierSchema;

