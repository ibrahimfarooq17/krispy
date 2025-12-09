const formSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "entity",
      "name",
      "fields"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      entity: {
        bsonType: "objectId",
        description: "Reference to the business to whom this agent belongs to.",
      },
      name: {
        bsonType: "string",
        description: "Name of the agent."
      },
      description: {
        bsonType: "string",
        description: "Description of the agent."
      },
      fields: {
        bsonType: "object",
        description: "Name of the agent.",
        additionalProperties: true,
      },
    },
    additionalProperties: false,
  },
};

module.exports = formSchema;

