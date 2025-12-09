const queuedMessageSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "entity",
      "contact",
      "priority",
      "status",
      "metadata",
      "createdAt"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      entity: {
        bsonType: "objectId",
        description: "Reference to the business to whom this queued message belongs to.",
      },
      contact: {
        bsonType: "objectId",
        description: "The contact to whom the message will be sent.",
      },
      priority: {
        bsonType: "number",
        enum: [1, 2],
        description: "The priority of the queued message. The lower the number, the higher the priority",
      },
      status: {
        bsonType: "string",
        enum: ["OPEN", "PROCESSING"],
        description: "An open message is ready to be sent out, a processing message is already picked up to be sent out.",
      },
      metadata: {
        bsonType: "object",
        description: "Additional info of this queues message.",
        additionalProperties: true,
      },
      scheduledFor: {
        bsonType: "date",
        description: "The date on which this queued message is scheduled to be sent out.",
      },
      createdAt: {
        bsonType: "date",
        description: "Date of queued message",
      },
    },
    additionalProperties: false,
  },
};

module.exports = queuedMessageSchema;

