const contactSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "entity",
      "name",
      "createdAt"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      entity: {
        bsonType: "objectId",
        description: "Reference to the business to whom this contact belongs to.",
      },
      name: {
        bsonType: "string",
        description: "The name of the contact.",
      },
      phoneNumber: {
        bsonType: "string",
        description: "The phone number of the contact - without any spaces or symbols",
      },
      shopifyCustomerId: {
        bsonType: "number",
        description: "The customer ID of the contact on shopify.",
      },
      totalSpent: {
        bsonType: "number",
        description: "The total amount spent by the contact on Shopify Store.",
      },
      consent: {
        bsonType: "bool",
        description: "Whether the contact has allowed consent to be reached out or no.",
      },
      metadata: {
        bsonType: "object",
        description: "Additional info of this contact.",
        additionalProperties: true,
      },
      createdAt: {
        bsonType: "date",
        description: "Date of contact creation.",
      },
    },
    additionalProperties: false,
  },
};

module.exports = contactSchema;

