const { ObjectId } = require('mongodb');
const { getCollection } = require('../db');
const { krispyAxios } = require('../utils');
const {
	getChatByChatId,
	updateChatMetadata,
	getAllMessagesInChat,
} = require('./chatsHelper');
const { getContact } = require('./getContact');
const Connector = getCollection('connectors');

const checkGorgiasConnection = async (entityId) => {
	const foundGorgiasConnector = await Connector.findOne({
		$and: [{ entity: new ObjectId(entityId) }, { name: 'gorgias' }],
	});

	if (foundGorgiasConnector) return true;

	return false;
};

const getGorgiasCredentials = async (entityId) => {
	const foundGorgiasConnector = await Connector.findOne({
		$and: [{ entity: new ObjectId(entityId) }, { name: 'gorgias' }],
	});

	return {
		domain: foundGorgiasConnector.domain,
		email: foundGorgiasConnector.email,
		encodedString: getEncodedString(
			foundGorgiasConnector.email,
			foundGorgiasConnector.key
		),
	};
};

const isGorgiasCustomer = async (customerId, entityId) => {
	const { domain, encodedString } = await getGorgiasCredentials(entityId);

	const customerCheckOptions = {
		method: 'get',
		url: `https://${domain}/api/customers?external_id=${customerId}`,
		headers: {
			Authorization: `Basic ${encodedString}`,
			accept: 'application/json',
			'content-type': 'application/json',
		},
	};

	const foundCustomer = await krispyAxios(customerCheckOptions);
	if (foundCustomer.data) {
		return foundCustomer.data.data;
	}
	if (foundCustomer.error) {
		console.error(`Error in Gorgias list customer api call.`);
		return undefined;
	}
};

const getEncodedString = (email, key) => {
	return Buffer.from(email + ':' + key).toString('base64');
};

const getCustomerId = async (customer, chat) => {
	const entityId = chat.entity.toString();
	const foundGorgiasConnector = await Connector.findOne({
		$and: [{ entity: new ObjectId(entityId) }, { name: 'gorgias' }],
	});

	const customerId =
		customer === 'krispy'
			? foundGorgiasConnector?.metadata?.krispyAiId
			: foundGorgiasConnector?.metadata?.agentId;

	if (customerId) {
		return customerId;
	} else {
		// * create new customer
		// * get the customer id
		const newCustomer = await createGorgiasCustomer(entityId, customer);

		const metadataKey = customer === 'krispy' ? 'krispyAiId' : 'agentId';

		Connector.updateOne(
			{ _id: new ObjectId(foundGorgiasConnector._id) },
			{
				$set: {
					metadata: {
						...foundGorgiasConnector?.metadata,
						[metadataKey]: newCustomer.id,
					},
				},
			}
		);

		return newCustomer.id;
	}
};

const createGorgiasCustomer = async (entityId, type, contactId) => {
	const { domain, email, encodedString } = await getGorgiasCredentials(
		entityId
	);

	let contact;

	if (type === 'contact') {
		contact = await getContact(contactId);
	}

	const newCustomerOptions = {
		method: 'post',
		url: `https://${domain}/api/customers`,
		headers: {
			Authorization: `Basic ${encodedString}`,
			accept: 'application/json',
			'content-type': 'application/json',
		},
		body: {
			timezone: 'UTC',
			channels: [
				{
					preferred: false,
					type: type === 'contact' ? 'phone' : 'email',
					address:
						type === 'contact'
							? contact.phoneNumber
							: type === 'agent'
							? email
							: 'contact@krispy.ai',
				},
			],
			email: null,
			external_id: type === 'contact' ? contactId : null,
			name:
				type === 'contact'
					? contact.name
					: type === 'agent'
					? 'Agent'
					: 'Krispy AI',
		},
	};

	const newCustomer = await krispyAxios(newCustomerOptions);
	return newCustomer.data;
};

