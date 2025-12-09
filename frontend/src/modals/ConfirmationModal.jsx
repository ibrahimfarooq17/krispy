import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '../components/@generalComponents/Input';
import CustomButton from '../components/@generalComponents/CustomButton';
import { getAllConnectors } from '../redux/actions/connector.actions';
import { Alert } from '@mui/material';
import krispyAxios from '../utilities/krispyAxios';

const ConfirmationModal = ({
	isOpen,
	modalCloseHandler,
	title,
	details,
	onConfirm,
}) => {
	const [resLoading, setResLoading] = useState(false);

	const confirmAction = async () => {
		setResLoading(true);
		await onConfirm();
		setResLoading(false);
		modalCloseHandler();
	};

	return (
		<Dialog
			open={isOpen}
			onClose={modalCloseHandler}
			fullWidth
			maxWidth='sm'
		>
			<DialogTitle>
				<h1 className='f-2xl-medium mb-3'>{title}</h1>
			</DialogTitle>
			<DialogContent>
				{details && (
					<DialogContentText>
						<p className='f-sm-regular mb-3'>{details}</p>
					</DialogContentText>
				)}
			</DialogContent>
			<DialogActions>
				<div className='row d-flex justify-content-end w-100'>
					<div className='col-md-4'>
						<CustomButton
							label='Cancel'
							type='medium-grey'
							customStyle={{
								fontSize: '15px',
								fontWeight: '600',
								marginTop: '15px',
							}}
							onClick={modalCloseHandler}
						/>
					</div>
					<div className='col-md-4'>
						<CustomButton
							label='Confirm'
							type='medium-purple'
							customStyle={{
								fontSize: '15px',
								fontWeight: '600',
								marginTop: '15px',
							}}
							onClick={confirmAction}
							loading={resLoading}
						/>
					</div>
				</div>
			</DialogActions>
		</Dialog>
	);
};

export default ConfirmationModal;
