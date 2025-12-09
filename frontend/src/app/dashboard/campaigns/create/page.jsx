'use client';
import { InputAdornment, TextField } from '@mui/material';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../../../components/@generalComponents/CustomButton';
import FileUploader from '../../../../components/@generalComponents/FileUploader';
import Heading from '../../../../components/@generalComponents/Heading';
import Input from '../../../../components/@generalComponents/Input';
import Loader from '../../../../components/@generalComponents/Loader';
import MainLayout from '../../../../layout/MainLayout';
import { testCampaignModal } from '../../../../redux/actions/modal.actions';
import { getAllTemplates } from '../../../../redux/actions/template.actions';
import krispyAxios from '../../../../utilities/krispyAxios';

const CreateCampaign = () => {
	const dispatch = useDispatch();
	const router = useRouter();

	const [formState, setFormState] = useState({
		date: moment().format('YYYY-MM-DD'),
		time: moment().format('HH:mm'),
	});
	const [resLoading, setResLoading] = useState(false);
	const [selectedTemplate, setSelectedTemplate] = useState({});
	const [selectedTemplateButtons, setSelectedTemplateButtons] = useState([]);

	const templates = useSelector((state) => state.templateReducer.allTemplates);

	useEffect(() => {
		dispatch(getAllTemplates());
	}, []);

	const changeHandler = (e) => {
		const { name, value } = e?.target;
		setFormState({
			...formState,
			[name]: value,
		});

		if (name === 'templateId') {
			const template = templates?.find(
				(template) => template?.templateId === value
			);
			setSelectedTemplate(template);

			if (
				template.components.find((component) => component?.type === 'BUTTONS')
			) {
				setSelectedTemplateButtons(
					template.components.find((component) => component?.type === 'BUTTONS')
						.buttons
				);
			} else {
				setSelectedTemplateButtons([]);
			}
		}
	};

	const templateImageUrl = () => {
		console.log(selectedTemplate);
		if (Object.keys(selectedTemplate).length > 0) {
			const url = selectedTemplate?.components.find(
				(component) => component?.type === 'HEADER'
			)?.defaultUrl;

			return url;
		}
		return;
	};

	const testCampaign = () => {
		dispatch(
			testCampaignModal({
				isOpen: true,
				templateId: formState?.templateId,
			})
		);
	};

	const launchCampaign = async () => {
		const formData = new FormData();
		formData.append('name', formState?.name);
		formData.append('templateId', formState?.templateId);
		formData.append('date', moment(formState?.date).format('DD/MM/YYYY'));
		formData.append('time', formState?.time);
		formData.append(
			'timezone',
			Intl.DateTimeFormat().resolvedOptions().timeZone
		);
		formState.csvFile && formData.append('contactsCsvFile', formState.csvFile);

		await krispyAxios({
			method: 'POST',
			url: 'campaigns',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			body: formData,
			loadingStateSetter: setResLoading,
			successMessage: 'Campaign launched!',
			onSuccess: () => router.push('/dashboard/campaigns'),
		});
	};

	return (
		<MainLayout>
			<Loader renderChildren={templates}>
				<div className='flex h-full'>
					<div className='flex-1 py-4 px-8'>
						<Heading
							title={'Campaign'}
							subtitle={'Launch a campaign to reach out to all your contacts!'}
							buttons={[
								{
									text: 'Back to all campaigns',
									onClick: () => {
										router.push('/dashboard/campaigns');
									},
									image: {
										url: '/images/arrow-long-left.svg',
										altText: 'left arrow icon',
									},
								},
							]}
						/>
						<Input
							thin
							label='Campaign Name'
							name='name'
							type='text'
							value={formState?.name}
							onChange={changeHandler}
						/>
						<label className='input-label'>Template</label>
						<Input
							thin
							name='templateId'
							type='select'
							options={templates
								?.filter(
									(template) =>
										(template?.flow === 'GENERAL' ||
											template?.flow === 'OPT_IN') &&
										template?.status === 'approved'
								)
								?.map((template) => {
									return {
										label: template?.name,
										value: template?.templateId,
									};
								})}
							value={formState?.templateId}
							onChange={changeHandler}
						/>
						<div className='row'>
							<div className='col-md-6'>
								<Input
									thin
									label='Scheduled Date'
									name='date'
									type='date'
									value={formState?.date}
									onChange={changeHandler}
								/>
							</div>
							<div className='col-md-6'>
								<Input
									thin
									label='Scheduled Time'
									name='time'
									type='time'
									value={formState?.time}
									onChange={changeHandler}
								/>
							</div>
							<p className='input-subtitle mt-0'>
								The campaign launch date and time is set with respect to your
								local timezone.
							</p>
						</div>
						<FileUploader
							containerClass='p-2'
							showPlaceholderIcon={false}
							title={
								formState?.csvFile?.name ||
								'Drag your CSV file here, or click to browse.'
							}
							label='Contact list'
							acceptedFileTypes={{
								'text/csv': ['.csv'],
							}}
							maxFileSize={5000000}
							subtitle='Only .csv files allowed, up to 5MB.'
							onFileAdded={(file) =>
								setFormState({ ...formState, csvFile: file?.[0] })
							}
						/>
						<p className='input-subtitle mt-0'>
							The CSV file must have 2 columns, &nbsp;
							<code>name</code> and&nbsp;
							<code>phoneNumber</code>.&nbsp; If you do not add a custom contact
							list, the campaign will be sent out to ALL your contacts on
							Krispy.
						</p>
						<div className='row mt-3'>
							<div className='col-md-6'>
								<CustomButton
									type='medium-outline'
									label='Test before launch'
									onClick={testCampaign}
								/>
							</div>
							<div className='col-md-6'>
								<CustomButton
									showConfirmation
									type='medium-purple'
									label='Launch Campaign'
									onClick={launchCampaign}
									loading={resLoading}
								/>
							</div>
						</div>
					</div>
					<div className='flex-1 h-dvh sticky top-0 overflow-y-hidden'>
						<div className='relative flex flex-col w-3/5 mx-auto rounded-lg p-3 !border border-slate-200 !shadow-md shadow-slate-50 justify-between h-5/6 overflow-y-scroll'>
							<div className='flex flex-col gap-3 mb-3'>
								<div className='mx-auto sticky top-0'>
									<img
										src={'/images/logo.svg '}
										alt='Krispy logo'
									/>
								</div>
								<div className=''>
									{formState.templateId && templateImageUrl() && (
										<img
											src={templateImageUrl()}
											style={{ borderRadius: '10px', width: '80%' }}
											alt='template image'
										/>
									)}
									<p className='m-0 mt-2 p-2 w-4/5 rounded-lg rounded-tl-none bg-slate-200 text-slate-600 text-sm'>
										{selectedTemplate?.components?.find(
											(component) => component?.type === 'BODY'
										)?.text || 'Select a template to preview here.'}
									</p>
									{selectedTemplateButtons.length > 0 &&
										selectedTemplateButtons?.map((button) => (
											<span className='block my-2 w-4/5 p-2 rounded-lg bg-slate-50 !border border-slate-200 text-slate-600 text-sm'>
												{button.text}
											</span>
										))}
								</div>
							</div>
							<div className='sticky bottom-0 bg-white'>
								<TextField
									className='w-full'
									size='small'
									disabled={true}
									InputProps={{
										endAdornment: (
											<InputAdornment
												disableTypography
												position='end'
											>
												<FaArrowCircleUp
													size={25}
													color='grey'
												/>
											</InputAdornment>
										),
									}}
								/>
							</div>
						</div>
					</div>
				</div>
			</Loader>
		</MainLayout>
	);
};

export default CreateCampaign;
