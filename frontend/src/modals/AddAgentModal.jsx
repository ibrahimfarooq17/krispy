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
import { getAllAgents } from '../redux/actions/agent.actions';
import {
	clearSingleChat,
	getSingleChat,
} from '../redux/actions/conversation.actions';
import generateRandomString from '../utilities/generateRandomString';
import krispyAxios from '../utilities/krispyAxios';

const AddAgentModal = ({ isOpen, modalCloseHandler }) => {
	const dispatch = useDispatch();

	const [agentName, setAgentName] = useState('');
	const [fields, setFields] = useState([
		{
			key: generateRandomString(15),
			name: '',
			type: 'str',
			description: '',
		},
	]);
	const [resLoading, setResLoading] = useState(false);

	const addField = () => {
		setFields([
			...fields,
			{
				key: generateRandomString(15),
				name: '',
				type: 'str',
				description: '',
			},
		]);
	};

	const changeHandler = (e, key) => {
		const { name, value } = e?.target;
		const clonedFields = cloneDeep(fields);
		const foundField = clonedFields.find((field) => field?.key === key);
		if (!foundField) return;
		foundField[name] = value;
		setFields(clonedFields);
	};

	const removeField = (key) => {
		const filteredFields = fields?.filter((field) => field?.key !== key);
		setFields(filteredFields);
	};

	const createAgent = async () => {
		const structuredFields = {};
		fields?.map((field) => {
			const fieldName = field?.name?.toLowerCase();
			structuredFields[fieldName] = {
				type: field?.type,
				description: `${field?.description}, write ${
					field?.type === 'str' ? "''" : '-1'
				} if the user does not provide an answer.`,
			};
		});
		await krispyAxios({
			method: 'POST',
			url: 'agents',
			body: {
				name: agentName,
				fields: structuredFields,
			},
			loadingStateSetter: setResLoading,
			successMessage: 'Agent created!',
			onSuccess: () => {
				modalCloseHandler();
				dispatch(getAllAgents());
			},
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
				<h1 className='f-2xl-medium m-0'>Create an agent</h1>
				<DialogContentText id='alert-dialog-description'>
					<p className='f-sm-regular mb-3'>
						Create an agent that asks a series of questions from the customer
						based on the fields you would like to extract.
					</p>
				</DialogContentText>
			</DialogTitle>
			<DialogContent>
				<div className='container'>
					<Input
						thin
						label='Agent Name'
						type='text'
						value={agentName}
						onChange={(e) => setAgentName(e?.target?.value)}
					/>
					<div className='d-flex justify-content-between'>
						<h6>Fields</h6>
						<IconButton
							onClick={addField}
							disabled={fields.length >= 4}
						>
							<img
								src='/images/add-icon.svg'
								alt='Add icon'
							/>
						</IconButton>
					</div>
					{fields.map((field) => {
						return (
							<div className='row'>
								<div className='col-md-10'>
									<div className='row'>
										<div className='col-md-6'>
											<Input
												thin
												label='Name'
												type='text'
												name='name'
												value={field?.name}
												onChange={(e) => changeHandler(e, field.key)}
											/>
										</div>
										<div className='col-md-6'>
											<label className='input-label'>Type</label>
											<Input
												type='select'
												name='type'
												options={[
													{
														label: 'String',
														value: 'str',
													},
													{
														label: 'Number',
														value: 'int',
													},
												]}
												value={field?.type}
												onChange={(e) => changeHandler(e, field.key)}
											/>
										</div>
										<div className='col-md-12'>
											<Input
												thin
												label='Description'
												type='text'
												name='description'
												value={field?.description}
												onChange={(e) => changeHandler(e, field.key)}
											/>
										</div>
									</div>
								</div>
								<div className='col-md-2 d-flex align-items-center'>
									<IconButton onClick={() => removeField(field?.key)}>
										<img
											src='/images/bin-icon.svg'
											width={20}
											alt='Bin icon'
										/>
									</IconButton>
								</div>
								<Divider
									sx={{
										marginTop: '5px',
										marginBottom: '5px',
									}}
								/>
							</div>
						);
					})}
				</div>
			</DialogContent>
			<DialogActions>
				<CustomButton
					label='Create'
					type='medium-purple'
					customStyle={{
						fontSize: '15px',
						fontWeight: '600',
						marginTop: '15px',
					}}
					onClick={createAgent}
					loading={resLoading}
					// disabled={!formState?.feedback}
				/>
			</DialogActions>
		</Dialog>
	);
};

export default AddAgentModal;
