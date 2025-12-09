import * as Actions from '../actions/modal.actions';
const initialState = {
	connectShopifyModal: { isOpen: false },
	connectKlaviyoModal: { isOpen: false },
	selectTemplateModal: { isOpen: false },
	addFeedbackModal: { isOpen: false },
	addScrapingUrlModal: { isOpen: false },
	testCampaignModal: { isOpen: false },
	addAgentModal: { isOpen: false },
	qrCodeModal: { isOpen: false },
	addFlowModal: { isOpen: false },
	editShopifyProductModal: { isOpen: false },
	confirmationModal: { isOpen: false },
	importContactsModal: { isOpen: false },
};

export const modalReducer = (state = initialState, action) => {
	const { type, payload } = action;
	switch (type) {
		case Actions.CONNECT_SHOPIFY_MODAL:
			return { ...initialState, connectShopifyModal: payload };
		case Actions.CONNECT_KLAVIYO_MODAL:
			return { ...initialState, connectKlaviyoModal: payload };
		case Actions.SELECT_TEMPLATE_MODAL:
			return { ...initialState, selectTemplateModal: payload };
		case Actions.ADD_FEEDBACK_MODAL:
			return { ...initialState, addFeedbackModal: payload };
		case Actions.ADD_SCRAPING_URL_MODAL:
			return { ...initialState, addScrapingUrlModal: payload };
		case Actions.TEST_CAMPAIGN_MODAL:
			return { ...initialState, testCampaignModal: payload };
		case Actions.ADD_AGENT_MODAL:
			return { ...initialState, addAgentModal: payload };
		case Actions.QR_CODE_MODAL:
			return { ...initialState, qrCodeModal: payload };
		case Actions.ADD_FLOW_MODAL:
			return { ...initialState, addFlowModal: payload };
		case Actions.EDIT_SHOPIFY_PRODUCT_MODAL:
			return { ...initialState, editShopifyProductModal: payload };
		case Actions.CONFIRMATION_MODAL:
			return { ...initialState, confirmationModal: payload };
		case Actions.IMPORT_CONTACTS_MODAL:
			return { ...initialState, importContactsModal: payload };
		default:
			return state;
	}
};
