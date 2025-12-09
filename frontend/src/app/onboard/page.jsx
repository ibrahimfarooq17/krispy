'use client';
import { ConnectButton } from '360dialog-connect-button';
import { Button, Step, StepLabel, Stepper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomButton from '../../components/@generalComponents/CustomButton';
import Input from '../../components/@generalComponents/Input';
import Loader from '../../components/@generalComponents/Loader';
import MainLayout from '../../layout/MainLayout';
import { connectShopifyModal } from '../../redux/actions/modal.actions';
import { getPreferences } from '../../redux/actions/preference.actions';
import krispyAxios from '../../utilities/krispyAxios';

const theme = createTheme({
	palette: {
		blue: {
			light: '#eff1ff',
			main: '#009be5',
			dark: '#006db3',
			contrastText: '#fff',
		},
		'light-blue': {
			light: '#eff1ff',
			main: '#DEE4FF',
			dark: '#cfd7fc',
			contrastText: '#5C78FF',
		},
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

const Onboard = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const PARTNER_ID = 'Zae1VZPA';

	const [formState, setFormState] = useState();
	const [resLoading, setResLoading] = useState(false);
	const [connectManually, setConnectManually] = useState(false);
	const [channelId, setChannelId] = useState('');
	const [currentStep, setCurrentStep] = useState(0);

	const currentUser = useSelector((state) => state.userReducer.currentUser);
	const preferences = useSelector(
		(state) => state.preferenceReducer.entityPreferences
	);
	const connectors = useSelector(
		(state) => state.connectorReducer.allConnectors
	);

	// ! REDIRECT to dashboard
	useEffect(() => {
		if (preferences?.onboardingStep >= 1) {
			router.push('/dashboard/home');
		}
	}, [preferences, router]);

	const changeHandler = (event) => {
		const { name, value } = event?.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const connectShopify = () => {
		dispatch(connectShopifyModal({ isOpen: true }));
	};

	const onContinue = async () => {
		await krispyAxios({
			method: 'PATCH',
			url: `preferences/update`,
			body: {
				onboardingStep: 1,
			},
			loadingStateSetter: setResLoading,
			onSuccess: () => {
				dispatch(getPreferences());
			},
		});
	};

	const handleCallback = async (callbackObject) => {
		console.log('client ID: ' + callbackObject?.client);
		console.log('channel IDs: ' + callbackObject?.channels);
		localStorage.setItem('tempD360', JSON.stringify(callbackObject?.channels));
		await krispyAxios({
			method: 'POST',
			url: `chats/connect-meta-chat`,
			body: {
				channelId: Array.isArray(callbackObject?.channels)
					? callbackObject?.channels?.[0]
					: callbackObject?.channels,
			},
			loadingMessage: 'Please wait while we make the connection...',
			successMessage: 'Phone number connected successfully!',
			onSuccess: onContinue,
		});
	};

	const manualConnection = async () => {
		await krispyAxios({
			method: 'POST',
			url: `chats/connect-meta-chat`,
			body: {
				partnerId: PARTNER_ID,
				channelId,
			},
			loadingStateSetter: setResLoading,
			successMessage: 'Connection successful!',
			onSuccess: onContinue,
		});
	};

	const skipOnboarding = () => {
		router.push('/dashboard/home');
	};

	const steps = [
		'Connect Store',
		'Connect Meta Business',
		'Knowledge Base Setup',
	];

	const handleStep = (value) => {
		setCurrentStep(value);
	};

	const saveKnowledgeBase = async () => {
		setResLoading(true);
		const { error } = await krispyAxios({
			method: 'PATCH',
			url: `knowledge-bases`,
			body: {
				aiName: formState?.aiAgentName,
				systemPrompt: formState.systemPrompt,
				additionalInfo: formState?.additionalInfo,
			},
			loadingMessage: 'Saving changes...',
		});
		if (!error) {
			await krispyAxios({
				method: 'PATCH',
				url: `preferences/update`,
				body: {
					onboardingStep: 1,
				},
				onSuccess: () => {
					dispatch(getPreferences());
					router.push('/dashboard/home');
				},
			});
		}
		setResLoading(false);
	};

	return (
		<MainLayout>
			<ThemeProvider theme={theme}>
				<Loader renderChildren={currentUser}>
					<div className='container px-4 pt-5'>
						<Stepper
							activeStep={currentStep}
							alternativeLabel
						>
							{steps.map((label) => (
								<Step key={label}>
									<StepLabel>{label}</StepLabel>
								</Step>
							))}
						</Stepper>
						{currentStep === 0 && (
							<div className='w-full flex flex-col mt-10'>
								{/* <h4 className='font-inter'>About Us</h4>
                <Input
                  label=''
                  type='textarea'
                /> */}
								<div>
									<h4 className='text-slate-900 mt-5 font-inter'>
										3 Integrations
									</h4>
								</div>
								<hr />
								<div className='w-full min-[768px]:grid-cols-3 min-[500px]:grid-cols-2 grid grid-cols-1 justify-center gap-3 mt-3'>
									<div className='col-span-1 max-w-xs w-full border-2 border-[#DBDBDB] rounded-lg p-3'>
										<div className='flex items-center gap-2'>
											<img
												width={48}
												height={48}
												src='/images/shopify.svg'
												alt='Shopify logo'
											/>
											<span className='font-medium text-xl font-inter'>
												Shopify
											</span>
											<div className='bg-light-blue cursor-pointer px-2 p-1 rounded text-blue font-medium font-inter ml-2'>
												New
											</div>
										</div>
										<p className='font-inter text-sm my-3'>
											Import all your historical data from shopify
										</p>
										<div className='flex justify-end'>
											{connectors?.find(
												(connector) => connector?.name === 'shopify'
											) ? (
												<Button
													variant='contained'
													color='blue'
												>
													Connected
												</Button>
											) : (
												<Button
													variant='contained'
													color='light-blue'
													onClick={connectShopify}
												>
													Connect
												</Button>
											)}
										</div>
									</div>
									<div className='col-span-1 max-w-xs w-full border-2 border-[#DBDBDB] rounded-lg p-3'>
										<div className='flex items-center gap-2'>
											<img
												width={48}
												height={48}
												src='/images/gorgias.svg'
												alt='Gorgias logo'
											/>
											<span className='font-medium text-xl font-inter'>
												Gorgias
											</span>
										</div>
										<p className='font-inter text-sm my-3'>
											Import all your historical data from Gorgias
										</p>
										<div className='flex justify-end'>
											<Button
												disabled
												variant='contained'
												color='light-blue'
											>
												Coming Soon
											</Button>
										</div>
									</div>
									<div className='col-span-1 max-w-xs w-full border-2 border-[#DBDBDB] rounded-lg p-3'>
										<div className='flex items-center gap-2'>
											<img
												width={48}
												height={48}
												src='/images/slack.svg'
												alt='Slack logo'
											/>
											<span className='font-medium text-xl font-inter'>
												Slack
											</span>
										</div>
										<p className='font-inter text-sm my-3'>
											Import all your historical data from Slack
										</p>
										<div className='flex justify-end'>
											<Button
												disabled
												className='text-blue'
												variant='contained'
												color='light-blue'
											>
												Coming Soon
											</Button>
										</div>
									</div>
								</div>
								<div className='flex justify-end gap-3 mt-5'>
									<Button
										onClick={() => handleStep(1)}
										variant='contained'
										color='orange'
									>
										Next
									</Button>
								</div>
							</div>
						)}
						{currentStep === 1 && (
							<div className='row flex flex-col justify-content-center items-center mt-2'>
								<div className='col-md-6 pt-4'>
									<div className='onboard-card'>
										<h2>Let's get you connected!</h2>
										<p className='f-reg'>
											We'll get your Meta business account connected to your new
											number. This does not affect any other numbers you have
											hooked with your business account.
										</p>
										{connectManually && (
											<Input
												label='Channel ID'
												thin
												value={channelId}
												onChange={(e) => setChannelId(e?.target?.value)}
											/>
										)}
										{connectManually ? (
											<CustomButton
												label='Connect Manually'
												type='medium-purple'
												onClick={manualConnection}
												loading={resLoading}
											/>
										) : (
											<ConnectButton
												className='d360-connect-btn'
												label='Connect'
												partnerId={PARTNER_ID}
												callback={handleCallback}
											/>
										)}
										<div className='mt-2'>
											<CustomButton
												label='Skip onboarding for now'
												type='medium-grey'
												onClick={skipOnboarding}
											/>
										</div>
										<p
											className='f-reg text-end mb-0 mt-2'
											onClick={() => setConnectManually(!connectManually)}
											style={{
												color: '#10324F',
												marginLeft: '3px',
												textDecoration: 'underline',
												cursor: 'pointer',
											}}
										>
											{!connectManually
												? 'Not redirected here after completion?'
												: 'Go back'}
										</p>
									</div>
								</div>
								<div className='flex justify-end gap-3 mt-5'>
									<Button
										onClick={() => handleStep(0)}
										variant='contained'
										color='light-orange'
									>
										Previous
									</Button>
									<Button
										onClick={() => handleStep(2)}
										variant='contained'
										color='orange'
									>
										Next
									</Button>
								</div>
							</div>
						)}
						{currentStep === 2 && (
							<div className='w-full flex flex-col mt-10'>
								<h4 className='font-inter'>AI Agent Name</h4>
								<Input
									name='aiAgentName'
									type='text'
									value={formState?.aiAgentName}
									onChange={changeHandler}
								/>
								<h4 className='font-inter'>System Prompt</h4>
								<Input
									name='systemPrompt'
									type='textarea'
									rows={3}
									maxRows={3}
									value={formState?.systemPrompt}
									onChange={changeHandler}
								/>
								<h4 className='font-inter'>Additional Info</h4>
								<Input
									name='additionalInfo'
									type='textarea'
									rows={3}
									maxRows={3}
									value={formState?.additionalInfo}
									onChange={changeHandler}
								/>
								<div className='flex justify-end gap-3 mt-2'>
									<Button
										onClick={() => handleStep(1)}
										variant='contained'
										color='light-orange'
									>
										Previous
									</Button>
									<Button
										disabled={resLoading}
										onClick={saveKnowledgeBase}
										variant='contained'
										color='orange'
									>
										Continue
									</Button>
								</div>
							</div>
						)}
					</div>
				</Loader>
			</ThemeProvider>
		</MainLayout>
	);
};

export default Onboard;
