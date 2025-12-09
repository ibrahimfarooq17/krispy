import { Divider, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { cloneDeep } from 'lodash';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomButton from '../components/@generalComponents/CustomButton';
import Input from '../components/@generalComponents/Input';
import {
	clearSingleChat,
	getSingleChat,
} from '../redux/actions/conversation.actions';
import generateRandomString from '../utilities/generateRandomString';
import krispyAxios from '../utilities/krispyAxios';

const TestCampaignModal = ({ isOpen, modalCloseHandler, templateId }) => {
	const router = useRouter();
	const dispatch = useDispatch();

	const [contacts, setContacts] = useState([
		{
			key: generateRandomString(15),
			name: '',
			phoneNumber: '',
		},
	]);
	const [resLoading, setResLoading] = useState(false);

	const addContact = () => {
		setContacts([
			...contacts,
			{
				key: generateRandomString(15),
				name: '',
				phoneNumber: '',
			},
		]);
	};

	const changeHandler = (e, key) => {
		const { name, value } = e?.target;
		const clonedContacts = cloneDeep(contacts);
		const foundContact = clonedContacts.find((contact) => contact?.key === key);
		if (!foundContact) return;
		foundContact[name] = value;
		setContacts(clonedContacts);
	};

	const launchTest = async () => {
		await krispyAxios({
			method: 'POST',
			url: 'campaigns/test',
			body: {
				templateId: templateId,
				contacts: contacts,
			},
			loadingStateSetter: setResLoading,
			successMessage: 'Test successful!',
			onSuccess: modalCloseHandler,
		});
	};

	return (
		<Dialog
			open={isOpen}
			onClose={modalCloseHandler}
			fullWidth
			maxWidth='sm'
		>
			<DialogTitle>
				<div className='d-flex justify-content-between'>
					<h1 className='f-2xl-medium m-0'>Test your campaign</h1>
					<IconButton
						onClick={addContact}
						disabled={contacts.length >= 4}
					>
						<img
							src='/images/add-icon.svg'
							alt='Add icon'
						/>
					</IconButton>
				</div>
				<DialogContentText id='alert-dialog-description'>
					<p className='f-sm-regular mb-3'>
						See how your campaign looks like on WhatsApp by sending it out to
						some test contacts. Tests can be sent out to a maximum of 4
						contacts.
					</p>
				</DialogContentText>
			</DialogTitle>
			<DialogContent>
				{contacts.map((contact) => {
					return (
						<React.Fragment>
							<Input
								thin
								label='Contact Name'
								type='text'
								name='name'
								value={contact?.name}
								onChange={(e) => changeHandler(e, contact.key)}
							/>
							<Input
								thin
								label='Phone Number'
								type='text'
								name='phoneNumber'
								value={contact?.phoneNumber}
								onChange={(e) => changeHandler(e, contact.key)}
							/>
							<Divider
								sx={{
									marginTop: '15px',
									marginBottom: '15px',
								}}
							/>
						</React.Fragment>
					);
				})}
			</DialogContent>
			<DialogActions>
				<CustomButton
					label='Confirm'
					type='medium-purple'
					customStyle={{
						fontSize: '15px',
						fontWeight: '600',
						marginTop: '15px',
					}}
					onClick={launchTest}
					loading={resLoading}
					// disabled={!formState?.feedback}
				/>
			</DialogActions>
		</Dialog>
	);
};

export default TestCampaignModal;
