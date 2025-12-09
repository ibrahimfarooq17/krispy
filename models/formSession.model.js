const formSessionSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "form",
      "chat",
      "isActive",
      "fields",
      "createdAt"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      form: {
        bsonType: "objectId",
        description: "Reference to the form to whom this session belongs to.",
      },
      chat: {
        bsonType: "objectId",
        description: "Reference to the chat to whom this session belongs to.",
      },
      isActive: {
        bsonType: "bool",
        description: "Whether the session is active or inactive.",
      },
      fields: {
        bsonType: "object",
        description: "Fields of session",
        additionalProperties: true,
      },
      createdAt: {
        bsonType: "date",
        description: "Creation date of session.",
      },
    },
    additionalProperties: false,
  },
};

module.exports = formSessionSchema;

