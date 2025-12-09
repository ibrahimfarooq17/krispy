'use client';
import React, { useState } from 'react';
import Input from '../@generalComponents/Input';
import Spinner from '../@generalComponents/Spinner';

const Action = ({ data, setData, allActions }) => {
	const [isWebhookChecked, setIsWebhookChecked] = useState(false);

	const onChange = (e, action) => {
		if (e?.target?.checked && action.type === 'WEBHOOK')
			setIsWebhookChecked(true);
		else setIsWebhookChecked(false);

		setData({
			...data,
			actionId: e?.target?.checked ? action?.aiActionId : null,
		});
	};

	return (
		<React.Fragment>
			<div className='mb-5'>
				<h1 className='text-3xl font-bold m-0'>Action</h1>
				<p className='text-sm text-slate-500'>
					Trigger what action to perform once you have the customer's data
				</p>
			</div>
			{!allActions ? (
				<Spinner />
			) : (
				<div className='w-2/3 flex flex-col gap-4'>
					{allActions?.map((action) => {
						return (
							<div className='rounded-lg bg-slate-100 p-3 flex gap-2'>
								<div className=''>
									<Input
										type='checkbox'
										value={data?.actionId === action?.aiActionId}
										onChange={(e) => onChange(e, action)}
									/>
								</div>
								<div className='flex flex-col'>
									<span className='font-semibold'>{action?.name}</span>
									<span className='text-sm text-slate-600'>
										{action?.description}
									</span>
								</div>
							</div>
						);
					})}
					<div className={isWebhookChecked ? '' : 'hidden'}>
						<Input
							type='text'
							label='Paste your webhook URL'
							onChange={(e) =>
								setData({
									...data,
									actionMetadata: {
										...data.actionMetadata,
										webhookUrl: e.target.value,
									},
								})
							}
						/>
					</div>
				</div>
			)}
		</React.Fragment>
	);
};

export default Action;
