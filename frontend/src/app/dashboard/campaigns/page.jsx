'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import Heading from '../../../components/@generalComponents/Heading';
import Loader from '../../../components/@generalComponents/Loader';
import CampaignItem from '../../../components/Campaigns/CampaignItem';
import MainLayout from '../../../layout/MainLayout';
import { confirmationModal } from '../../../redux/actions/modal.actions';
import krispyAxios from '../../../utilities/krispyAxios';

const mockOpenRate = {
	percentage: '78',
	breakdown: [
		{ name: 'Opened', value: 78 },
		{ name: 'Unopened', value: 22 },
	],
};

const Campaigns = () => {
	const router = useRouter();
	const dispatch = useDispatch();

	const [campaigns, setCampaigns] = useState();
	const [templateVisibility, setTemplateVisibility] = useState({});
	const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
	const [hoveredElementStyle, setHoveredElementStyle] = useState({});

	useEffect(() => {
		getCampaigns();
	}, []);

	const handleMouseMove = (e) => {
		setCursorPosition({
			x: e.clientX,
			y: e.clientY,
		});
	};

	useEffect(() => {
		if (templateVisibility) {
			let positionStyle;

			if (cursorPosition.x > window.innerWidth / 2) {
				positionStyle = { ...positionStyle, right: '110%' };
			} else {
				positionStyle = { ...positionStyle, left: '110%' };
			}

			if (cursorPosition.y > window.innerHeight / 2) {
				positionStyle = { ...positionStyle, bottom: '5%' };
			} else {
				positionStyle = { ...positionStyle, top: '5%' };
			}

			setHoveredElementStyle(positionStyle);
		}
	}, [cursorPosition, templateVisibility]);

	const getCampaigns = async () => {
		const { campaigns } = await krispyAxios({
			method: 'GET',
			url: 'campaigns',
		});
		setCampaigns(campaigns);
	};

	const navigateToCreateCampaign = () => {
		router.push('/dashboard/campaigns/create');
	};

	const deleteCampaign = async (campaignId) => {
		await krispyAxios({
			method: 'DELETE',
			url: `campaigns/${campaignId}`,
		});
		await getCampaigns();
	};

	const confirmCampaignDeletion = (campaignId) => {
		dispatch(
			confirmationModal({
				isOpen: true,
				title: 'Are you sure?',
				details:
					'Deleting a campaign would immediately delete all scheduled messages to be sent out to your contacts.',
				onConfirm: () => deleteCampaign(campaignId),
			})
		);
	};

	return (
		<MainLayout>
			<Loader renderChildren={campaigns}>
				<div className='flex flex-col justify-between px-8 py-4'>
					<Heading
						title={'Campaigns'}
						subtitle={'Create campaigns that reach your customers'}
						buttons={[
							{
								text: 'Create new campaign',
								onClick: navigateToCreateCampaign,
								image: {
									url: '/images/add-icon.svg',
									altText: 'plus icon',
								},
							},
						]}
					/>
					<div className='gap-4'>
						{campaigns?.map((campaign) => {
							return (
								<CampaignItem
									campaign={campaign}
									templateVisibility={templateVisibility}
									setTemplateVisibility={setTemplateVisibility}
									handleMouseMove={handleMouseMove}
									hoveredElementStyle={hoveredElementStyle}
									confirmCampaignDeletion={confirmCampaignDeletion}
								/>
							);
						})}
					</div>
				</div>
			</Loader>
		</MainLayout>
	);
};

export default Campaigns;
