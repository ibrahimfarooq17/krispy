'use client';
import { Switch, Tab, Tabs, ThemeProvider, createTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import Heading from '../../../components/@generalComponents/Heading';
import Input from '../../../components/@generalComponents/Input';
import QrCodes from '../../../components/Settings/Hub/QrCodes';
import Utms from '../../../components/Settings/Hub/Utms';
import SettingsLayout from '../../../layout/SettingsLayout';
import { qrCodeModal } from '../../../redux/actions/modal.actions';
import krispyAxios from '../../../utilities/krispyAxios';

const theme = createTheme({
	palette: {
		orange: {
			light: '#eff1ff',
			main: '#FD4F02',
			dark: '#fd601b',
			contrastText: '#fff',
		},
		'light-orange': {
			light: '#eff1ff',
			main: '#FFEDE6',
			dark: '#ffe2d8',
			contrastText: '#fd601b',
		},
	},
});

const HubSettings = () => {
	const dispatch = useDispatch();

	const [aiActive, setAiActive] = useState();
	const [currentTab, setCurrentTab] = useState('0');
	const [optOutReplyMessage, setOptOutReplyMessage] = useState();

	const preferences = useSelector(
		(state) => state.preferenceReducer.entityPreferences
	);

	useEffect(() => {
		if (!preferences) return;
		setAiActive(preferences?.aiActive);
		setOptOutReplyMessage(preferences?.optOutReplyMessage);
	}, [preferences]);

	const onAiActiveChange = async (e) => {
		const value = e?.target?.checked;
		setAiActive(value);
		await krispyAxios({
			method: 'PATCH',
			url: `preferences/update`,
			body: {
				aiActive: value,
			},
			loadingMessage: 'Saving change...',
			successMessage: 'Changes saved!',
		});
	};

	const onOptOutMsgSave = async () => {
		await krispyAxios({
			method: 'PATCH',
			url: `preferences/update`,
			body: {
				optOutReplyMessage: optOutReplyMessage,
			},
			loadingMessage: 'Saving changes...',
			successMessage: 'Changes saved!',
		});
	};

	const openQrModal = () => {
		dispatch(
			qrCodeModal({
				isOpen: true,
			})
		);
	};

	return (
		<ThemeProvider theme={theme}>
			<SettingsLayout>
				<div className='flex flex-col'>
					<Heading
						title={'Hub'}
						subtitle={'Manage your Shopify key, UTMS, QR codes'}
					/>
					<div className='mb-4'>
						<Tabs
							textColor='red'
							value={currentTab}
							onChange={(e, value) => setCurrentTab(value)}
						>
							<Tab
								label='Hub'
								className='text-[#7C7C7C]'
								value='0'
							/>
							<Tab
								label='QR Codes'
								className='text-[#7C7C7C]'
								value='1'
							/>
						</Tabs>
					</div>

					{currentTab === '0' && (
						<div className='flex flex-col gap-4 text-slate-700'>
							<div className='flex gap-4'>
								<div className='flex-1 flex flex-col !border border-slate-200 rounded-lg p-3'>
									<div className='flex justify-between items-center'>
										<span className='font-medium'>AI Agent</span>
										<Switch
											checked={aiActive}
											color='warning'
											onChange={onAiActiveChange}
										/>
									</div>
									<p className='m-0 text-sm text-slate-500'>
										When enabled, your AI Agent will respond to all inbound
										messages sent by your customers to your business WhatsApp
										number.
									</p>
								</div>
								<div className='flex-1 flex flex-col !border border-slate-200 rounded-lg p-3'>
									<label className='font-medium mb-2'>
										Shopify connector key
									</label>
									<Input
										thin
										value={preferences?.shopifyConnectorKey}
										type='password'
										copyToClipboard
									/>
								</div>
							</div>

							<div className='flex-1 flex flex-col !border border-slate-200 rounded-lg p-3'>
								<span className='font-medium'>Marketing opt-out message</span>
								<span className='text-sm font-medium text-slate-500 mb-2'>
									This message will be sent to the user when they opt-out of the
									marketing message from the brand.
								</span>
								<div className='flex items-center'>
									<Input
										type='textarea'
										value={optOutReplyMessage}
										onChange={(e) => setOptOutReplyMessage(e?.target?.value)}
									/>
									<div className='w-fit ml-4'>
										<CustomButton
											type='medium-purple'
											label='Save'
											onClick={onOptOutMsgSave}
										/>
									</div>
								</div>
							</div>
							<Utms />
						</div>
					)}

					{currentTab === '1' && (
						<>
							<button
								onClick={openQrModal}
								className='mb-3 !border border-slate-200 mx-auto flex gap-2 justify-center items-center p-2 rounded-md bg-slate-50 hover:bg-slate-200 ease-in-out duration-150'
							>
								<img
									src='/images/add-icon.svg'
									alt='Add icon'
								/>
								<span className='text-sm'>Add new QR code</span>
							</button>
							<QrCodes />
						</>
					)}
				</div>
			</SettingsLayout>
		</ThemeProvider>
	);
};

export default HubSettings;
