const knowledgeBaseSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "entity",
      "aboutUs",
      "additionalInfo"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      entity: {
        bsonType: "objectId",
        description: "Reference to the business to whom these statuses belong to",
      },
      aboutUs: {
        bsonType: "string",
        description: "Any business specific info that the user would like to add, to provide more context"
      },
      additionalInfo: {
        bsonType: "string",
        description: "Any other relevant info of the business"
      },
    },
    additionalProperties: true,
  },
};

module.exports = knowledgeBaseSchema;