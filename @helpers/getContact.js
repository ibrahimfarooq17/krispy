const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');

const Contact = getCollection('contacts');

const getContact = async (contactId) => {
	return await Contact.findOne({ _id: new ObjectId(contactId) });
};

module.exports = {
	getContact,
};
