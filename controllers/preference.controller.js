const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

const Preference = getCollection('preferences');
const { uploadFile, getObjectSignedUrl, deleteFile } = require('../services/gcStorage');
const { getFileExtension, formatIds } = require('../utils');

// @desc    Gets preferences of business
// @route   GET /api/preferences/get
// @access  PRIVATE
const getPreferences = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const foundPreference = await Preference.findOne({ entity: new ObjectId(entityId) })
  if (!foundPreference)
    return res.status(404).json({ msg: 'No preference found for business' });
  if (foundPreference?.textFiles?.length > 0) {
    const file = foundPreference?.textFiles[0];
    const signedUrl = await getObjectSignedUrl(file?.objectName);
    foundPreference.textFiles[0].signedUrl = signedUrl;
  }
  return res.status(200).json({ preference: formatIds(foundPreference, 'preference') });
};

// @desc    Updates preferences of business
// @route   PATCH /api/preferences/update
// @access  PRIVATE
const updatePreferences = async (req, res) => {
  const {
    aiActive,
    brandVoice,
    onboardingStep,
    agentName,
    initialMessage,
    storeLink,
    optOutReplyMessage,
    utms
  } = req.body;
  const entityId = req.user.entity.entityId;
  await Preference.updateOne(
    { entity: new ObjectId(entityId) },
    {
      $set: {
        ...(aiActive != null && { aiActive }),
        ...(brandVoice && { brandVoice }),
        ...(onboardingStep && { onboardingStep }),
        ...(agentName && { agentName }),
        ...(initialMessage && { initialMessage }),
        ...(storeLink && { storeLink }),
        ...(optOutReplyMessage && { optOutReplyMessage }),
        ...(utms != null || utms != undefined && { utms })
      }
    }
  );
  const updatedPreference = await Preference.findOne({ entity: new ObjectId(entityId) });
  if (!updatedPreference)
    return res.status(404).json({ msg: 'No preference found for business' });
  return res.status(200).json({ preference: formatIds(updatedPreference, 'preference') });
};

// @desc    Uploads files to google storage
// @route   POST /api/preferences/upload-files
// @access  PRIVATE
const uploadFiles = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const fileToUpload = req.files?.textFile;
  const maxSizeBytes = 5 * 1024 * 1024; // 5 MB in bytes
  if (fileToUpload.size > maxSizeBytes)
    return res.status(422).json({ msg: 'Max file size exceeded - 5MB.' });

  if (fileToUpload.mimetype !== 'text/plain')
    return res.status(422).json({ msg: 'Only text files allowed.' });

  const entityPreference = await Preference.findOne({ entity: new ObjectId(entityId) });
  if (!entityPreference) return res.status(404).json({ msg: 'No preference found for entity.' });

  //this is temporary - deletes the previously added file from gc
  if (entityPreference?.textFiles?.length > 0) {
    const objectName = entityPreference?.textFiles[0]?.objectName;
    const fileDeleted = await deleteFile(objectName);
    if (!fileDeleted) return res.status(500).json({ msg: 'Error deleting prev file.' })
  }

  //uploads new file
  const uploadedFileName = await uploadFile(fileToUpload)
  if (!uploadedFileName)
    return res.status(500).json({ msg: 'Something went wrong while uploading the file!' });

  return res.status(200).json({ msg: 'File added!' });
};

// @desc    Adds a phone binding
// @route   PATCH /api/preferences/add-phone-binding
// @access  PRIVATE
const addPhoneBinding = async (req, res) => {
  const { type, phoneNumber } = req.body;
  const entityId = req.user.entity.entityId;
  await Preference.updateOne(
    { entity: new ObjectId(entityId) },
    {
      $push: {
        phoneBindings: {
          type,
          phone_number: phoneNumber
        }
      }
    }
  );
  return res.status(200).json({ msg: 'Phone binding added!' });
};

module.exports = {
  updatePreferences,
  getPreferences,
  uploadFiles,
  addPhoneBinding
};
