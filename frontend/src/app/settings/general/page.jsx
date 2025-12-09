'use client';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Heading from '../../../components/@generalComponents/Heading';
import { default as Input } from '../../../components/@generalComponents/Input';
import ResetPassword from '../../../components/Settings/General/ResetPassword';
import Subscription from '../../../components/Settings/General/Subscription';
import { default as SettingsLayout } from '../../../layout/SettingsLayout';

const GeneralSettings = () => {
	const [formState, setFormState] = useState({
		firstName: '',
		lastName: '',
		businessName: '',
		email: '',
	});

	const currentUser = useSelector((state) => state.userReducer.currentUser);

	useEffect(() => {
		if (!currentUser) return;
		setFormState({
			firstName: currentUser?.firstName,
			lastName: currentUser?.lastName,
			businessName: currentUser?.entity?.name,
			email: currentUser?.email,
		});
	}, [currentUser]);

	return (
		<SettingsLayout>
			<div className='flex flex-col gap-2 text-slate-700'>
				<Heading
					title={'General'}
					subtitle={'Manage the general settings of your Krispy account'}
				/>
				<div className='flex gap-4'>
					<div className='flex-1'>
						<label className='text-sm font-medium text-slate-500 mb-1'>
							First name
						</label>
						<Input
							thin
							value={formState.firstName}
							inputAdornment={<PersonOutlineIcon />}
						/>
					</div>
					<div className='flex-1'>
						<label className='text-sm font-medium text-slate-500 mb-1'>
							Last name
						</label>
						<Input
							thin
							value={formState.lastName}
							inputAdornment={<PersonOutlineIcon />}
						/>
					</div>
					<div className='flex-1'>
						<label className='text-sm font-medium text-slate-500 mb-1'>
							Business name
						</label>
						<Input
							thin
							value={formState.businessName}
							inputAdornment={<ApartmentIcon />}
						/>
					</div>
				</div>
				<ResetPassword />
				<Subscription />
			</div>
		</SettingsLayout>
	);
};

export default GeneralSettings;
