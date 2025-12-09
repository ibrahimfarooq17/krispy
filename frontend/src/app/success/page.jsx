'use client';
import { Alert, AlertTitle } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import CustomButton from '../../components/@generalComponents/CustomButton';

const Success = ({ params }) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [content, setContent] = useState({ title: '', msg: '' });

	const action = searchParams.get('action');
	const redirectUri = searchParams.get('redirectUri');

	useEffect(() => {
		if (!action) return;
		else if (action == 'subscription')
			setContent({
				title: 'Subscription successful!',
				msg: 'Thank you for subscribing to Krispy.',
			});
	}, [action]);

	const onContinue = () => {
		if (redirectUri) window.location.href = redirectUri;
		else router.push(`/dashboard/home`);
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
							<Alert
								sx={{ width: '100%' }}
								severity='success'
							>
								<AlertTitle>{content.title}</AlertTitle>
								{content.msg}
							</Alert>
						</div>
						<CustomButton
							type='medium-purple'
							label='Continue'
							onClick={onContinue}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Success;
