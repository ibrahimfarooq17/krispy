'use client';
import { Alert, Button, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomButton from '../../../../components/@generalComponents/CustomButton';
import FileUploader from '../../../../components/@generalComponents/FileUploader';
import Heading from '../../../../components/@generalComponents/Heading';
import Input from '../../../../components/@generalComponents/Input';
import TemplateButtons from '../../../../components/Settings/Templates/TemplateButtons';
import {
	TEMPLATE_FLOWS,
	TEMPLATE_LANGUAGES,
} from '../../../../exports/commonExports';
import SettingsLayout from '../../../../layout/SettingsLayout';
import { getAllTemplates } from '../../../../redux/actions/template.actions';
import krispyAxios from '../../../../utilities/krispyAxios';

const CreateNewTemplate = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const alertBannerRef = useRef(null);

	const [resError, setResError] = useState(false);
	const [resLoading, setRestLoading] = useState(false);
	const [formState, setFormState] = useState({
		flow: 'GENERAL',
		templateLanguage: 'en_US',
	});
	const [buttons, setButtons] = useState([]);

	const changeHandler = (e) => {
		const { name, value } = e?.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const onCreate = async () => {
		const componentsToSend = [
			{
				type: 'BODY',
				text: formState?.templateBody,
			},
		];
		if (buttons.length > 0) {
			const buttonsToSend = [];
			for (let button of buttons) {
				if (button?.type === 'URL')
					buttonsToSend.push({
						type: 'URL',
						text: button?.text,
						url: button?.url,
						utms: button?.utms,
					});
				else
					buttonsToSend.push({
						type: 'QUICK_REPLY',
						text: button?.text,
					});
			}
			componentsToSend.push({
				type: 'BUTTONS',
				buttons: buttonsToSend,
			});
		}

		const formData = new FormData();
		formData.append('name', formState?.templateName);
		formData.append('language', formState?.templateLanguage);
		formData.append('category', 'MARKETING');
		formData.append('flow', formState?.flow);
		formData.append('components', JSON.stringify(componentsToSend));
		formData.append('templateImage', formState?.templateImage);

		await krispyAxios({
			method: 'POST',
			url: 'templates',
			headers: {
				'Content-Type': 'multipart/form-data',
			},
			body: formData,
			loadingStateSetter: setRestLoading,
			successMessage: 'Template submitted!',
			onSuccess: () => {
				dispatch(getAllTemplates());
				router.push('/settings/templates');
			},
			onError: () => {
				window.scrollTo(0, 0);
				setResError(true);
			},
		});
	};

	const openGuide = () => {
		window.open(
			'https://resilient-tv-a51.notion.site/Template-Creation-04cb1a5c41a445f8ba02dfe0fb51de50',
			'_blank'
		);
	};

	return (
		<SettingsLayout>
			<div ref={alertBannerRef} />
			<div>
				{resError && (
					<Alert
						severity='error'
						sx={{ background: '#ffede6', marginBottom: '20px' }}
						action={
							<Button
								color='inherit'
								size='small'
								onClick={openGuide}
							>
								View
							</Button>
						}
					>
						Seems like your template failed to post. Check out our guide on
						creating templates.
					</Alert>
				)}
				<Heading
					title={'Create a template'}
					subtitle={
						'This template will be posted on your Meta Business account. Meta will review your template within 48 hours. Once approved, you can use this in your flows and campaigns.'
					}
				/>
				<div className='row'>
					<div className='col-md-6'>
						<label className='input-label me-2'>Flow</label>
						<Input
							type='select'
							name='flow'
							options={TEMPLATE_FLOWS}
							value={formState.flow}
							onChange={changeHandler}
						/>
						<p className='input-subtitle'>
							The template can only be hooked with the selected flow. Each flow
							exposes specific variables to use in the template.
						</p>
					</div>
					<div className='col-md-6'>
						<label className='input-label'>Allowed Variables</label>
						<div style={{ paddingTop: 9, paddingBottom: 9 }}>
							{TEMPLATE_FLOWS.find(
								(flow) => flow?.value === formState.flow
							).variables.map((variable) => {
								return <code>{variable} </code>;
							})}
						</div>
						<p className='input-subtitle'>
							These are the variables that can be used with the selected flow. A
							variable can be used by wrapping it in curly braces; i.e. &nbsp;
							<code>{`{{variableName}}`}</code>
						</p>
					</div>
					<div className='col-md-6 mt-3'>
						<Input
							thin
							noMarginBottom
							label='Name'
							type='text'
							name='templateName'
							maxLength={512}
							value={formState?.templateName}
							onChange={changeHandler}
						/>
						<p className='input-subtitle'>
							The template name cannot exceed 512 characters and can only
							contain lower-case alphanumeric characters; e.g.
							christmas_campaign_2023_v1
						</p>
					</div>
					<div className='col-md-6 mt-3'>
						<label className='input-label me-2'>Language</label>
						<Input
							thin
							type='select'
							name='templateLanguage'
							options={TEMPLATE_LANGUAGES}
							value={formState.templateLanguage}
							onChange={changeHandler}
						/>
						<p className='input-subtitle'>
							This specifies the language of the template. One template can be
							posted with multiple languages.
						</p>
					</div>
					<div className='col-md-12 mt-3'>
						<FileUploader
							title={
								formState?.templateImage?.name ||
								'Drag your image here, or click to browse.'
							}
							label='Image'
							acceptedFileTypes={{
								'image/jpeg': ['.jpg', '.jpeg'],
								'image/png': ['.png'],
							}}
							maxFileSize={5000000}
							subtitle='Only .jpg, .jpeg or .png files allowed, upto 5MB.'
							onFileAdded={(file) =>
								setFormState({ ...formState, templateImage: file?.[0] })
							}
						/>
						<p className='input-subtitle'>
							This image is sent with the template on whatsapp. In case of
							SHOPIFY_ABANDONED_CHECKOUT flow, this image acts as a fallback
							image if the product image could not be resolved.
						</p>
					</div>
					<div className='col-md-12 mt-3'>
						<Input
							noMarginBottom
							label='Body'
							type='textarea'
							name='templateBody'
							maxLength={900}
							value={formState.templateBody}
							onChange={changeHandler}
							rows={5}
							maxRows={5}
						/>
						<p className='input-subtitle'>
							The template body is the textual content that is actually sent out
							to contacts on WhatsApp. It cannot exceed 900 characters.
						</p>
					</div>
					{formState.flow !== 'OPT_IN' && (
						<TemplateButtons
							buttons={buttons}
							setButtons={setButtons}
						/>
					)}
				</div>
				<Divider
					sx={{
						border: '1px solid #ECECEC',
						marginTop: '15px',
						marginBottom: '30px',
					}}
				/>
				<div className='row d-flex justify-content-end'>
					<div className='col-md-4'>
						<CustomButton
							label='Create Template'
							type='medium-purple'
							loading={resLoading}
							onClick={onCreate}
						/>
					</div>
				</div>
			</div>
		</SettingsLayout>
	);
};

export default CreateNewTemplate;
