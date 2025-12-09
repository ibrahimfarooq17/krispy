import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import krispyAxios from '../../../utilities/krispyAxios';
import CustomButton from '../../@generalComponents/CustomButton';
import Input from '../../@generalComponents/Input';

const Utms = () => {
	const [utmCodes, setUtmCodes] = useState([
		{
			key: '',
			value: '',
		},
	]);

	const preferences = useSelector(
		(state) => state.preferenceReducer.entityPreferences
	);

	useEffect(() => {
		if (!preferences?.utms) return;
		setUtmCodes(preferences?.utms);
	}, [preferences]);

	const changeHandler = (e, utmKey) => {
		const { name, value } = e?.target;
		const clonedUtmCodes = cloneDeep(utmCodes);
		const foundUtm = clonedUtmCodes?.find((utm) => utm?.key === utmKey);
		foundUtm[name] = value;
		setUtmCodes(clonedUtmCodes);
	};

	const addNewUtm = () => {
		setUtmCodes([
			...utmCodes,
			{
				key: '',
				value: '',
			},
		]);
	};

	const onSave = async () => {
		await krispyAxios({
			method: 'PATCH',
			url: `preferences/update`,
			body: {
				utms: utmCodes,
			},
			loadingMessage: 'Saving UTMs...',
			successMessage: 'UTMs updated!',
		});
	};

	return (
		<div className='flex flex-col'>
			<span className='font-medium'>UTMs</span>
			<span className='text-sm font-medium text-slate-500 mb-3'>
				These utms are appended to all the product links that are recommended by
				your AI agent.
			</span>
			<div className='flex flex-col gap-2'>
				{utmCodes?.map((utm) => {
					return (
						<div className='flex gap-4'>
							<div className='flex-1'>
								<Input
									type='text'
									name='key'
									placeholder='Key'
									value={utm?.key}
									onChange={(e) => changeHandler(e, utm?.key)}
								/>
							</div>
							<div className='flex-1'>
								<Input
									type='text'
									name='value'
									placeholder='Value'
									value={utm?.value}
									onChange={(e) => changeHandler(e, utm?.key)}
								/>
							</div>
						</div>
					);
				})}
			</div>
			<button
				onClick={addNewUtm}
				className='mt-2 !border border-slate-200 mr-auto flex gap-2 justify-center items-center p-2 rounded-md bg-slate-50 hover:bg-slate-200 ease-in-out duration-150'
			>
				<img
					src='/images/add-icon.svg'
					alt='Add icon'
				/>
				<span className='text-sm'>Add new UTM</span>
			</button>
			<div className='row d-flex justify-content-end'>
				<div className='col-md-2'>
					<CustomButton
						type='medium-purple'
						label='Save'
						onClick={onSave}
					/>
				</div>
			</div>
		</div>
	);
};

export default Utms;
