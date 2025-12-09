const notificationSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "entityId",
      "messageId",
      "chatId",
      "timestamp"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      entityId: {
        bsonType: "objectId",
      },
      messageId: {
        bsonType: "objectId",
      },
      chatId: {
        bsonType: "objectId",
      },
      timestamp: {
        bsonType: "date",
      },
    },
    additionalProperties: false,
  },
};

module.exports = notificationSchema;

