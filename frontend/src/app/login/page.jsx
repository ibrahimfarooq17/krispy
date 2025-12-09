'use client';
import { MailOutlineOutlined, Password } from '@mui/icons-material';
import moment from 'moment';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomButton from '../../components/@generalComponents/CustomButton';
import Heading from '../../components/@generalComponents/Heading';
import Input from '../../components/@generalComponents/Input';
import { getKnowledgeBase } from '../../redux/actions/knowledgeBase.actions';
import { getPreferences } from '../../redux/actions/preference.actions';
import { getCurrentUser } from '../../redux/actions/user.actions';
import krispyAxios from '../../utilities/krispyAxios';

const Login = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const searchParams = useSearchParams();
	const storeUri = searchParams.get('storeUri');

	const [formState, setFormState] = useState();

	useEffect(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	}, [formState]);

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
		const { accessToken, user } = await krispyAxios({
			method: 'POST',
			url: 'users/log-in',
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
		dispatch(getKnowledgeBase());
		if (storeUri)
			router.push(
				`/connect/shopify?storeUri=${storeUri}&entityId=${user.entity.entityId}`
			);
		else router.push('/dashboard/home');
	};

	return (
		<div className='flex text-slate-700 h-screen'>
			<div className='flex-1 flex justify-center items-center'>
				<div className='!border border-slate-200 rounded-lg p-4 w-5/6 2xl:w-1/2 !shadow-md !shadow-slate-100'>
					<div className='flex flex-col gap-8 justify-center'>
						<div className='mx-auto'>
							<img
								src='/images/logo-main.png'
								width={160}
								height='auto'
								alt='Krispy logo'
							/>
						</div>
						<Heading
							title={'Log in'}
							subtitle={'Enter your credentials to access your account'}
						/>
					</div>
					<div>
						<label className='font-medium text-slate-500 mb-1'>Email</label>
						<Input
							thin
							placeholder='johndoe@gmail.com'
							name='email'
							value={formState?.email}
							onChange={changeHandler}
							inputAdornment={<MailOutlineOutlined />}
						/>
					</div>
					<div>
						<label className='font-medium text-slate-500 mb-1'>Password</label>
						<Input
							thin
							type='password'
							name='password'
							value={formState?.password}
							onChange={changeHandler}
						/>
					</div>
					<Link
						href='/forgot-password'
						className='text-sm text-orange-500 underline'
					>
						Forgot your password?
					</Link>
					<div className='my-3'>
						<CustomButton
							type='medium-purple'
							label='Login'
							onClick={logInUser}
						/>
					</div>
					<p className='text-center text-sm m-0'>
						New to Krispy?{' '}
						<a
							href={`https://calendly.com/krispy-shahtaj/30min?month=${moment().format(
								'YYYY-MM'
							)}`}
							target='_blank'
							className='text-orange-500 underline'
						>
							Book a demo here
						</a>
					</p>
				</div>
			</div>
			<div className='flex-1 hidden md:flex flex-col justify-between overflow-hidden'>
				<div className='mt-8'>
					<Heading
						title={'Meet your #1 revenue channel'}
						subtitle={'Discover the power of AI conversations on Whatsapp'}
					/>
				</div>
				<div className='ml-auto'>
					<img src='/images/Group 3.svg' />
				</div>
			</div>
		</div>
	);
};

export default Login;
