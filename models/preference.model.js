const preferenceSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "entity",
      "aiActive",
      "brandVoice",
      "shopifyConnectorKey",
      "onboardingStep",
      "optOutReplyMessage"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      entity: {
        bsonType: "objectId",
      },
      aiActive: {
        bsonType: "bool",
        description: "Whether the business wants to activate the AI on their chats or not.",
      },
      brandVoice: {
        bsonType: "object",
        properties: {
          friendly: {
            bsonType: "number",
          },
          emojis: {
            bsonType: "number",
          },
          serious: {
            bsonType: "number",
          },
          caring: {
            bsonType: "number",
          }
        }
      },
      phoneBindings: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: [
            "type",
            "phone_number"
          ],
          properties: {
            type: {
              enum: [
                "whatsapp"
              ],
              bsonType: "string"
            },
            phone_number: {
              bsonType: "string"
            }
          }
        }
      },
      d360ApiKey: {
        bsonType: "string",
        description: "The generated API key for 360 dialogue."
      },
      d360MessagingLimit: {
        bsonType: "number",
        description: "The messaging limit of outbound chats set by Meta."
      },
      shopifyConnectorKey: {
        bsonType: "string"
      },
      onboardingStep: {
        bsonType: "number",
      },
      agentName: {
        bsonType: "string"
      },
      initialMessage: {
        bsonType: "string"
      },
      optOutReplyMessage: {
        bsonType: "string",
        description: "The message to reply with when a customer opts out of marketing."
      },
      utms: {
        bsonType: "array",
        items: {
          bsonType: "object",
          required: [
            "key",
            "value"
          ],
          properties: {
            key: {
              bsonType: "string",
            },
            value: {
              bsonType: "string",
            },
          }
        }
      },
    },
    additionalProperties: false
  }
};

module.exports = preferenceSchema;