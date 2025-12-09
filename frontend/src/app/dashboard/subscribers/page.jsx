'use client';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Heading from '../../../components/@generalComponents/Heading';
import Input from '../../../components/@generalComponents/Input';
import Loader from '../../../components/@generalComponents/Loader';
import SubscribersChart from '../../../components/Charts/SubscribersChart';
import SubscribersList from '../../../components/Table/SubscriberList';
import MainLayout from '../../../layout/MainLayout';

const Subscribers = () => {
	const [interval, setInterval] = useState(30);

	const currentUser = useSelector((state) => state.userReducer.currentUser);

	return (
		<MainLayout>
			<Loader renderChildren={currentUser}>
				<div className='px-8 py-4'>
					<div className='!border border-slate-200 p-4 rounded-lg'>
						<div className='flex justify-between'>
							<Heading title={"Subscribers' Analytics"} />
							<div>
								<Input
									thin
									type='select'
									options={[
										{
											label: 'Last 15 days',
											value: 15,
										},
										{
											label: 'Last 30 days',
											value: 30,
										},
										{
											label: 'Last 45 days',
											value: 45,
										},
										{
											label: 'Last 60 days',
											value: 60,
										},
									]}
									value={interval}
									onChange={(e) => setInterval(e?.target?.value)}
								/>
							</div>
						</div>
						<SubscribersChart interval={interval} />
					</div>
					<div className='mt-8'>
						<SubscribersList />
					</div>
				</div>
			</Loader>
		</MainLayout>
	);
};

export default Subscribers;
