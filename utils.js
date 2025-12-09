const { default: axios } = require('axios');
const { ObjectId } = require('mongodb');
const { DateTime } = require('luxon');

const generateRandomString = (length) => {
	const charset =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!';
	let result = '';
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		result += charset.charAt(randomIndex);
	}
	return result;
};

const getFileExtension = (fileName) => {
	const parts = fileName?.split('.');
	if (parts?.length === 1 || (parts[0] === '' && parts?.length === 2)) {
		return '';
	}
	return parts?.pop()?.toLowerCase();
};

const isObject = function (obj) {
	const type = typeof obj;
	return type === 'function' || (type === 'object' && !!obj);
};

const formatIds = (inputObject, keyName) => {
	if (Array.isArray(inputObject)) {
		for (let obj of inputObject) {
			formatIds(obj, keyName);
		}
	} else {
		inputObject[`${keyName}Id`] = inputObject?._id;
		delete inputObject?._id;
		for (const [key, value] of Object.entries(inputObject)) {
			if (isObject(value)) formatIds(value, key);
		}
	}
	return inputObject;
};

const krispyAxios = async ({ method, url, headers, body }) => {
	try {
		const response = await axios({
			method: method,
			url: url,
			headers: headers,
			data: body,
		});
		return { data: response.data, status: response.status };
	} catch (error) {
		console.error(
			'NETWORK REQUEST ERROR:',
			JSON.stringify({
				method: error?.config?.method,
				url: error?.config?.url,
				headers: headers,
				body: error?.config?.data,
				response: {
					data: error?.response?.data,
					status: error?.response?.status,
				},
			})
		);
		return { error: error?.response?.data || true };
	}
};

const normalizePhoneNumber = (phoneNumber) => {
	return phoneNumber?.replace(/\D/g, '');
};

const breakStringOnPeriods = (str) => {
	if (str === '' || !str) return [];
	const sentences = str.replace(/([.?!])\s*(?=[A-Z])/g, '$1|').split('|');
	const trimmedSentences = sentences.map((sentence) => sentence.trim());
	return trimmedSentences;
};

const formatStringWithNewlines = (inputString) => {
	return inputString
		.replace(/^\n+|\n+$/g, '') // Remove leading/trailing newlines
		.replace(/\n\s+/g, '\n') // Replace newlines followed by any whitespace
		.trim(); // Trim any remaining leading/trailing whitespace
};

const extractVariables = (inputString, inputVars) => {
	const regex = /{{(.*?)}}/g;
	let match;
	let extractedVariables = [];
	let extractedExamples = [];
	let modifiedString = inputString;

	while ((match = regex.exec(inputString)) !== null) {
		extractedVariables.push(match[1].trim());
		modifiedString = modifiedString.replace(
			match[0],
			`{{${extractedVariables.length}}}`
		);
	}

	for (let variableName of extractedVariables) {
		let foundVar = inputVars?.find(
			(variable) => variable?.name === variableName
		);
		if (foundVar) extractedExamples.push(foundVar?.example);
	}

	return {
		text: modifiedString,
		variables: extractedVariables,
		examples: extractedExamples,
	};
};

//this functions maps through all the objects of the
//provided array and check is a string is an objectId,
//if so, it converts the string to ObjectId
const convertToObjectIds = (inputArray) => {
	if (Array.isArray(inputArray)) {
		for (let obj of inputArray) {
			for (let [key, value] of Object.entries(obj)) {
				try {
					obj[key] = new ObjectId(value);
				} catch (e) {}
			}
		}
	}
	return inputArray;
};

const getMessagingLimit = (tier) => {
	switch (tier) {
		case null:
			return 0;
		case 'TIER_0.25K':
			return 250;
		case 'TIER_1K':
			return 1000;
		case 'TIER_10K':
			return 10000;
		case 'TIER_100K':
			return 100000;
		default:
			return 100000;
	}
};

const addSearchParamsToUrl = (url, paramsArray) => {
	if (!paramsArray) return url;

	const searchParams = new URLSearchParams();
	paramsArray.forEach((param) => {
		searchParams.append(param.key, param.value);
	});
	const parsedUrl = new URL(url);
	if (parsedUrl.search) {
		const existingParams = new URLSearchParams(parsedUrl.search);
		for (const [key, value] of existingParams) {
			searchParams.append(key, value);
		}
	}
	parsedUrl.search = searchParams.toString();
	return parsedUrl.toString();
};

const convertToUTC = ({ date, time, timezone }) => {
	const dateTimeString = `${date} ${time}`;
	const localDateTime = DateTime.fromFormat(
		dateTimeString,
		'dd/MM/yyyy HH:mm',
		{ zone: timezone }
	);
	const utcDateTime = localDateTime.toUTC();
	return utcDateTime.toJSDate();
};

const getRandomLoaderEmoji = () => {
	const loaderEmojis = ['🤔', '👀', '✨', '🚦', '⏳', '💬', '💭'];
	const emojiCount = loaderEmojis.length;
	const randomIndex = Math.floor(Math.random() * emojiCount);
	return loaderEmojis[randomIndex];
};

const getRandomCheckEmoji = () => {
	const checkEmojis = ['✅', '☑️', '✔️'];
	const emojiCount = checkEmojis.length;
	const randomIndex = Math.floor(Math.random() * emojiCount);
	return checkEmojis[randomIndex];
};

const getOptInButtons = () => {
	const buttonsToSave = [
		{
			id: `cta-accept_marketing-${generateRandomString(10)}`,
			type: 'QUICK_REPLY',
			text: 'Accept',
		},
		{
			id: `cta-reject_marketing-${generateRandomString(10)}`,
			type: 'QUICK_REPLY',
			text: 'Reject',
		},
	];
	const buttonsToPost = [
		{
			type: 'QUICK_REPLY',
			text: 'Accept',
		},
		{
			type: 'QUICK_REPLY',
			text: 'Reject',
		},
	];

	return {
		buttonsToSave: { type: 'BUTTONS', buttons: buttonsToSave },
		buttonsToPost: { type: 'BUTTONS', buttons: buttonsToPost },
	};
};

module.exports = {
	generateRandomString,
	getFileExtension,
	formatIds,
	krispyAxios,
	normalizePhoneNumber,
	breakStringOnPeriods,
	extractVariables,
	convertToObjectIds,
	getMessagingLimit,
	addSearchParamsToUrl,
	convertToUTC,
	formatStringWithNewlines,
	getRandomLoaderEmoji,
	getOptInButtons,
	getRandomCheckEmoji,
};
