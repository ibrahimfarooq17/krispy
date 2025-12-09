'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import krispyAxios from '../../../utilities/krispyAxios';
import Heading from '../../@generalComponents/Heading';

const Subscription = () => {
	const [pricingTiers, setPricingTiers] = useState();

	const subscriptionPlans = [
		{
			name: 'Starter',
			price: '100',
			conversationRate: '0.025',
			features: [
				'Self-service on-boarding',
				'Customizable campaigns',
				'Interactive flow builder',
				'GDPR-compliance',
				'Reporting',
			],
		},
		{
			name: 'Pro',
			price: '200',
			conversationRate: '0.015',
			features: [
				'Self-service on-boarding',
				'Customizable campaigns',
				'Interactive flow builder',
				'GDPR-compliance',
				'Reporting',
				'AI agents',
			],
		},
		{
			name: 'Elite',
			price: '500',
			conversationRate: '0.005',
			features: [
				'White glove on-boarding',
				'Everything from Starter and Pro',
				'24/7 priority support',
				'Custom terms',
				'Custom SLA',
				'Priority feature request',
				'Dedicated Customer Success Manager',
			],
		},
	];

	console.log(window.location.host);

	useEffect(() => {
		getPricingTiers();
	}, []);

	const getPricingTiers = async () => {
		const { pricingTiers } = await krispyAxios({
			method: 'GET',
			url: 'pricing-tiers',
		});
		setPricingTiers(pricingTiers);
	};

	const getCallbackUrls = () => {
		let successUrl, cancelUrl;
		const currentHost = window.location.hostname;
		if (currentHost === 'localhost') {
			successUrl = 'https://fb.com/success';
			cancelUrl = 'https://fb.com/cancel';
		} else {
			successUrl = `https://${currentHost}/success?action=subscription`;
			cancelUrl = `https://${currentHost}/error?action=subscription`;
		}
		return { successUrl, cancelUrl };
	};

	const onSubscribe = async (type) => {
		const foundTier = pricingTiers?.find((tier) => tier?.type === type);
		if (!foundTier) return;
		const { successUrl, cancelUrl } = getCallbackUrls();
		const { checkoutUrl } = await krispyAxios({
			method: 'POST',
			url: 'subscriptions/checkout',
			body: {
				pricingTierId: foundTier?.pricingTierId,
				successUrl: successUrl,
				cancelUrl: cancelUrl,
			},
			loadingMessage: 'Checking you out...',
		});
		if (!checkoutUrl) return;
		window.location.href = checkoutUrl;
	};

	return (
		<div className='flex flex-col my-4 text-slate-700'>
			<Heading
				title={'Subscription'}
				subtitle={'Manage your Krispy subscription'}
			/>
			<div className='flex gap-4'>
				{subscriptionPlans.map((plan) => (
					<div className='flex-1 !border border-slate-200 rounded-lg p-4 hover:!shadow-md hover:!shadow-slate-200 ease-in-out duration-150'>
						<p className='text-lg font-medium m-0'>{plan.name}</p>
						<div className='my-2'>
							<p className='text-3xl font-bold m-0'>
								€{plan.price}{' '}
								<span className='text-base text-slate-500 font-normal'>
									per month
								</span>
							</p>
							<p className='text-sm text-slate-500 m-0'>
								+ €{plan.conversationRate} per conversation
							</p>
						</div>
						<div className='my-3'>
							<CustomButton
								label='Subscribe'
								type='medium-purple'
								onClick={() => onSubscribe(plan.name.toUpperCase())}
							/>
						</div>
						<div className='text-slate-400 flex flex-col gap-2'>
							{plan.features.map((feature) => (
								<p className='m-0'>✓ {feature}</p>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default Subscription;
