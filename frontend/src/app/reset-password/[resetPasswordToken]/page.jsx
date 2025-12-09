'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import Heading from '../../../components/@generalComponents/Heading';
import Input from '../../../components/@generalComponents/Input';
import krispyAxios from '../../../utilities/krispyAxios';

const ResetPassword = ({ params }) => {
	const { resetPasswordToken } = params;
	const router = useRouter();

	const [resLoading, setResLoading] = useState(false);
	const [formState, setFormState] = useState({
		newPassword: '',
		confirmNewPassword: '',
	});

	const changeHandler = (event) => {
		const { name, value } = event?.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const resetPassword = async () => {
		await krispyAxios({
			method: 'POST',
			url: 'users/reset-password',
			body: {
				newPassword: formState.newPassword,
				resetPasswordToken,
			},
			auth: false,
			successMessage: 'Password reset succesfully!',
			loadingStateSetter: setResLoading,
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
					<div className='flex gap-2 flex-col w-full md:w-2/3 lg:w-1/3'>
						<Heading
							title={'Reset password'}
							subtitle={
								"Enter your new password and confirm it to update your Krispy account's password"
							}
						/>
						<Input
							thin
							name='newPassword'
							type='password'
							placeholder='New Password'
							value={formState.newPassword}
							onChange={changeHandler}
						/>
						<Input
							thin
							name='confirmNewPassword'
							type='password'
							placeholder='Confirm Password'
							value={formState.confirmNewPassword}
							onChange={changeHandler}
						/>
						<div className='mt-3'>
							<CustomButton
								type='medium-purple'
								label='Reset password'
								onClick={resetPassword}
								disabled={
									formState.newPassword !== formState.confirmNewPassword
								}
								loading={resLoading}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ResetPassword;
