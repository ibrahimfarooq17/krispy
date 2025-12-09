'use client';
import { Alert, LinearProgress } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import krispyAxios from '../../../utilities/krispyAxios';

const EmailVerification = ({ params }) => {
	const { emailVerificationToken } = params;
	const router = useRouter();
	const searchParams = useSearchParams();
	const storeUri = searchParams.get('storeUri');
	const entityId = searchParams.get('entityId');

	const [responseState, setResponseState] = useState({
		loading: true,
		success: false,
		error: false,
		msg: 'Stay with this while we verify your email.',
	});

	useEffect(() => {
		if (emailVerificationToken) {
			setTimeout(verifyEmail, 1500);
		}
	}, [emailVerificationToken]);

	const verifyEmail = async () => {
		const { errorData } = await krispyAxios({
			method: 'POST',
			url: 'users/verify-email',
			body: {
				emailVerificationToken: emailVerificationToken,
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
				msg: 'Email successfully verified!',
			});
	};

	// * Once email verified -
	const onContinue = () => {
		if (!storeUri || !entityId) router.push('/login');
		else
			router.push(`/connect/shopify?storeUri=${storeUri}&entityId=${entityId}`);
	};

	return (
		<div className='container'>
			<div
				style={{
					position: 'absolute',
					left: '120px',
					top: '50px',
				}}
			>
				<img
					src='/images/logo-main.png'
					width='15%'
					alt='Krispy logo'
				/>
			</div>
			<div className='row d-flex justify-content-center align-items-center vh-100'>
				<div className='col-md-5 pt-4'>
					<div className='onboard-card'>
						<div className='d-flex justify-content-center mb-5'>
							<img
								src='/images/shield.png'
								width={100}
								alt='Shield icon'
							/>
						</div>
						<div className='mb-5'>
							{responseState.loading ? (
								<React.Fragment>
									<div className='d-flex justify-content-center mb-2'>
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
										Verifying your email account...
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
		</div>
	);
};

export default EmailVerification;
