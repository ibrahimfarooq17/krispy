import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Loader from '../../components/@generalComponents/Loader';
import krispyAxios from '../../utilities/krispyAxios';
import Spinner from '../@generalComponents/Spinner';

ChartJS.register(ArcElement, Tooltip, Legend);

const ChatsAiActiveChart = ({ interval }) => {
	const [chatAnalytics, setChatAnalytics] = useState();

	useEffect(() => {
		setChatAnalytics();
		getChatAnalytics();
	}, []);

	const getChatAnalytics = async () => {
		const { analytics } = await krispyAxios({
			method: 'GET',
			url: `analytics/chats/ai-count`,
		});
		setChatAnalytics(analytics);
	};

	if (chatAnalytics)
		return (
			<React.Fragment>
				<div className='flex items-center justify-between'>
					<span className='text-[16px] font-medium text-[#2A2A2A] mb-1 text-start col-md-6'>
						AI Conversations
					</span>
					<div className='flex gap-2 items-center'>
						<span className='text-[20px] text-[#4F4F4F] font-inter font-medium'>
							{chatAnalytics?.totalChats != 0
								? Number(
										(chatAnalytics?.totalAIChats / chatAnalytics?.totalChats) *
											100
								  ).toFixed(2)
								: 0.0}
							%
						</span>
						<div className='w-fit h-fit py-[2px] px-[6px] flex bg-[#E6F6F3] rounded gap-1'>
							<img
								width='24px'
								height='24px'
								src='/images/trending-up.svg'
								alt='Trending up icon'
							/>
							<span>21%</span>
						</div>
					</div>
				</div>
				<div style={{ height: '200px', marginTop: 28 }}>
					<Doughnut
						options={{
							responsive: true,
							maintainAspectRatio: false,
							plugins: {
								tooltip: {
									enabled: false,
								},
								legend: {
									labels: {
										usePointStyle: true,
										pointStyle: 'circle',

										boxHeight: 6,
									},
									position: 'right',
								},
							},
						}}
						data={{
							labels: ['AI', 'Human'],
							datasets: [
								{
									fill: true,
									data: [
										chatAnalytics?.totalAIChats,
										chatAnalytics?.totalNonAIChats,
									],
									borderColor: ['#5C78FF', '#CED7FF'],
									backgroundColor: ['#5C78FF', '#CED7FF'],
								},
							],
						}}
					/>
				</div>
			</React.Fragment>
		);
	else return <Spinner />;
};

export default ChatsAiActiveChart;
