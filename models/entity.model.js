const entitySchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "name"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      name: {
        bsonType: "string"
      }
    },
    additionalProperties: false
  }
};

module.exports = entitySchema;