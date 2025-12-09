'use client';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { Divider } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import Input from '../../../components/@generalComponents/Input';
import ResetPassword from '../../../components/Settings/General/ResetPassword';
import Subscription from '../../../components/Settings/General/Subscription';
import SettingsLayout from '../../../layout/SettingsLayout';
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
			<div className='row g-0 d-flex  mt-3 mb-5'>
				<div className='col-md-12 p-3'>
					<span className='font-inter text-[20px]'>General</span>
					<p className='settings-subtext'>
						Manage the general settings of your Krispy account
					</p>
					<div className='row'>
						<div className='col-md-4'>
							<Input
								thin
								label='First name'
								value={formState.firstName}
								inputAdornment={<PersonOutlineIcon />}
							/>
						</div>
						<div className='col-md-4'>
							<Input
								thin
								label='Last name'
								value={formState.lastName}
								inputAdornment={<PersonOutlineIcon />}
							/>
						</div>
						<div className='col-md-4'>
							<Input
								thin
								label='Business name'
								value={formState.businessName}
								inputAdornment={<ApartmentIcon />}
							/>
						</div>
					</div>
					<div className='row d-flex justify-content-end'>
						<div className='col-md-1'>
							<CustomButton
								type='medium-purple'
								label='Save'
								// onClick={saveBrandVoice}
							/>
						</div>
					</div>

					<Divider
						sx={{
							border: 'none',
							marginTop: '15px',
							marginBottom: '25px',
						}}
					/>
					<div className='row'>
						<ResetPassword />
					</div>
					<Subscription />
				</div>
			</div>
		</SettingsLayout>
	);
};

export default GeneralSettings;
