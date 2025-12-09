import { combineReducers } from 'redux';
import { agentReducer } from './agent.reducer';
import { connectorReducer } from './connector.reducer';
import { conversationReducer } from './conversation.reducer';
import { flowReducer } from './flow.reducer';
import { knowledgeBaseReducer } from './knowledgeBase.reducer';
import { modalReducer } from './modal.reducer';
import { preferenceReducer } from './preference.reducer';
import { qrCodeReducer } from './qrCode.reducer';
import { subFlowReducer } from './subFlow.reducer';
import { templateReducer } from './template.reducer';
import { userReducer } from './user.reducer';

const allReducers = combineReducers({
	userReducer,
	preferenceReducer,
	modalReducer,
	conversationReducer,
	connectorReducer,
	templateReducer,
	knowledgeBaseReducer,
	agentReducer,
	qrCodeReducer,
	flowReducer,
	subFlowReducer,
});

export default allReducers;
