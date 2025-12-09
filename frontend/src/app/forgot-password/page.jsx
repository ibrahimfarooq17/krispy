'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import CustomButton from '../../components/@generalComponents/CustomButton';
import Heading from '../../components/@generalComponents/Heading';
import Input from '../../components/@generalComponents/Input';
import krispyAxios from '../../utilities/krispyAxios';

const ForgotPassword = () => {
	const router = useRouter();

	const [email, setEmail] = useState('');
	const [resLoading, setResLoading] = useState(false);

	const sendLink = async () => {
		await krispyAxios({
			method: 'POST',
			url: `users/forgot-password`,
			body: {
				email: email,
			},
			auth: false,
			loadingStateSetter: setResLoading,
			successMessage: 'Reset password link sent!',
			onSuccess: () => router.push('/login'),
		});
	};

	return (
		<div className='p-8 h-screen text-slate-700'>
			<div className='flex flex-col gap-8 md:gap-16 justify-center items-center h-full'>
				<div>
					<img
						src='/images/logo-main.png'
						width={160}
						height='auto'
						alt='Krispy logo'
					/>
				</div>
				<div className='flex w-full justify-center'>
					<div className='flex flex-col w-full md:w-2/3 lg:w-1/3'>
						<Heading
							title={'Forgot password'}
							subtitle={
								'Enter the email address that you used to register. You will receive an email with instructions to reset your password.'
							}
						/>
						<Input
							thin
							placeholder='john@example.com'
							value={email}
							onChange={(e) => setEmail(e?.target?.value)}
						/>
						<div className='mb-4'>
							<CustomButton
								type='medium-purple'
								label='Send email'
								loading={resLoading}
								onClick={sendLink}
							/>
						</div>
						<p className='text-xs text-slate-500 m-0'>
							Note: If you don’t see your reset email, be sure to check your
							spam inbox for an email from “contact@krispy.ai”
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
