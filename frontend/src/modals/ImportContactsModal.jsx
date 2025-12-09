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
import FileUploader from '../components/@generalComponents/FileUploader';
import krispyAxios from '../utilities/krispyAxios';
import { Alert } from '@mui/material';

const ImportContactsModal = ({ isOpen, modalCloseHandler }) => {
	const [csvFile, setCsvFile] = useState();
	const [resLoading, setResLoading] = useState(false);

	const onImport = async () => {
		const formData = new FormData();
		formData.append('contactsCsvFile', csvFile);

		await krispyAxios({
			method: 'POST',
			url: 'contacts/import',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			body: formData,
			loadingStateSetter: setResLoading,
			successMessage: 'Contacts imported!',
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
				<h1 className='f-2xl-medium mb-3'>Import Contacts</h1>
			</DialogTitle>
			<DialogContent>
				<DialogContentText>
					<p className='f-sm-regular mb-3'>
						Import your external contacts to Krispy using a CSV file. Make sure
						the CSV file has two columns&nbsp;
						<code>name</code> and <code>phoneNumber</code>.
					</p>
				</DialogContentText>
				<div className='row d-flex justify-content-end w-100'>
					<FileUploader
						containerClass='p-2'
						showPlaceholderIcon={false}
						title={
							csvFile?.name || 'Drag your CSV file here, or click to browse.'
						}
						label='Contact list'
						acceptedFileTypes={{
							'text/csv': ['.csv'],
						}}
						maxFileSize={5000000}
						subtitle='Only .csv files allowed, up to 5MB.'
						onFileAdded={(file) => setCsvFile(file?.[0])}
					/>
					<Alert
						severity='error'
						sx={{ background: '#ffede6', marginBottom: '20px' }}
					>
						Once you import your contacts, you need to launch an opt-in campaign
						to gather the marketing consent of the new contacts.
					</Alert>
				</div>
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
							label='Import'
							type='medium-purple'
							customStyle={{
								fontSize: '15px',
								fontWeight: '600',
								marginTop: '15px',
							}}
							disabled={!csvFile}
							onClick={onImport}
							loading={resLoading}
						/>
					</div>
				</div>
			</DialogActions>
		</Dialog>
	);
};

export default ImportContactsModal;
