'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Heading from '../../../components/@generalComponents/Heading';
import Input from '../../../components/@generalComponents/Input';
import Loader from '../../../components/@generalComponents/Loader';
import ChatsAreaChart from '../../../components/Charts/ChatsAreaChart';
import Statistics from '../../../components/Home/Statistics';
import MainLayout from '../../../layout/MainLayout';
import krispyAxios from '../../../utilities/krispyAxios';

const Home = () => {
	const [chatsInterval, setChatsInterval] = useState(30);
	const [analytics, setAnalytics] = useState();
	const [chatAnalytics, setChatAnalytics] = useState();

	const currentUser = useSelector((state) => state.userReducer.currentUser);
	const knowledgeBase = useSelector(
		(state) => state.knowledgeBaseReducer.knowledgeBase
	);

	useEffect(() => {
		getAnalytics();
	}, []);

	useEffect(() => {
		if (!chatsInterval) return;
		setChatAnalytics();
		getChatAnalytics();
	}, [chatsInterval]);

	const getAnalytics = async () => {
		const { analytics } = await krispyAxios({
			method: 'GET',
			url: `analytics`,
		});
		setAnalytics(analytics);
	};

	const getChatAnalytics = async () => {
		const { analytics } = await krispyAxios({
			method: 'GET',
			url: `analytics/chats/count?interval=${chatsInterval}`,
		});
		setChatAnalytics(analytics);
	};

	return (
		<MainLayout>
			<Loader renderChildren={currentUser && knowledgeBase && analytics}>
				<div className='flex flex-col font-inter px-8 py-4'>
					<Heading
						title={`Welcome ${currentUser?.firstName} 👋`}
						subtitle={'Here is your account summary'}
					/>
					<Statistics
						revenue={analytics?.shopifyAttributionRevenue}
						revenuePerRecipient={analytics?.revenuePerRecipient}
						openRate={analytics?.openRate}
						currency={knowledgeBase?.currency}
					/>
					<div className='!border border-slate-300 rounded-md py-3 my-2'>
						<div className='flex w-full justify-between items-center px-3'>
							<div className='flex-1'>
								<p className='text-xl m-0'>Conversations</p>
							</div>
							<div className='flex-1 flex gap-3 justify-end items-center'>
								<span className='text-xl'>{chatAnalytics?.totalChats}</span>
								<img
									src='/images/trending-up.svg'
									alt='trending upward icon'
									className='-ml-2'
								/>
								<div className='w-2/5'>
									<Input
										className='m-0'
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
										value={chatsInterval}
										onChange={(e) => setChatsInterval(e?.target?.value)}
									/>
								</div>
							</div>
						</div>
						<div className='overflow-hidden text-sm'>
							<ChatsAreaChart chatAnalytics={chatAnalytics} />
						</div>
					</div>
				</div>
			</Loader>
		</MainLayout>
	);
};

export default Home;
