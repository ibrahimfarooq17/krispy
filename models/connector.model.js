const connectorSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: ["entity", "name"],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      entity: {
        bsonType: "objectId",
      },
      name: {
        enum: ["shopify", "klaviyo", "gorgias"],
        bsonType: "string",
      },
      uri: {
        bsonType: "string",
      },
      key: {
        bsonType: "string",
      },
      referrer: {
        enum: ["PUBLIC", "PRIVATE"],
        bsonType: "string",
      },
      metadata: {
        bsonType: "object",
        description: "The additional details of the connector",
        additionalProperties: true,
      },
      email: {
        bsonType: "string",
        description:
          "The email id of the customer which is used for Gorgias account login",
      },
      domain: {
        bsonType: "string",
        description: "The Gorgias domain name of the customer's account.",
      },
    },
    additionalProperties: false,
  },
};

module.exports = connectorSchema;
