'use client';
import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import Heading from '../../../components/@generalComponents/Heading';
import Input from '../../../components/@generalComponents/Input';
import { getPreferences } from '../../../redux/actions/preference.actions';
import { getCurrentUser } from '../../../redux/actions/user.actions';
import krispyAxios from '../../../utilities/krispyAxios';

const AdminLogin = () => {
	const router = useRouter();
	const theme = useTheme();
	const dispatch = useDispatch();
	const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

	const [formState, setFormState] = useState();
	const [allEntities, setAllEntities] = useState();

	useEffect(() => {
		getAllEntities();
	}, []);

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [formState]);

	const getAllEntities = async () => {
		const { entities } = await krispyAxios({
			method: 'GET',
			url: 'entities',
			auth: false,
		});
		setAllEntities(entities);
	};

	const handleKeyDown = (event) => {
		const { keyCode } = event;
		if (keyCode == 13) logInUser();
		return;
	};

	const changeHandler = (event) => {
		const { name, value } = event?.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const logInUser = async () => {
		const { accessToken } = await krispyAxios({
			method: 'POST',
			url: 'users/admin/log-in',
			body: {
				...formState,
			},
			auth: false,
			loadingMessage: 'Logging in...',
			successMessage: `Welcome!`,
		});
		if (!accessToken) return;
		localStorage.setItem('accessToken', accessToken);
		dispatch(getCurrentUser());
		dispatch(getPreferences());
		router.push('/dashboard/home');
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
				<div className='flex w-full justify-center'>
					<div className='flex flex-col w-full md:w-2/3 lg:w-1/3'>
						<Heading
							title={'Admin login'}
							subtitle={'Enter the credentials to access your account'}
						/>
						<label className='font-medium text-slate-500 mb-1'>Business</label>
						<Input
							thin
							name='entityId'
							type='select'
							options={allEntities?.map((entity) => {
								return {
									label: entity?.name,
									value: entity?.entityId,
								};
							})}
							value={formState?.entityId}
							onChange={changeHandler}
						/>
						<label className='font-medium text-slate-500 mb-1'>Email</label>
						<Input
							thin
							placeholder='johndoe@gmail.com'
							name='email'
							value={formState?.email}
							onChange={changeHandler}
						/>
						<label className='font-medium text-slate-500 mb-1'>Password</label>
						<Input
							thin
							type='password'
							name='password'
							value={formState?.password}
							onChange={changeHandler}
						/>
						<div className='mt-4'>
							<CustomButton
								type='medium-purple'
								label='Login'
								onClick={logInUser}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminLogin;
