const chalk = require("chalk");
const { getCollection } = require("../db");
const {
  krispyAxios,
  formatIds,
  normalizePhoneNumber,
  getMessagingLimit,
  getRandomLoaderEmoji,
  getRandomCheckEmoji,
} = require("../utils");
const { ObjectId } = require("mongodb");
const { generateAiResponse, generateWorkerResponse, transcribeWhatsappAudio } = require("../services/aiService");
const runTriggers = require("../@helpers/runTriggers");
const {
  getContact,
  createContact,
  getActiveChat,
  createChat,
  sendWhatsappTextMessage,
} = require("../services/chatService");
const manageContactConsent = require("../@helpers/manageContactConsent");
const { default: axios } = require("axios");
const runAiActions = require("../@helpers/runAiActions");
const runChatFlows = require("../@helpers/runChatFlows");
const trackCtaClick = require("../@helpers/trackCtaClick");

const Preference = getCollection("preferences");
const Chat = getCollection("chats");
const Message = getCollection("messages");
const Contact = getCollection("contacts");
const WorkerPlans = getCollection("workerPlans");
const KnowledgeBase = getCollection("knowledgeBases");
const { checkGorgiasConnection, sendMessageToGorigias } = require("../@helpers/gorgiasHelpers");

// @desc    Generate a 360dialogue API key, posts webhook, posts messaging templates
// @route   POST /api/chats/connect-meta-chat
// @access  PRIVATE
const connectMetaChat = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const { channelId, partnerId } = req.body;
  const webhookBaseUrl = process.env.WEBHOOK_BASE_URL;

  //check if business is already connected
  // const foundPref = await Preference.findOne({
  //   entity: new ObjectId(entityId)
  // });
  // if (foundPref?.d360ApiKey)
  //   return res.status(409).json({ msg: 'Business already connected to meta.' });

  //get D360 access token
  const accessTokenResponse = await krispyAxios({
    method: "POST",
    url: "https://hub.360dialog.io/api/v2/token",
    body: {
      username: process.env.D_360_USER,
      password: process.env.D_360_PASS,
    },
  });
  if (accessTokenResponse.error)
    return res.status(500).json({
      msg: "Could not generate bearer token.",
      details: accessTokenResponse.error,
    });

  //generate D360 API key from access token
  const accessToken = accessTokenResponse.data.access_token;
  const apiKeyResponse = await krispyAxios({
    method: "POST",
    url: `https://hub.360dialog.io/api/v2/partners/${partnerId}/channels/${channelId}/api_keys`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (apiKeyResponse.error)
    return res.status(500).json({
      msg: "Invalid channel ID or partner ID.",
      details: apiKeyResponse.error,
    });

  //get channel info to retrieve the channel tier
  const channelInfoResponse = await krispyAxios({
    method: "GET",
    url: `https://hub.360dialog.io/api/v2/partners/${partnerId}/channels?filters={"id": "${channelId}"}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (channelInfoResponse.error || channelInfoResponse.data?.partner_channels?.length == 0)
    return res.status(500).json({
      msg: "Could not retrieve channel info.",
      details: channelInfoResponse.error,
    });
  const foundChannel = channelInfoResponse.data?.partner_channels?.pop();
  const channelMessagingLimit = getMessagingLimit(foundChannel?.current_limit);

  //get the phone number that is hooked with API Key
  const phoneNumber = await krispyAxios({
    method: "GET",
    url: "https://waba.360dialog.io/v1/configs/phone_number",
    headers: {
      "D360-API-KEY": apiKeyResponse.data.api_key,
    },
  });
  if (phoneNumber.error)
    return res.status(500).json({
      msg: "Could not get phone number.",
      details: phoneNumber.error,
    });

  //create webhook for this API key
  const webhookCreationRes = await krispyAxios({
    method: "POST",
    url: "https://waba-v2.360dialog.io/v1/configs/webhook",
    headers: {
      "D360-API-KEY": apiKeyResponse.data.api_key,
    },
    body: {
      url: `${webhookBaseUrl}/api/chats/whatsapp/receive-message?entity=${entityId}`,
    },
  });
  console.log(webhookCreationRes.data);
  if (webhookCreationRes.error)
    return res.status(500).json({
      msg: "Could not generate webhook url",
      details: webhookCreationRes.error,
    });
  //store API key and phone number in business preferences
  await Preference.findOneAndUpdate(
    { entity: new ObjectId(entityId) },
    {
      $set: {
        d360ApiKey: apiKeyResponse.data.api_key,
        d360MessagingLimit: channelMessagingLimit,
      },
      $push: {
        phoneBindings: {
          type: "whatsapp",
          phone_number: phoneNumber.data?.phone_number,
        },
      },
    }
  );
  return res.status(200).json({ msg: "Meta chat connected!" });
};

// @desc    Update a chat details
// @route   PATCH /api/chats/:chatId
// @access  PRIVATE
const updateChat = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const { aiConversing } = req.body;
  const { chatId } = req.params;

  const foundChat = await Chat.findOne({ _id: new ObjectId(chatId) });
  if (!foundChat) return res.status(404).json({ msg: "No chat found with provided id." });

  await Chat.findOneAndUpdate({ _id: new ObjectId(chatId) }, { $set: { aiConversing } });

  return res.status(200).json({ msg: "Chat updated." });
};

// @desc    Sends a whatsapp message manually
// @route   POST /api/chats/whatsapp/send-message/:chatId
// @access  PRIVATE
const sendWhatsappMessage = async (req, res) => {
  const { text } = req.body;
  const { chatId } = req.params;
  const entityId = req.user.entity.entityId;

  //send message to contact's whatsapp
  const { error } = await sendWhatsappTextMessage({
    chatId,
    messages: [text],
    sentBy: "INTERNAL_USER",
    entityId: entityId,
  });
  if (error)
    return res.status(500).json({
      msg: "Error sending whatsapp message.",
      details: error,
    });
  return res.status(200).json({ msg: "Message sent!" });
};

// @desc    WEBHOOK - Receive whatsapp message
// @route   POST /api/chats/whatsapp/receive-message
// @access  PRIVATE
const receiveWhatsappMessage = async (req, res) => {
  //sending success response back to close webhook
  res.status(200).json({ msg: "Webhook received." });

  console.log(chalk.blue(JSON.stringify(req.body)), "\n\n");

  const { entity } = req.query;
  const { entry } = req.body;
  let contact, chat, msgReceived;

  //check if message read status webhook
  const messageStatus = entry?.[0]?.changes?.[0]?.value?.statuses?.[0];
  if (messageStatus?.id && messageStatus?.status === "read") {
    await Message.findOneAndUpdate({ externalId: messageStatus?.id }, { $set: { read: true } });
    console.log(chalk.bgGreen("Message read status updated!"));
    return;
  }

  //continue flow for message received
  const phoneNumber = normalizePhoneNumber(entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id);
  const profileName = entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name;
  const textMessage =
    entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || //normal texts
    entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.button?.text || //buttons from templates
    "Attachment...";
  const buttonPayload = entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.button?.payload;
  const externalReceivedMsgId = entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.id;
  const msgAudioId = entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.audio?.id;
  if (!entry?.[0]?.changes?.[0]?.value?.messages) return;

  console.log(chalk.green("WHATSAPP INBOUND WEBHOOK TRIGGERED\n"), chalk.blue(JSON.stringify(req.body)));

  console.log(chalk.bgGray("CTA payload body: ", buttonPayload));

  const msgExists = await Message.findOne({
    externalId: externalReceivedMsgId,
  });
  if (msgExists) {
    console.log(chalk.red("Message already exists."));
    return;
  }

  const foundKnowledgeBase = await KnowledgeBase.findOne({
    entity: new ObjectId(entity),
  });

  const foundPreference = await Preference.findOne({
    entity: new ObjectId(entity),
  });
  if (!foundPreference?.d360ApiKey) {
    console.log(chalk.red("No 360 Dialog API Key found!"));
    return;
  }

  // ***************** ADD LOADER EMOJI REACTION *****************
  await krispyAxios({
    method: "POST",
    url: "https://waba-v2.360dialog.io/messages",
    headers: {
      "D360-API-KEY": foundPreference?.d360ApiKey,
    },
    body: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phoneNumber,
      type: "reaction",
      reaction: {
        message_id: externalReceivedMsgId,
        emoji: getRandomLoaderEmoji(),
      },
    },
  });

  // ***************** TRANSCRIBE AUDIO *****************
  if (msgAudioId) {
    console.log("ATTEMPTING TO TRANSCRIBE AUDIO...");
    const transcriptionRes = await transcribeWhatsappAudio({
      d360ApiKey: foundPreference?.d360ApiKey,
      audioId: msgAudioId,
    });
    if (transcriptionRes.error) msgReceived = "User sent an audio that could not be transcribed.";
    else msgReceived = transcriptionRes.data?.transcribe?.text;
  } else msgReceived = textMessage;

  // ***************** CONTACT INITIATION *****************
  const getContactRes = await getContact({
    entityId: entity,
    phoneNumber: phoneNumber,
  });
  if (getContactRes.error) {
    const createContactRes = await createContact({
      entityId: entity,
      name: profileName,
      phoneNumber,
      consent: true,
    });
    contact = createContactRes.data?.contact;
  } else contact = getContactRes.data?.contact;

  // ***************** CHAT INITIATION *****************
  const getChatRes = await getActiveChat({
    contactId: contact?.contactId,
  });
  if (getChatRes.error) {
    const createChatRes = await createChat({
      contactId: contact?.contactId,
      channel: "WHATSAPP",
    });
    chat = createChatRes.data?.chat;
  } else chat = getChatRes.data?.chat;

  // ***************** SAVE MSG AND UPDATE CONSENT ON CONTACT *****************
  await Message.insertOne({
    externalId: externalReceivedMsgId,
    content: msgAudioId ? `TRANSCRIBED: ${msgReceived}` : msgReceived,
    sentBy: "CONTACT",
    chat: new ObjectId(chat?.chatId),
    msgTimestamp: new Date(),
  });

  // ***************** MANAGE CONTACT CONSENT *****************
  const contactConsented = await manageContactConsent({
    chatId: chat?.chatId,
    contactId: contact?.contactId,
    receivedMessage: msgReceived,
    buttonPayload: buttonPayload,
    rejectedReply: foundPreference?.optOutReplyMessage,
  });
  if (!contactConsented) {
    console.log(chalk.bgGreen("Message flow complete - Contact opted out."));
    return;
  }
  // ***************** MANAGE CONTACT CONSENT *****************

  // ***************** TRACK CTA CLICK *****************
  await trackCtaClick({
    contactId: contact?.contactId,
    buttonPayload,
  });
  // ***************** TRACK CTA CLICK *****************

  // // ***************** RUN CHAT FLOWS *****************
  const chatFlowsExecuted = await runChatFlows({
    entityId: entity,
    contactId: contact?.contactId,
    buttonPayload,
  });
  if (chatFlowsExecuted) {
    console.log(chalk.bgGreen("CHAT FLOWS - Message flow complete!"));
    return;
  }

  // ***************** RUN CHAT FLOWS *****************

  // ***************** RUN TRIGGERS *****************
  const triggersExecuted = await runTriggers({
    entityId: entity,
    chatId: chat?.chatId,
    contactId: contact?.contactId,
    receivedMessage: msgReceived,
  });
  if (triggersExecuted) {
    console.log(chalk.bgGreen("TRIGGERS - Message flow complete!"));
    return;
  }
  // ***************** RUN TRIGGERS *****************

  // ***************** SEND USER MESSAGE TO GORGIAS *****************
  // ! ********** GORGIAS SEND MESSAGE **********
  const isGorgiasConnected = await checkGorgiasConnection(entity);
  if (isGorgiasConnected) {
    sendMessageToGorigias({
      messages: [msgReceived],
      sentBy: "CONTACT",
      entityId: entity,
      chatId: chat?.chatId,
    });
  }
  // ! ********** GORGIAS SEND MESSAGE **********
  // ***************** SEND USER MESSAGE TO GORGIAS *****************

  // ***************** RESPOND WITH AI *****************
  //check if chat allows AI to converse, if not, finish flow
  if (!chat?.aiConversing) {
    console.log(chalk.bgGreen("Message flow complete - AI NOT ALLOWED TO RESPOND."));
    // ***************** ADD CHECK EMOJI REACTION *****************
    await krispyAxios({
      method: "POST",
      url: "https://waba-v2.360dialog.io/messages",
      headers: {
        "D360-API-KEY": foundPreference?.d360ApiKey,
      },
      body: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: phoneNumber,
        type: "reaction",
        reaction: {
          message_id: externalReceivedMsgId,
          emoji: getRandomCheckEmoji(),
        },
      },
    });
    // ***************** ADD CHECK EMOJI REACTION *****************
    return;
  }
  const aiResponse = await generateAiResponse({
    chatId: chat?.chatId,
    inputMessage: msgReceived,
    model: foundKnowledgeBase?.aiModel,
    businessUtms: foundPreference?.utms,
  });
  console.log("AI response:", JSON.stringify(aiResponse));
  if (aiResponse.error) {
    console.log(chalk.red("Error generating AI response."));
    return;
  }

  // ***************** ADD CHECK EMOJI REACTION *****************
  await krispyAxios({
    method: "POST",
    url: "https://waba-v2.360dialog.io/messages",
    headers: {
      "D360-API-KEY": foundPreference?.d360ApiKey,
    },
    body: {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phoneNumber,
      type: "reaction",
      reaction: {
        message_id: externalReceivedMsgId,
        emoji: getRandomCheckEmoji(),
      },
    },
  });
  // ***************** ADD CHECK EMOJI REACTION *****************

  // ***************** RESPOND WITH AI *****************

  const whatsappMessageResponse = await sendWhatsappTextMessage({
    chatId: chat?.chatId,
    messages: aiResponse?.data?.responses,
    sentBy: "AI",
    exitState: aiResponse?.data?.exitState,
    conversationRoute: aiResponse?.data?.conversationRoute,
    lastFormSession: aiResponse?.data?.lastFormSession,
    action: aiResponse?.data?.action,
  });
  if (whatsappMessageResponse.error) {
    console.log("Error sending whatsapp message(s).");
    return;
  }

  // ***************** SEND AI MESSAGE TO GORGIAS *****************
  // ! ********** GORGIAS SEND MESSAGE **********
  if (isGorgiasConnected) {
    sendMessageToGorigias({
      messages: aiResponse?.data?.responses,
      sentBy: "AI",
      entityId: entity,
      chatId: chat?.chatId,
    });
  }
  // ! ********** GORGIAS SEND MESSAGE **********
  // ***************** SEND AI MESSAGE TO GORGIAS *****************

  // ***************** RUN AI ACTION *****************
  if (aiResponse?.data?.action) {
    await runAiActions({
      entityId: entity,
      aiActionSession: aiResponse?.data.action?.action_metadata,
      formData: aiResponse?.data.action?.form_data,
    });
  }

  console.log("COMPLETE", new Date().getTime());

  console.log(chalk.bgGreen("Message flow complete!"));
  return;
};

// @desc    Creates demo chat
// @route   POST /api/chats/demo/create
// @access  PRIVATE
const createDemoChat = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const { insertedId } = await Chat.insertOne({
    entity: new ObjectId(entityId),
    channel: "DEMO",
    aiConversing: true,
    isActive: true,
    lastMsgTimestamp: new Date(),
    createdAt: new Date(),
  });
  return res.status(200).json({ chat: insertedId });
};

// @desc    Returns an AI response to the query
// @route   POST /api/chats/demo/send-message/:chatId
// @access  PRIVATE
const sendDemoMessage = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const { text } = req.body;
  const { workerId, chatId } = req.params;

  const foundChat = await Chat.findOne({ _id: new ObjectId(chatId) });
  if (!foundChat) return res.status(404).json({ msg: "No chat found with provided id." });

  const foundKnowledgeBase = await KnowledgeBase.findOne({
    entity: new ObjectId(entityId),
  });
  const foundPreference = await Preference.findOne({
    entity: new ObjectId(entityId),
  });

  //save message in DB
  await Message.insertOne({
    content: text,
    sentBy: "CONTACT",
    chat: new ObjectId(chatId),
    msgTimestamp: new Date(),
  });

  //generate AI response here
  const aiResponse = workerId
    ? await generateWorkerResponse({
        chatId,
        inputMessage: text,
        workerId,
        businessUtms: foundPreference?.utms,
      })
    : await generateAiResponse({
        chatId,
        inputMessage: text,
        model: foundKnowledgeBase?.aiModel,
        businessUtms: foundPreference?.utms,
      });

  if (aiResponse.error) return res.status(500).json({ msg: "Error generating AI response." });

  //send generated AI responses as a replies to message
  const bulkMessagesOps = Message.initializeOrderedBulkOp();
  for (let response of aiResponse?.data?.responses) {
    bulkMessagesOps.insert({
      content: response,
      sentBy: "AI",
      chat: new ObjectId(chatId),
      msgTimestamp: new Date(),
      exitState: aiResponse?.data?.exitState,
      conversationRoute: aiResponse?.data?.conversationRoute ?? "",
      read: false,
      ...(aiResponse?.data?.lastFormSession
        ? { lastFormSession: new ObjectId(aiResponse?.data?.lastFormSession) }
        : {}),
    });
  }
  //bulk save messages
  await bulkMessagesOps.execute();

  const foundPlan = await WorkerPlans.findOne({
    _id: new ObjectId(aiResponse?.data?.planId),
  });

  //update last message timestamp on chat
  await Chat.findOneAndUpdate({ _id: new ObjectId(chatId) }, { $set: { lastMsgTimestamp: new Date() } });
  return res.status(200).json({
    messages: aiResponse?.data?.responses,
    links: aiResponse.data.links,
    plan: foundPlan?.plan,
  });
};

// @desc    Returns paginated chats of business - pagination starts from 0
// @route   GET /api/chats/:page?type={string}
// @access  PRIVATE
const getAllChats = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const page = parseInt(req.params.page);
  const { type } = req.query;

  const PAGE_SIZE = 20;
  const skip = page * PAGE_SIZE;
  //get chats count
  const chatsCount = await Chat.aggregate([
    {
      $match: {
        entity: new ObjectId(entityId),
        ...(type && type !== "" && { channel: type?.toUpperCase() }),
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "_id",
        foreignField: "chat",
        as: "messages",
      },
    },
    {
      $match: {
        "messages.0": { $exists: true },
      },
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        totalChats: "$count",
      },
    },
  ]).toArray();
  const totalChats = chatsCount.pop()?.totalChats;

  const totalPages = Math.ceil(totalChats / PAGE_SIZE);
  const nextPage = page + 1 >= totalPages ? null : page + 1;
  const prevPage = page - 1 < 0 ? null : page - 1;

  const chats = await Chat.aggregate([
    {
      $match: {
        entity: new ObjectId(entityId),
        ...(type && type !== "" && { channel: type?.toUpperCase() }),
      },
    },
    {
      $lookup: {
        from: "messages",
        localField: "_id",
        foreignField: "chat",
        as: "messages",
      },
    },
    {
      $match: {
        "messages.0": { $exists: true },
      },
    },
    { $sort: { lastMsgTimestamp: -1 } },
    { $skip: skip },
    { $limit: PAGE_SIZE },
    {
      $lookup: {
        from: "messages",
        let: { chatId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$chat", "$$chatId"],
              },
            },
          },
          {
            $sort: { msgTimestamp: -1 },
          },
          {
            $limit: 1,
          },
          {
            $project: {
              _id: 0,
              content: 1,
            },
          },
        ],
        as: "latestMsg",
      },
    },
    {
      $lookup: {
        from: "contacts",
        localField: "contact",
        foreignField: "_id",
        as: "contact",
      },
    },
    {
      $addFields: {
        latestMsg: { $arrayElemAt: ["$latestMsg", 0] },
        contact: { $arrayElemAt: ["$contact", 0] },
      },
    },
  ]).toArray();

  return res.status(200).json({
    chats: formatIds(chats, "chat"),
    pagination: {
      totalRecords: totalChats,
      totalPages,
      currentPage: page,
      nextPage,
      prevPage,
    },
  });
};

module.exports = {
  connectMetaChat,
  updateChat,
  sendWhatsappMessage,
  receiveWhatsappMessage,
  createDemoChat,
  sendDemoMessage,
  getAllChats,
};
