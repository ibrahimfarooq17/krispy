const express = require("express");
const router = express.Router();
const { authToken } = require("../middleware/authToken");
const { errorHandler } = require("../middleware/errorHandler");
const {
  connectMetaChat,
  sendWhatsappMessage,
  receiveWhatsappMessage,
  createDemoChat,
  sendDemoMessage,
  getAllChats,
  updateChat,
} = require("../controllers/chat.controller");
const {
  validate,
} = require("../middleware/validators/chat.controller.validator");

//POST routes
router.post(
  "/connect-meta-chat",
  authToken,
  validate("connectMetaChat"),
  errorHandler(connectMetaChat)
);
router.post(
  "/whatsapp/send-message/:chatId",
  authToken,
  validate("sendWhatsappMessage"),
  errorHandler(sendWhatsappMessage)
);
router.post("/whatsapp/receive-message", errorHandler(receiveWhatsappMessage));
router.post("/demo/create", authToken, errorHandler(createDemoChat));
router.post(
  "/demo/send-message/:chatId",
  authToken,
  validate("sendDemoMessage"),
  errorHandler(sendDemoMessage)
);
router.post(
  "/workspace/send-message/:workerId/:chatId",
  authToken,
  validate("sendDemoMessage"),
  errorHandler(sendDemoMessage)
);

//GET routes
router.get("/:page", authToken, errorHandler(getAllChats));

//PATCH routes
router.patch("/:chatId", authToken, errorHandler(updateChat));

module.exports = router;
