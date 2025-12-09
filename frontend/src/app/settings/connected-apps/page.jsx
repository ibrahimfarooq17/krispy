'use client';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomChip from '../../../components/@generalComponents/CustomChip';
import Heading from '../../../components/@generalComponents/Heading';
import Loader from '../../../components/@generalComponents/Loader';
import SettingsLayout from '../../../layout/SettingsLayout';
import { getAllConnectors } from '../../../redux/actions/connector.actions';
import {
	connectKlaviyoModal,
	connectShopifyModal,
} from '../../../redux/actions/modal.actions';
import krispyAxios from '../../../utilities/krispyAxios';

const ConnectedApps = () => {
	const dispatch = useDispatch();
	const router = useRouter();

	const connectors = useSelector(
		(state) => state.connectorReducer.allConnectors
	);

	const connectShopify = () => {
		dispatch(connectShopifyModal({ isOpen: true }));
	};

	const connectKlaviyo = () => {
		dispatch(connectKlaviyoModal({ isOpen: true }));
	};

	const openShopifyConnector = () => {
		router.push('/settings/ai-settings');
	};

	const onShopifyIconClick = async (e) => {
		if (e?.detail != 3) return;
		await krispyAxios({
			method: 'DELETE',
			url: `connectors/shopify`,
			loadingMessage: 'Disconnecting shopify...',
			successMessage: 'Shopify disconnected.',
			onSuccess: () => dispatch(getAllConnectors()),
		});
	};

	return (
		<SettingsLayout>
			<Loader renderChildren={connectors}>
				<div className='flex flex-row'>
					<div className='w-full'>
						<Heading
							title={'Connected apps'}
							subtitle={'Connect popular apps to your Krispy account'}
						/>

						{/* <p className=''>2 integrations</p> */}
						<div className='grid grid-cols-2 gap-4'>
							<div className='connector-container'>
								<div className='flex items-center justify-between mb-3'>
									<img
										src='/images/shopify-logo.svg'
										onClick={onShopifyIconClick}
										alt='Shopify logo'
									/>
									{connectors?.find(
										(connector) => connector?.name === 'shopify'
									) ? (
										<div className='flex items-center gap-2'>
											<div className='rounded-full !border'>
												<IconButton
													size='small'
													onClick={openShopifyConnector}
												>
													<img
														src='/images/setting.svg'
														alt='Settings icon'
													/>
												</IconButton>
											</div>
											<CustomChip
												label='Connected'
												type='green'
											/>
										</div>
									) : (
										<CustomChip
											label='Connect'
											type='orange'
											onClick={connectShopify}
										/>
									)}
								</div>
								<div className='d-flex'>
									<p className='f-sm-regular mb-1 me-2'>Shopify</p>
								</div>
								<p className='f-sm-regular grey mb-0'>
									Import all your historical data from Shopify
								</p>
							</div>
							<div className='connector-container'>
								<div className='flex items-center justify-between mb-3'>
									<img
										src='/images/klaviyo-logo.png'
										style={{
											width: '46px',
											height: '36px',
										}}
										alt='Klaviyo logo'
									/>
									{connectors?.find(
										(connector) => connector?.name === 'klaviyo'
									) ? (
										<CustomChip
											label='Connected'
											type='green'
										/>
									) : (
										<CustomChip
											label='Connect'
											type='orange'
											onClick={connectKlaviyo}
										/>
									)}
								</div>
								<div className='d-flex'>
									<p className='f-sm-regular mb-1 me-2'>Klaviyo</p>
									<CustomChip
										label='New'
										type='purple'
									/>
								</div>
								<p className='f-sm-regular grey mb-0'>
									Sync your flows and contacts with Klaviyo
								</p>
							</div>
						</div>
					</div>
				</div>
			</Loader>
		</SettingsLayout>
	);
};

export default ConnectedApps;
