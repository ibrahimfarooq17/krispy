import { Divider, IconButton } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { cloneDeep } from 'lodash';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../components/@generalComponents/CustomButton';
import Input from '../components/@generalComponents/Input';
import Loader from '../components/@generalComponents/Loader';
import { getAllFlows } from '../redux/actions/flow.actions';
import { getAllTemplates } from '../redux/actions/template.actions';
import generateRandomString from '../utilities/generateRandomString';
import krispyAxios from '../utilities/krispyAxios';

const AddFlowModal = ({ isOpen, modalCloseHandler }) => {
	const dispatch = useDispatch();

	const [resLoading, setResLoading] = useState();
	const [formState, setFormState] = useState({
		name: '',
		trigger: 'SHOPIFY_ORDER_RECEIVED',
	});
	const [actions, setActions] = useState([
		{
			key: generateRandomString(15),
			type: 'REPLY_TEMPLATE',
			delayDays: 0,
			delayHours: 0,
		},
	]);

	const templates = useSelector((state) => state.templateReducer.allTemplates);

	useEffect(() => {
		if (!templates) dispatch(getAllTemplates());
	}, [templates]);

	const addAction = () => {
		setActions([
			...actions,
			{
				key: generateRandomString(15),
				type: 'REPLY_TEMPLATE',
				delayDays: 0,
				delayHours: 0,
			},
		]);
	};

	const removeAction = (key) => {
		const filteredActions = actions?.filter((action) => action?.key !== key);
		setActions(filteredActions);
	};

	const changeHandler = (e) => {
		const { name, value } = e?.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const actionChangeHandler = (e, key) => {
		const { name, value } = e?.target;
		const clonedActions = cloneDeep(actions);
		const foundAction = clonedActions.find((action) => action?.key === key);
		if (!foundAction) return;
		foundAction[name] = value;
		setActions(clonedActions);
	};

	const createFlow = async () => {
		await krispyAxios({
			method: 'POST',
			url: 'flows',
			body: {
				name: formState.name,
				trigger: formState.trigger,
				actions: actions?.map((action) => {
					return {
						type: action?.type,
						template: action?.templateId,
						delay: {
							days: action.delayDays,
							hours: action.delayHours,
						},
					};
				}),
			},
			loadingStateSetter: setResLoading,
			successMessage: 'Flow created!',
			onSuccess: () => {
				modalCloseHandler();
				dispatch(getAllFlows());
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
				<h1 className='f-2xl-medium m-0'>Create a flow</h1>
				<DialogContentText id='alert-dialog-description'>
					<p className='f-sm-regular mb-3'>
						Create flows that perform a series of actions upon the occurence of
						a trigger.
					</p>
				</DialogContentText>
			</DialogTitle>
			<Loader renderChildren={templates}>
				<DialogContent>
					<div className='container'>
						<Input
							thin
							name='name'
							label='Name'
							type='text'
							value={formState.name}
							onChange={changeHandler}
						/>
						<label className='input-label'>Trigger</label>
						<Input
							thin
							name='trigger'
							type='select'
							options={[
								{
									label: 'Shopify Order Received',
									value: 'SHOPIFY_ORDER_RECEIVED',
								},
							]}
							value={formState?.trigger}
							onChange={changeHandler}
						/>
						<div className='d-flex justify-content-between mt-3'>
							<h6>Actions</h6>
							<IconButton onClick={addAction}>
								<img
									src='/images/add-icon.svg'
									alt='Add icon'
								/>
							</IconButton>
						</div>
						{actions?.map((action) => {
							return (
								<div className='row'>
									<div className='col-md-10'>
										<div className='row'>
											<div className='col-md-6'>
												<Input
													thin
													label='Delay days'
													name='delayDays'
													type='text'
													value={action.delayDays}
													onChange={(e) => actionChangeHandler(e, action.key)}
												/>
											</div>
											<div className='col-md-6'>
												<Input
													thin
													label='Delay hours'
													name='delayHours'
													type='text'
													value={action.delayHours}
													onChange={(e) => actionChangeHandler(e, action.key)}
												/>
											</div>
											<div className='col-md-12'>
												<label className='input-label'>Type</label>
												<Input
													thin
													name='type'
													type='select'
													options={[
														{
															label: 'Reply with template message',
															value: 'REPLY_TEMPLATE',
														},
													]}
													value={action.type}
													onChange={(e) => actionChangeHandler(e, action.key)}
												/>
											</div>
											<div className='col-md-12'>
												<label className='input-label'>Template</label>
												<Input
													thin
													name='templateId'
													type='select'
													options={templates
														?.filter(
															(template) =>
																template?.flow === 'GENERAL' &&
																template?.status === 'approved'
														)
														?.map((template) => {
															return {
																label: template?.name,
																value: template?.templateId,
															};
														})}
													value={action?.templateId}
													onChange={(e) => actionChangeHandler(e, action.key)}
												/>
											</div>
										</div>
									</div>
									<div className='col-md-2 d-flex align-items-center'>
										<IconButton onClick={() => removeAction(action?.key)}>
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
											marginBottom: '15px',
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
						onClick={createFlow}
						loading={resLoading}
						// disabled={!formState?.feedback}
					/>
				</DialogActions>
			</Loader>
		</Dialog>
	);
};

export default AddFlowModal;
