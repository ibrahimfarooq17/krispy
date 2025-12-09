'use client';
import { Divider, LinearProgress, Slider, Tab, Tabs } from '@mui/material';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Masonry from 'react-responsive-masonry';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import Heading from '../../../components/@generalComponents/Heading';
import ProductContextMenu from '../../../components/Settings/BrandVoice/ProductContextMenu';
import SettingsLayout from '../../../layout/SettingsLayout';
import { getPreferences } from '../../../redux/actions/preference.actions';
import krispyAxios from '../../../utilities/krispyAxios';

const valueLabelFormat = (value) => `${value}%`;

const BrandVoice = () => {
	const dispatch = useDispatch();

	const [formState, setFormState] = useState();
	const [resLoading, setResLoading] = useState(false);
	const [currentTab, setCurrentTab] = useState('0');

	const preferences = useSelector(
		(state) => state.preferenceReducer.entityPreferences
	);
	const knowledgeBase = useSelector(
		(state) => state.knowledgeBaseReducer.knowledgeBase
	);

	useEffect(() => {
		if (preferences)
			setFormState({
				agentName: preferences?.agentName,
				initialMessage: preferences?.initialMessage,
				friendly: preferences?.brandVoice?.friendly,
				emojis: preferences?.brandVoice?.emojis,
				serious: preferences?.brandVoice?.serious,
				caring: preferences?.brandVoice?.caring,
			});
	}, [preferences]);

	const changeHandler = (event) => {
		const { name, value } = event.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const saveBrandVoice = async () => {
		await krispyAxios({
			method: 'PATCH',
			url: `preferences/update`,
			body: {
				brandVoice: {
					friendly: formState?.friendly,
					emojis: formState?.emojis,
					serious: formState?.serious,
					caring: formState?.caring,
				},
				agentName: formState?.agentName,
				initialMessage: formState?.initialMessage,
			},
			successMessage: 'Settings saved.',
			loadingStateSetter: setResLoading,
			onSuccess: () => {
				dispatch(getPreferences());
			},
		});
	};

	return (
		<SettingsLayout>
			<div className='flex flex-col text-slate-700'>
				<Heading
					title={'Brand voice and AI settings'}
					subtitle={'Set your brand voice and tweak the AI as needed'}
				/>
				<div className='mb-4'>
					<Tabs
						value={currentTab}
						onChange={(e, value) => setCurrentTab(value)}
						aria-label='basic tabs example'
					>
						<Tab
							label='Brand Voice'
							value='0'
						/>
						<Tab
							label='AI Settings'
							value='1'
						/>
					</Tabs>
				</div>

				{currentTab == '0' && (
					<div className='flex flex-col'>
						<p className='m-0'>
							Define your brand's voice, personality and customize it's
							characteristics.
						</p>
						{formState && Object.keys(formState).length !== 0 && (
							<div className='my-4 flex flex-col gap-2 !border border-slate-200 p-4 rounded-lg'>
								<div className='flex flex-col'>
									<div className='flex justify-between items-center text-sm text-slate-500 font-semibold'>
										<p className='m-0 '>Friendly</p>
										<span>{formState?.friendly}% </span>
									</div>
									<Slider
										name='friendly'
										color='secondary'
										defaultValue={formState.friendly}
										onChange={changeHandler}
										valueLabelDisplay='off'
										valueLabelFormat={valueLabelFormat}
									/>
								</div>

								<div className='flex flex-col'>
									<div className='flex justify-between items-center text-sm text-slate-500 font-semibold'>
										<p className='m-0 '>Emojis</p>
										<span>{formState?.emojis}% </span>
									</div>
									<Slider
										name='emojis'
										color='secondary'
										defaultValue={formState.emojis}
										onChange={changeHandler}
										valueLabelDisplay='off'
										valueLabelFormat={valueLabelFormat}
									/>
								</div>

								<div className='flex flex-col'>
									<div className='flex justify-between items-center text-sm text-slate-500 font-semibold'>
										<p className='m-0 '>Serious</p>
										<span>{formState?.serious}% </span>
									</div>
									<Slider
										name='serious'
										color='secondary'
										defaultValue={formState.serious}
										onChange={changeHandler}
										valueLabelDisplay='off'
										valueLabelFormat={valueLabelFormat}
									/>
								</div>

								<div className='flex flex-col'>
									<div className='flex justify-between items-center text-sm text-slate-500 font-semibold'>
										<p className='m-0 '>Caring</p>
										<span>{formState?.caring}% </span>
									</div>
									<Slider
										name='caring'
										color='secondary'
										defaultValue={formState.caring}
										onChange={changeHandler}
										valueLabelDisplay='off'
										valueLabelFormat={valueLabelFormat}
									/>
								</div>
							</div>
						)}
						<div className='w-fit ml-auto'>
							<CustomButton
								type='medium-purple'
								label='Save'
								onClick={saveBrandVoice}
								loading={resLoading}
							/>
						</div>
					</div>
				)}
				{currentTab == '1' && (
					<div className='flex flex-col'>
						<p>Manage all the data used to train your AI Agent.</p>
						{!knowledgeBase?.domain || knowledgeBase?.domain === '' ? (
							<div className='mb-3'>
								<h6 className='mb-3'>Shopify Store</h6>
								<div className='empty-chat-container'>
									<p className='empty-chat-text'>
										<Link
											href='/settings/connected-apps'
											style={{
												color: 'rgba(253, 79, 2, 0.9)',
												margin: '0 5px 0 5px',
												textDecoration: 'none',
											}}
										>
											Connect to shopify
										</Link>
										to train your AI agent on the shopify data.
									</p>
								</div>
							</div>
						) : (
							<>
								<p className='mb-1'>Shopify Store Info</p>
								<div className='flex !border border-slate-200 p-3 rounded-lg bg-slate-50'>
									<div className='flex-1 flex flex-col gap-2'>
										<div className='flex flex-col'>
											<span className='text-sm text-slate-500'>Domain</span>
											<span className='text-lg'>{knowledgeBase?.domain}</span>
										</div>
										<div className='flex flex-col'>
											<span className='text-sm text-slate-500'>Email</span>
											<span className='text-lg'>{knowledgeBase?.email}</span>
										</div>
										<div className='flex flex-col'>
											<span className='text-sm text-slate-500'>Phone</span>
											<span className='text-lg'>{knowledgeBase?.phone}</span>
										</div>
									</div>
									<div className='flex-1'>
										<div className='flex flex-col'>
											<span className='text-sm text-slate-500'>City, Zip</span>
											<span className='text-lg'>
												{knowledgeBase?.city}, {knowledgeBase?.zip}
											</span>
										</div>
										<div className='flex flex-col'>
											<span className='text-sm text-slate-500'>Address</span>
											<span className='text-lg'>{knowledgeBase?.address}</span>
										</div>
										<div className='flex flex-col'>
											<span className='text-sm text-slate-500'>Currency</span>
											<span className='text-lg'>{knowledgeBase?.currency}</span>
										</div>
									</div>
								</div>
								<div className='my-3'>
									<p className='mb-1'>Shopify Products</p>
									{knowledgeBase?.shopifyProduct?.completion < 100 ? (
										<React.Fragment>
											<LinearProgress
												variant='determinate'
												value={knowledgeBase?.shopifyProduct?.completion}
											/>
											<p className='settings-subtext text-end'>
												Embedding in progress...
											</p>
										</React.Fragment>
									) : (
										<Masonry columnsCount={3}>
											{knowledgeBase?.shopifyProduct?.embeddedList?.map(
												(product) => {
													return (
														<div className='m-2'>
															<img
																style={{ borderRadius: '5px', width: '100%' }}
																src={product?.image_url}
																alt='Product image'
															/>
															<div className='ml-2 mt-2 flex justify-between'>
																<h6 className='flex items-center mb-0'>
																	{product?.product_name}
																</h6>
																<ProductContextMenu product={product} />
															</div>
														</div>
													);
												}
											)}
										</Masonry>
									)}
								</div>
							</>
						)}
					</div>
				)}
			</div>
		</SettingsLayout>
	);
};

export default BrandVoice;
