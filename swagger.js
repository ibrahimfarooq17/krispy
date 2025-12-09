/**
 * @swagger
 * tags:
 *   name: Agents
 *   description: All agents of a business
 * components:
 *   schemas:
 *     Agent:
 *       type: object
 *       required:
 *         - entity
 *         - name
 *         - isActive
 *         - fields
 *       properties:
 *         _id:
 *           type: string
 *           format: objectId
 *         entity:
 *           type: string
 *           format: objectId
 *           description: Reference to the business to whom this agent belongs to.
 *         name:
 *           type: string
 *           description: Name of the agent.
 *         isActive:
 *           type: boolean
 *           description: Whether the agent is active or inactive.
 *         fields:
 *           type: object
 *           description: Name of the agent.
 *           additionalProperties: true
 *       additionalProperties: false
 */
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerSpecs = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Krispy Backend API",
      description: "This is the main backend server for Krispy."
    },
    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local environment",
      },
    ],
  },
  apis: ["./routes/*.js"]
});
module.exports = swaggerSpecs;