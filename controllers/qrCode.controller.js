const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { formatIds } = require('../utils');

const QrCode = getCollection('qrCodes');

// @desc    Gets all qr codes of the business
// @route   GET /api/qr-codes
// @access  PRIVATE
const getAllQrCodes = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const qrCodes = await QrCode.find({
    entity: new ObjectId(entityId)
  }).toArray();
  return res.status(200).json({ qrCodes: formatIds(qrCodes, 'qrCode') });
};

// @desc    Creates a qr code
// @route   POST /api/qr-codes
// @access  PRIVATE
const createQrCode = async (req, res) => {
  const entityId = req.user.entity.entityId;
  const { title, message } = req.body;
  await QrCode.insertOne({
    entity: new ObjectId(entityId),
    title,
    message,
    type: 'WHATSAPP',
    createdAt: new Date()
  });
  return res.status(201).json({ msg: "QR Code created." });
};

// @desc    Updates a qr code
// @route   PATCH /api/qr-codes/:qrCodeId
// @access  PRIVATE
const updateQrCode = async (req, res) => {
  const { qrCodeId } = req.params;
  const { title, message } = req.body;
  await QrCode.findOneAndUpdate(
    { _id: new ObjectId(qrCodeId) },
    {
      $set: {
        ...(title && { title: title }),
        ...(message && { message: message }),
      }
    }
  );
  return res.status(200).json({ msg: "QR Code updated." });
};

// @desc    Deletes a qr code
// @route   DELETE /api/qr-codes/:qrCodeId
// @access  PRIVATE
const deleteQrCode = async (req, res) => {
  const { qrCodeId } = req.params;
  await QrCode.findOneAndDelete(
    { _id: new ObjectId(qrCodeId) },
  );
  return res.status(200).json({ msg: "QR Code deleted." });
};

module.exports = {
  getAllQrCodes,
  createQrCode,
  updateQrCode,
  deleteQrCode
};
