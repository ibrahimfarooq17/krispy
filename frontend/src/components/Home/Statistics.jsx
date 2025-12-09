import React from 'react';
import formatNumber from '../../utilities/formatNumber';
import getCurrencySymbol from '../../utilities/getCurrencySymbol';

const Statistics = ({ revenue, revenuePerRecipient, currency, openRate }) => {
	const data = [
		{
			title: 'Opening rate',
			icon: 'ranking.svg',
			iconAlt: 'ranking icon',
			value: `${openRate}%`,
			isTrendingUp: true,
		},
		// {
		//   title: "Click through rate",
		//   icon: "mouse-square.svg",
		//   iconAlt: "mouse square icon",
		//   value: "21.7%",
		//   isTrendingUp: true,
		// },
		{
			title: 'Revenue',
			icon: 'money-in.svg',
			iconAlt: 'money received icon',
			value: `${getCurrencySymbol(currency)}${formatNumber(revenue)}`,
			isTrendingUp: true,
		},
		{
			title: 'Revenue/recipient',
			icon: 'money-out.svg',
			iconAlt: 'money sent icon',
			value: `${getCurrencySymbol(currency)}${revenuePerRecipient}`,
			isTrendingUp: true,
		},
	];

	const renderStatisticCard = ({
		title,
		icon,
		iconAlt,
		value,
		isTrendingUp,
	}) => {
		return (
			<div
				className={`flex-1 flex flex-col gap-2 !border border-slate-300 rounded-md p-3 ${
					isTrendingUp ? 'hover:border-emerald-500' : 'hover:border-rose-500'
				} transition-all ease-in-out duration-100`}
			>
				<div className='flex items-center justify-between'>
					<span className='text-base text-slate-600'>{title}</span>
					<img
						src={`/images/${icon}`}
						alt={iconAlt}
					/>
				</div>
				<div className='flex gap-2 items-center'>
					<span
						className={`text-xl font-medium ${
							isTrendingUp ? 'text-emerald-500' : 'text-rose-500'
						}`}
					>
						{value}
					</span>
					<img
						src={
							isTrendingUp
								? '/images/trending-up.svg'
								: '/images/trending-down.svg'
						}
						alt={
							isTrendingUp
								? 'trending upwards icon in green color'
								: 'trending downawards icon in red color'
						}
					/>
				</div>
			</div>
		);
	};

	return (
		<div className='flex gap-2 my-2'>
			{data.map((dataItem, index) => renderStatisticCard(dataItem))}

			{/* <div className='col-span-1 border border-primary-gray rounded h-[130px] py-[12px] px-[10px]'>
        <div className='flex items-center justify-between mt-[5px] '>
          <span className='font-medium text-[16px] text-[#000] '>Opening rate</span>
          <div className='w-[50px] h-[50px] rounded-full flex justify-center items-center bg-[#EFF1FF]'>
            <img width='20px' height='20px' src='/images/ranking.svg' alt="/images/ranking.svg" />
          </div>
        </div>
        <div className='flex gap-2 mt-3'>
          <span className='text-[20px] font-medium'>94.7%</span>
          <div className='w-6 h-6 rounded bg-[#E6F6F3] flex justify-center items-center'>
            <img src='/images/trending.svg' alt="/images/trending.svg" />
          </div>
        </div>
      </div>
      <div className='col-span-1 border border-primary-gray rounded h-[130px] py-[12px] px-[10px]'>
        <div className='flex items-center justify-between mt-[5px]'>
          <span className='font-medium text-[16px] text-[#000]'>Click through rate</span>
          <div className='w-[50px] h-[50px] rounded-full flex justify-center items-center bg-[#FFEDE6]'>
            <img width='20px' height='20px' src='/images/mouse-square.svg' alt="/images/ranking.svg" />
          </div>
        </div>
        <div className='flex gap-2 mt-3'>
          <span className='text-[20px] font-medium '>21.7%</span>
          <div className='w-6 h-6 rounded bg-[#E6F6F3] flex justify-center items-center'>
            <img src='/images/trending.svg' alt="/images/trending.svg" />
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col !border border-slate-300 rounded-md p-3 hover:border-emerald-500 transition-all ease-in-out duration-100">
        <div className="flex items-center justify-between">
          <span className="text-base text-slate-600">Revenue</span>
          <img src="/images/money-in.svg" alt="/images/ranking.svg" />
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-2xl font-bold text-emerald-500">
            {`${getCurrencySymbol(currency)} ${revenue}`}
          </span>
          <img
            src="/images/trending-up.svg"
            alt="tending upwards icon in green color"
          />
        </div>
      </div>
      <div className="flex-1 border border-slate-300 rounded-md p-2">
        <div className="flex items-center justify-between mt-[5px]">
          <span className="font-medium text-[16px] text-[#000]">
            Revenue/recipient
          </span>
          <div className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-[#FFEDE6]">
            <img src="/images/money-out.svg" alt="/images/ranking.svg" />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-[20px]  font-medium ">
            {getCurrencySymbol(currency) + revenuePerRecipient}
          </span>
          <div className="w-6 h-6 rounded bg-[#E6F6F3] flex justify-center items-center">
          <img src="/images/trending.svg" alt="/images/trending.svg" />
          </div>
        </div>
      </div>
      <div className="flex-1 border border-slate-300 rounded-md p-2">
        <div className="flex items-center justify-between mt-[5px]">
          <span className="font-medium text-[16px] text-[#000]">Open rate</span>
          <div className="w-[50px] h-[50px] rounded-full flex justify-center items-center bg-[#FFEDE6]">
            <img
              width="20px"
              height="20px"
              src="/images/mouse-square.svg"
              alt="/images/ranking.svg"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <span className="text-[20px] font-medium ">{openRate}%</span>
          <div className="w-6 h-6 rounded bg-[#E6F6F3] flex justify-center items-center">
            <img src="/images/trending.svg" alt="/images/trending.svg" />
          </div>
        </div>
      </div> */}
		</div>
	);
};

export default Statistics;
