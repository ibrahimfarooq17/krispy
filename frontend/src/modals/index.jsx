import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as modalActions from '../redux/actions/modal.actions';
import ConnectShopifyModal from './ConnectShopifyModal';
import SelectTemplateModal from './SelectTemplateModal';
import AddFeedbackModal from './AddFeedbackModal';
import AddScrapingUrlModal from './AddScrapingUrlModal';
import TestCampaignModal from './TestCampaignModal';
import AddAgentModal from './AddAgentModal';
import QrCodeModal from './QrCodeModal';
import AddFlowModal from './AddFlowModal';
import EditShopifyProductModal from './EditShopifyProductModal';
import ConnectKlaviyoModal from './ConnectKlaviyoModal';
import ConfirmationModal from './ConfirmationModal';
import ImportContactsModal from './ImportContactsModal';

const AllModalsRoot = () => {
	const dispatch = useDispatch();

	const globalModalState = useSelector((state) => state.modalReducer);

	return (
		<>
			{globalModalState.connectShopifyModal.isOpen && (
				<ConnectShopifyModal
					{...globalModalState.connectShopifyModal}
					modalCloseHandler={() =>
						dispatch(modalActions.connectShopifyModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.selectTemplateModal.isOpen && (
				<SelectTemplateModal
					{...globalModalState.selectTemplateModal}
					modalCloseHandler={() =>
						dispatch(modalActions.selectTemplateModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.addFeedbackModal.isOpen && (
				<AddFeedbackModal
					{...globalModalState.addFeedbackModal}
					modalCloseHandler={() =>
						dispatch(modalActions.addFeedbackModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.addScrapingUrlModal.isOpen && (
				<AddScrapingUrlModal
					{...globalModalState.addScrapingUrlModal}
					modalCloseHandler={() =>
						dispatch(modalActions.addScrapingUrlModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.testCampaignModal.isOpen && (
				<TestCampaignModal
					{...globalModalState.testCampaignModal}
					modalCloseHandler={() =>
						dispatch(modalActions.testCampaignModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.addAgentModal.isOpen && (
				<AddAgentModal
					{...globalModalState.addAgentModal}
					modalCloseHandler={() =>
						dispatch(modalActions.addAgentModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.qrCodeModal.isOpen && (
				<QrCodeModal
					{...globalModalState.qrCodeModal}
					modalCloseHandler={() =>
						dispatch(modalActions.qrCodeModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.addFlowModal.isOpen && (
				<AddFlowModal
					{...globalModalState.addFlowModal}
					modalCloseHandler={() =>
						dispatch(modalActions.addFlowModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.editShopifyProductModal.isOpen && (
				<EditShopifyProductModal
					{...globalModalState.editShopifyProductModal}
					modalCloseHandler={() =>
						dispatch(modalActions.editShopifyProductModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.connectKlaviyoModal.isOpen && (
				<ConnectKlaviyoModal
					{...globalModalState.connectKlaviyoModal}
					modalCloseHandler={() =>
						dispatch(modalActions.connectKlaviyoModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.confirmationModal.isOpen && (
				<ConfirmationModal
					{...globalModalState.confirmationModal}
					modalCloseHandler={() =>
						dispatch(modalActions.confirmationModal({ isOpen: false }))
					}
				/>
			)}
			{globalModalState.importContactsModal.isOpen && (
				<ImportContactsModal
					{...globalModalState.importContactsModal}
					modalCloseHandler={() =>
						dispatch(modalActions.importContactsModal({ isOpen: false }))
					}
				/>
			)}
		</>
	);
};

export default AllModalsRoot;
