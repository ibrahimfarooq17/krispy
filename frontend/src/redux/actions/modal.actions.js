export const CONNECT_SHOPIFY_MODAL = 'CONNECT_SHOPIFY_MODAL';
export const CONNECT_KLAVIYO_MODAL = 'CONNECT_KLAVIYO_MODAL';
export const SELECT_TEMPLATE_MODAL = 'SELECT_TEMPLATE_MODAL';
export const ADD_FEEDBACK_MODAL = 'ADD_FEEDBACK_MODAL';
export const ADD_SCRAPING_URL_MODAL = 'ADD_SCRAPING_URL_MODAL';
export const TEST_CAMPAIGN_MODAL = 'TEST_CAMPAIGN_MODAL';
export const ADD_AGENT_MODAL = 'ADD_AGENT_MODAL';
export const QR_CODE_MODAL = 'QR_CODE_MODAL';
export const ADD_FLOW_MODAL = 'ADD_FLOW_MODAL';
export const EDIT_SHOPIFY_PRODUCT_MODAL = 'EDIT_SHOPIFY_PRODUCT_MODAL';
export const CONFIRMATION_MODAL = 'CONFIRMATION_MODAL';
export const IMPORT_CONTACTS_MODAL = 'IMPORT_CONTACTS_MODAL';

export const connectShopifyModal = (payload) => ({
	type: CONNECT_SHOPIFY_MODAL,
	payload,
});

export const connectKlaviyoModal = (payload) => ({
	type: CONNECT_KLAVIYO_MODAL,
	payload,
});

export const selectTemplateModal = (payload) => ({
	type: SELECT_TEMPLATE_MODAL,
	payload,
});

export const addFeedbackModal = (payload) => ({
	type: ADD_FEEDBACK_MODAL,
	payload,
});

export const addScrapingUrlModal = (payload) => ({
	type: ADD_SCRAPING_URL_MODAL,
	payload,
});

export const testCampaignModal = (payload) => ({
	type: TEST_CAMPAIGN_MODAL,
	payload,
});

export const addAgentModal = (payload) => ({
	type: ADD_AGENT_MODAL,
	payload,
});

export const qrCodeModal = (payload) => ({
	type: QR_CODE_MODAL,
	payload,
});

export const addFlowModal = (payload) => ({
	type: ADD_FLOW_MODAL,
	payload,
});

export const editShopifyProductModal = (payload) => ({
	type: EDIT_SHOPIFY_PRODUCT_MODAL,
	payload,
});

export const confirmationModal = (payload) => ({
	type: CONFIRMATION_MODAL,
	payload,
});

export const importContactsModal = (payload) => ({
	type: IMPORT_CONTACTS_MODAL,
	payload,
});
