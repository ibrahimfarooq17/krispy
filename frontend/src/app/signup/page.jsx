'use client';
import { MailOutline } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomButton from '../../components/@generalComponents/CustomButton';
import Input from '../../components/@generalComponents/Input';
import krispyAxios from '../../utilities/krispyAxios';
import './style.css';

const SignUp = () => {
	const theme = useTheme();
	const router = useRouter();
	const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));
	const searchParams = useSearchParams();
	const storeUri = searchParams.get('storeUri');

	const [formState, setFormState] = useState();
	const [resLoading, setResLoading] = useState(false);

	const changeHandler = (event) => {
		const { name, value } = event?.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const signUpUser = async () => {
		const { error } = await krispyAxios({
			method: 'POST',
			url: `users/sign-up${storeUri ? `?storeUri=${storeUri}` : ''}`,
			body: {
				...formState,
			},
			auth: false,
			successMessage: `Email verification link has been sent! Please verify that to continue.`,
			loadingStateSetter: setResLoading,
		});
		if (error) return;
		setTimeout(() => router.push('/login'), 1000);
	};

	return (
		<div className='container-fluid'>
			<div className='row'>
				<div className='col-md-6  d-flex align-items-center'>
					<div
						className='d-flex justify-content-center bg-[#FFFFFF] ml-5 mt-3'
						style={{ borderRadius: '10px', padding: '10px 10px 10px 10px' }}
					>
						<div
							style={{
								width: isMediumScreen ? '100%' : '80%',
							}}
						>
							<div className='text-center flex flex-col  items-center'>
								<img
									src='/images/logo-main.png'
									className='mt-4'
									width={200}
									height={45}
									alt='Krispy logo'
								/>
								<h2 className='mt-5'>Sign up</h2>
								<p className='f-reg'>Let's set up your account!</p>
							</div>
							<div className='row'>
								<div className='col-md-12'>
									<Input
										thin
										label='First Name'
										placeholder='John'
										name='firstName'
										value={formState?.firstName}
										onChange={changeHandler}
										inputAdornment={
											<img
												src='images/user.svg'
												alt='User icon'
											/>
										}
									/>
								</div>
								<div className='col-md-12'>
									<Input
										thin
										label='Last Name'
										placeholder='Doe'
										name='lastName'
										value={formState?.lastName}
										onChange={changeHandler}
										inputAdornment={
											<img
												src='images/user.svg'
												alt='User icon'
											/>
										}
									/>
								</div>
							</div>
							<Input
								thin
								label='Business Name'
								placeholder='Amazon'
								name='businessName'
								value={formState?.businessName}
								onChange={changeHandler}
								inputAdornment={
									<img
										src='images/building-office.svg'
										alt='Building icon'
									/>
								}
							/>
							<Input
								thin
								label='Email'
								placeholder='johndoe@gmail.com'
								name='email'
								value={formState?.email}
								onChange={changeHandler}
								inputAdornment={<MailOutline />}
							/>
							<Input
								thin
								label='Password'
								type='password'
								name='password'
								value={formState?.password}
								onChange={changeHandler}
							/>
							<CustomButton
								type='medium-purple'
								label='Sign up'
								onClick={signUpUser}
								loading={resLoading}
							/>
							<p
								className='text-center'
								style={{
									fontSize: '14px',
									fontWeight: '400',
									lineHeight: '20px',
									letterSpacing: '0em',
									marginBottom: 0,
									marginTop: '15px',
								}}
							>
								Already have an account?
								<Link
									href='/login'
									style={{
										color: 'rgba(253, 79, 2, 0.9)',
										textDecoration: 'none',
										marginLeft: '3px',
									}}
								>
									Login now.
								</Link>
							</p>
						</div>
					</div>
				</div>
				<div className='col-md-6 d-none d-md-flex justify-content-center align-items-center'>
					<img
						style={{ maxHeight: '75vh' }}
						src='/images/sign-up-graphic.svg'
					/>
				</div>
			</div>
		</div>
	);
};

export default SignUp;
