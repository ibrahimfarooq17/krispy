const qrCodeSchema = {
  $jsonSchema: {
    bsonType: "object",
    required: [
      "entity",
      "title",
      "message",
      "type",
      "createdAt"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      entity: {
        bsonType: "objectId",
        description: "Reference to the business to whom this QR Code belongs to.",
      },
      title: {
        bsonType: "string",
        description: "The title of the qr code."
      },
      message: {
        bsonType: "string",
        description: "The message encoded in the qr."
      },
      type: {
        enum: ["WHATSAPP"],
        bsonType: "string",
        description: "The type of QR code.",
      },
      createdAt: {
        bsonType: "date",
        description: "Date of creation of the qr.",
      },
    },
    additionalProperties: false,
  },
};

module.exports = qrCodeSchema;