const sendMessageToGorigias = async ({
	messages,
	sentBy,
	entityId,
	chatId,
}) => {
	const { domain, email, encodedString } = await getGorgiasCredentials(
		entityId
	);

	const foundChat = await getChatByChatId(chatId);
	const krispyAiId = await getCustomerId('krispy', foundChat);
	const agentId = await getCustomerId('agent', foundChat);
	const krispyAi = {
		id: krispyAiId,
		name: 'Krispy AI',
		address: 'contact@krispy.ai',
	};
	const agent = {
		id: agentId,
		name: 'Agent',
		address: email,
	};

	const contactId = foundChat.contact.toString();

	let customerData = await isGorgiasCustomer(contactId, entityId);
	let customerId;

	if (customerData.length === 0) {
		const newCustomer = await createGorgiasCustomer(
			entityId,
			'contact',
			contactId
		);
		customerId = newCustomer.id;
		customerData = newCustomer;
	} else {
		customerData = customerData[0];
		customerId = customerData.id;
	}

	const contact = await getContact(contactId);
	const customer = {
		id: customerId,
		name: customerData.name,
		address: contact.phoneNumber,
	};

	if (!foundChat?.metadata?.gorgiasTicketId) {
		const newTicketOptions = {
			method: 'post',
			url: `https://${domain}/api/tickets`,
			headers: {
				Authorization: `Basic ${encodedString}`,
				accept: 'application/json',
				'content-type': 'application/json',
			},
			body: {
				customer: {
					id: customerId,
				},
				external_id: chatId,
				messages: [
					{
						sender: {
							id: customerId,
						},
						channel: 'api',
						from_agent: false,
						via: 'api',
						source: {
							type: 'api',
							// type: 'internal-note',
						},
						sent_datetime: new Date(),
						body_text: `New conversation between ${customerData.name} and Krispy AI`,
					},
				],
				tags: [
					{
						name: 'Krispy',
						decoration: {
							color: '#fd4f02',
						},
					},
				],
				channel: 'api',
				subject: `${customerData.name}'s conversation`,
				from_agent: false,
				status: 'open',
				via: 'api',
			},
		};

		const newTicket = await krispyAxios(newTicketOptions);
		const newTicketId = newTicket.data.id;

		await updateChatMetadata(chatId, newTicketId);

		const allMessages = await getAllMessagesInChat(chatId);

		for (let message of allMessages) {
			const newMessageOptions = {
				method: 'post',
				url: `https://${domain}/api/tickets/${newTicketId}/messages`,
				headers: {
					Authorization: `Basic ${encodedString}`,
					accept: 'application/json',
					'content-type': 'application/json',
				},
				body: {
					// receiver: {
					// 	id: message.sentBy === 'CONTACT' ? krispyAi.id : customer.id,
					// },
					sender: {
						id:
							message.sentBy === 'CONTACT'
								? customer.id
								: message.sentBy === 'AI'
								? krispyAi.id
								: agent.id,
					},
					source: {
						type: 'api',
						to: [
							{
								name:
									message.sentBy === 'CONTACT' ? krispyAi.name : customer.name,
								address:
									message.sentBy === 'CONTACT'
										? krispyAi.address
										: customer.address,
							},
						],
						from: {
							name:
								message.sentBy === 'CONTACT'
									? customer.name
									: message.sentBy === 'AI'
									? krispyAi.name
									: agent.name,
							address:
								message.sentBy === 'CONTACT'
									? customer.address
									: message.sentBy === 'AI'
									? krispyAi.address
									: agent.address,
						},
					},
					sent_datetime: message.msgTimestamp,
					body_text: message.content,
					channel: 'api',
					from_agent: false,
					via: 'api',
				},
			};

			await krispyAxios(newMessageOptions);
		}
	} else {
		const gorgiasTicketId = foundChat.metadata.gorgiasTicketId;

		for (let message of messages) {
			const newMessageOptions = {
				method: 'post',
				url: `https://${domain}/api/tickets/${gorgiasTicketId}/messages`,
				headers: {
					Authorization: `Basic ${encodedString}`,
					accept: 'application/json',
					'content-type': 'application/json',
				},
				body: {
					sender: {
						id:
							sentBy === 'CONTACT'
								? customer.id
								: sentBy === 'AI'
								? krispyAi.id
								: agent.id,
					},
					source: {
						type: 'api',
						to: [
							{
								name: sentBy === 'CONTACT' ? krispyAi.name : customer.name,
								address:
									sentBy === 'CONTACT' ? krispyAi.address : customer.address,
							},
						],
						from: {
							name:
								sentBy === 'CONTACT'
									? customer.name
									: sentBy === 'AI'
									? krispyAi.name
									: agent.name,
							address:
								sentBy === 'CONTACT'
									? customer.address
									: sentBy === 'AI'
									? krispyAi.address
									: agent.address,
						},
					},
					sent_datetime: new Date(),
					body_text: message,
					channel: 'api',
					from_agent: false,
					via: 'api',
				},
			};

			await krispyAxios(newMessageOptions);
		}
	}

	// if (newGorgiasTicket.data) {
	// 	console.log('ticket created');
	// }

	// if (newGorgiasTicket.error) {
	// 	console.log('Ticket not created');
	// }
};

module.exports = {
	checkGorgiasConnection,
	sendMessageToGorigias,
	createGorgiasCustomer,
};
