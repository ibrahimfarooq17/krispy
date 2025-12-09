const {
	krispyAxios,
	breakStringOnPeriods,
	addSearchParamsToUrl,
	formatStringWithNewlines,
} = require('../utils');

const aiServiceBaseUrl = process.env.AI_API_URL;

const generateAiResponse = async ({
	chatId,
	inputMessage,
	model,
	businessUtms,
}) => {
	const aiResponse = await krispyAxios({
		method: 'POST',
		url: `${aiServiceBaseUrl}/v1/chat/${chatId}/ai_response?limit=20${
			model ? `&model=${model}` : ''
		}`,
		body: {
			incoming_message: inputMessage || 'Attachment',
			pinecone_index: 'krispy',
		},
	});
	if (aiResponse.error) return { error: aiResponse.error };
	let aiTextResponse = aiResponse?.data?.outcoming_message?.trim();

	//check if question already with text, if not, then add follow up question
	const lastCharacter = aiTextResponse.charAt(aiTextResponse.length - 1);
	if (lastCharacter !== '?')
		aiTextResponse += ` ${aiResponse?.data?.follow_up}`;
	//split text response into array of sentences
	const splittedResponses = breakStringOnPeriods(aiTextResponse);
	//add a couple links as a separate response
	aiResponse?.data?.links?.map((link, i) => {
		if (i < 2 && link !== '')
			splittedResponses?.push(addSearchParamsToUrl(link, businessUtms));
	});

	return {
		data: {
			responses: splittedResponses,
			links: aiResponse?.data?.links?.slice(0, 2),
			exitState: aiResponse?.data?.exit_state,
			conversationRoute: aiResponse?.data?.conversation_route,
			lastFormSession: aiResponse?.data?.last_form_session,
			action: aiResponse?.data?.action == {} ? null : aiResponse?.data?.action,
		},
	};
};

const generateWorkerResponse = async ({
	chatId,
	inputMessage,
	workerId,
	businessUtms,
}) => {
	const aiResponse = await krispyAxios({
		method: 'POST',
		url: `${aiServiceBaseUrl}/v1/assistants/zoe/${workerId}/chat/${chatId}`,
		body: {
			incoming_message: inputMessage,
			pinecone_index: 'krispy',
		},
	});
	if (aiResponse.error) return { error: aiResponse.error };
	let aiTextResponse = aiResponse?.data?.outcoming_message?.trim();
	const formattedAiResponses = [];

	//format the text to add new lines if there is/are any \n
	aiTextResponse = formatStringWithNewlines(aiTextResponse);
	formattedAiResponses.push(aiTextResponse);

	//check if question already with text, if not, then add follow up question
	const lastCharacter = aiTextResponse.charAt(aiTextResponse.length - 1);
	if (lastCharacter !== '?')
		formattedAiResponses.push(aiResponse?.data?.follow_up);

	//add a couple links as a separate response
	aiResponse?.data?.links?.map((link, i) => {
		if (i < 2 && link !== '')
			formattedAiResponses?.push(addSearchParamsToUrl(link, businessUtms));
	});

	return {
		data: {
			responses: formattedAiResponses,
			links: aiResponse?.data?.links?.slice(0, 2),
			exitState: aiResponse?.data?.exit_state,
			conversationRoute: aiResponse?.data?.conversation_route,
			lastFormSession: aiResponse?.data?.last_form_session,
			planId: aiResponse?.data?.planer_id,
		},
	};
};

const embedUrlForScraping = async ({ url, entityId }) => {
	const { error, data } = await krispyAxios({
		method: 'POST',
		url: `${aiServiceBaseUrl}/v1/embed/url/${entityId}`,
		body: {
			url: url,
			pinecone_index: 'krispy',
		},
	});
	if (error) return { error: error };
	return { data: data };
};

const embedShopifyStoreData = async ({
	entityId,
	shopifyStoreUri,
	shopifyStoreKey,
	allowScraping,
	baseProductUrl,
	filters,
}) => {
	const { error, data } = await krispyAxios({
		method: 'POST',
		url: `${aiServiceBaseUrl}/v1/embed/shopify/${entityId}`,
		body: {
			store_name: shopifyStoreUri,
			shopify_token: shopifyStoreKey,
			pinecone_index: 'krispy',
			scraping: allowScraping,
			...(baseProductUrl && { base_product_url: baseProductUrl }),
			...(filters && { filters: filters }),
		},
	});
	if (error) return { error: error };
	return { data: data };
};

const embedText = async ({ text, metadata, entityId }) => {
	const { error, data } = await krispyAxios({
		method: 'POST',
		url: `${aiServiceBaseUrl}/v1/embed/text/${entityId}`,
		body: {
			text: text,
			pinecone_index: 'krispy',
			...(metadata && { metadata: metadata }),
		},
	});
	if (error) return { error: error };
	return { data: data };
};

const runAgent = async ({ agentId, agentSessionId, receivedMessage }) => {
	const { data, error } = await krispyAxios({
		method: 'POST',
		url: `${aiServiceBaseUrl}/v1/agent/${agentId}/${agentSessionId}`,
		body: {
			text_input: receivedMessage,
		},
	});
	if (error) return { error: error };
	return { data: data };
};

const deleteShopifyEmbedding = async ({ entityId }) => {
	const { error, data } = await krispyAxios({
		method: 'DELETE',
		url: `${aiServiceBaseUrl}/v1/embed/shopify/${entityId}`,
	});
	if (error) return { error: error };
	return { data: data };
};

const updateEmbedding = async ({ entityId, embeddingIds, metadata }) => {
	const { error, data } = await krispyAxios({
		method: 'PATCH',
		url: `${aiServiceBaseUrl}/v1/embed/${entityId}/metadata`,
		body: {
			index_name: 'krispy',
			embedding_ids: embeddingIds,
			metadata,
		},
	});
	if (error) return { error: error };
	return { data: data };
};

const deleteEmbedding = async ({ entityId, embeddingIds }) => {
	const { error, data } = await krispyAxios({
		method: 'DELETE',
		url: `${aiServiceBaseUrl}/v1/embed/ids/${entityId}`,
		body: {
			index_name: 'krispy',
			embedding_ids: embeddingIds,
		},
	});
	if (error) return { error: error };
	return { data: data };
};

const transcribeWhatsappAudio = async ({ d360ApiKey, audioId }) => {
	const { error, data } = await krispyAxios({
		method: 'GET',
		url: `${aiServiceBaseUrl}/v1/media/whatsapp/audio/${audioId}`,
		headers: {
			'd360-api-key': d360ApiKey,
		},
	});
	if (error) return { error: error };
	return { data: data };
};

module.exports = {
	generateAiResponse,
	embedUrlForScraping,
	embedShopifyStoreData,
	embedText,
	runAgent,
	deleteShopifyEmbedding,
	updateEmbedding,
	deleteEmbedding,
	generateWorkerResponse,
	transcribeWhatsappAudio,
};
