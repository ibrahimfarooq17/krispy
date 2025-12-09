const userSchema = {
  $jsonSchema: {
    bsonType: "object",
    title: "User document validation",
    required: [
      "firstName",
      "lastName",
      "email",
      "password",
      "permission",
      "isVerified",
      "entity"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
      },
      firstName: {
        bsonType: "string"
      },
      lastName: {
        bsonType: "string"
      },
      email: {
        bsonType: "string"
      },
      password: {
        bsonType: "string"
      },
      permission: {
        enum: [
          "OWNER",
          "STANDARD",
          "MANAGER"
        ],
        bsonType: "string",
      },
      isVerified: {
        bsonType: "bool",
      },
      entity: {
        bsonType: "objectId",
      }
    },
    additionalProperties: false
  }
};

module.exports = userSchema;

