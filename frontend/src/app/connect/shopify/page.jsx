'use client';
import { Alert, LinearProgress } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import krispyAxios from '../../../utilities/krispyAxios';

const ConnectShopify = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const storeUri = searchParams.get('storeUri');
	const entityId = searchParams.get('entityId');

	const [responseState, setResponseState] = useState({
		loading: true,
		success: false,
		error: false,
		msg: 'Stay with this while we connect your Shopify account with Krispy.',
	});

	useEffect(() => {
		if (!storeUri || !entityId) {
			setResponseState({
				...responseState,
				loading: false,
				error: true,
				msg: 'Seems like you are missing some info.',
			});
			return;
		}
		connectShopifyAcc();
	}, [storeUri]);

	const connectShopifyAcc = async () => {
		const { errorData } = await krispyAxios({
			method: 'POST',
			url: 'connectors/shopify/connect-public',
			body: {
				entityId: entityId,
				storeUri: storeUri,
			},
			auth: false,
		});
		if (errorData)
			setResponseState({
				loading: false,
				success: false,
				error: true,
				msg: 'Looks like something went wrong.',
			});
		else
			setResponseState({
				loading: false,
				success: true,
				error: false,
				msg: 'Shopify connected successfully.',
			});
	};

	const onContinue = () => {
		const accessToken = localStorage.getItem('accessToken');
		if (!accessToken) router.push('/login');
		else router.push('/dashboard/home');
	};

	return (
		<div className='p-8 h-screen text-slate-700'>
			<div className='flex flex-col gap-8 md:gap-24 justify-center items-center h-full'>
				<div>
					<img
						src='/images/logo-main.png'
						width={160}
						height='auto'
						alt='Krispy logo'
					/>
				</div>
				<div className='!border border-slate-200 p-4 rounded-lg !shadow-sm !shadow-slate-200 flex flex-col gap-4 items-center'>
					<img
						src='/images/shopify-logo.svg'
						width={80}
						alt='Shopify logo'
					/>
					<div>
						{responseState.loading ? (
							<React.Fragment>
								<div className='flex flex-col justify-center mb-2'>
									<LinearProgress
										sx={{
											color: 'rgba(253, 79, 2, 0.9)',
											width: '100% !important',
										}}
									/>
								</div>
								<p
									className='f-reg grey text-center'
									style={{ fontSize: '12px' }}
								>
									Connecting your Shopify store to Krispy...
								</p>
							</React.Fragment>
						) : (
							<Alert
								sx={{ width: '100%' }}
								severity={responseState.error ? 'error' : 'success'}
							>
								{responseState.msg}
							</Alert>
						)}
					</div>
					<CustomButton
						type='medium-purple'
						label='Continue'
						disabled={!responseState.success}
						onClick={onContinue}
					/>
				</div>
			</div>
		</div>
	);
};

export default ConnectShopify;
