import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import Input from '../../../components/@generalComponents/Input';
import { getCurrentUser } from '../../../redux/actions/user.actions';
import krispyAxios from '../../../utilities/krispyAxios';
import Heading from '../../@generalComponents/Heading';

const ResetPassword = () => {
	const dispatch = useDispatch();

	const [formState, setFormState] = useState({
		currentPassword: '',
		newPassword: '',
		confirmNewPassword: '',
	});
	const [resLoading, setResLoading] = useState(false);

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
			url: 'users/update-password',
			body: {
				currentPassword: formState.currentPassword,
				newPassword: formState.newPassword,
			},
			loadingStateSetter: setResLoading,
			successMessage: 'Password updated successfully.',
			onSuccess: () => {
				dispatch(getCurrentUser());
				setFormState({
					currentPassword: '',
					newPassword: '',
					confirmNewPassword: '',
				});
			},
		});
	};

	return (
		<div className='!border border-slate-200 rounded-lg p-4 mt-3'>
			<Heading
				title={'Reset password'}
				subtitle={'Change your Krispy account password'}
			/>
			<div className='flex gap-4 mb-3'>
				<div className='flex-1'>
					<label className='text-sm font-medium text-slate-500 mb-1'>
						Current password
					</label>
					<Input
						thin
						type='password'
						name='currentPassword'
						value={formState.currentPassword}
						onChange={changeHandler}
					/>
				</div>
				<div className='flex-1'>
					<label className='text-sm font-medium text-slate-500 mb-1'>
						New password
					</label>
					<Input
						thin
						type='password'
						name='newPassword'
						value={formState.newPassword}
						onChange={changeHandler}
					/>
				</div>
				<div className='flex-1'>
					<label className='text-sm font-medium text-slate-500 mb-1'>
						Confirm password
					</label>
					<Input
						thin
						type='password'
						name='confirmNewPassword'
						value={formState.confirmNewPassword}
						onChange={changeHandler}
					/>
				</div>
			</div>
			<div className='w-fit mt-2 ml-auto'>
				<CustomButton
					type='medium-purple'
					label='Save'
					disabled={
						formState.currentPassword === '' ||
						formState.newPassword === '' ||
						formState.confirmNewPassword === '' ||
						formState.newPassword !== formState.confirmNewPassword
					}
					loading={resLoading}
					onClick={resetPassword}
				/>
			</div>
		</div>
	);
};

export default ResetPassword;
