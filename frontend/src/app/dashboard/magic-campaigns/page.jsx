'use client';
import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { Chip, IconButton, Button, LinearProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import krispyAxios from '../../../utilities/krispyAxios';
import moment from 'moment';
import Loader from '../../../components/@generalComponents/Loader';

const MagicCampaigns = () => {
	const router = useRouter();

	const [campaigns, setCampaigns] = useState();

	useEffect(() => {
		getCampaigns();
	}, []);

	const getCampaigns = async () => {
		const { campaigns } = await krispyAxios({
			method: 'GET',
			url: 'campaigns',
		});
		setCampaigns(campaigns);
	};

	const navigateToCreateCampaign = () => {
		router.push('/dashboard/magic-campaigns/create');
	};

	return (
		<MainLayout>
			<Loader renderChildren={campaigns}>
				<div className='row g-0 p-4 flex justify-between items-center'>
					<div className='flex justify-between items-center border-b-[1px] border-primary-gray mb-2 pb-3'>
						<div className='col-md-3'>
							<p
								className='font-medium text-[20px] black'
								style={{ margin: 0 }}
							>
								Magic Campaigns
							</p>
						</div>
						<div className='col-md-6'>
							{/* <div className='w-full flex items-center px-2 rounded-full h-[40px] border-2 border-primary-gray'>
              <img src="/images/magnifying-glass.svg" alt="/images/magnifying-glass.svg" />
              <input placeholder='How would you like to engage your customers?' className='h-full w-full rounded-full px-2 outline-none pb-[2px]' type="text" name="" id="" />
            </div> */}
						</div>
						<div className='col-md-2 text-end'>
							<IconButton
								className='me-2'
								style={{
									border: '1px solid #DBDBDB',
									width: '38px',
									height: '30px',
								}}
								onClick={navigateToCreateCampaign}
							>
								<img src='/images/add-icon.svg' />
							</IconButton>
						</div>
					</div>
					{/* {tempResearchResults.map((researchItem) => {
            return (
              <div className='research-item-container mt-2'>
                <div className='d-flex justify-content-between mb-2'>
                  <div className='d-flex '>
                    <p
                      className='font-medium text-[#2A2A2A] mb-0 text-[20px] me-2'
                      style={{ color: '#4f4f4f' }}
                    >
                      {researchItem.categoryTitle}
                    </p>
                    <Chip
                      label={researchItem.numOfContacts}
                      sx={{
                        background: '#ECECEC',
                        borderRadius: '6px',
                        color: '#4F4F4F',
                        fontSize: '14px',
                        height: '20px',
                        marginTop: '8px',
                        fontWeight: '400',
                      }}
                    />
                  </div>
                  <div className='d-flex'>
                    <Link href={'magic-campaigns/create'}>

                      <IconButton
                        className='mb-2 me-2'
                        style={{
                          border: '1px solid #DBDBDB',
                          borderRadius: '4px',
                          width: '38px',
                          height: '30px'

                        }}
                      >
                        <img src='/images/plus.svg' style={{ width: '20px' }} />
                      </IconButton>
                    </Link>
                    <IconButton
                      className='mb-2 me-2'
                      style={{
                        border: '1px solid #DBDBDB',
                        borderRadius: '4px',
                        width: '38px',
                        height: '30px'

                      }}
                    >
                      <img src='/images/ellipsis-icon.svg' style={{ width: '20px' }} />
                    </IconButton>
                  </div>
                </div>
                <div className='row'>
                  {researchItem.results?.map((result) => {
                    return <ResearchResult result={result} />;
                  })}
                </div>
              </div>
            );
          })} */}
					{campaigns?.map((campaign) => {
						return (
							<div className='research-item-container mt-2'>
								<div className='d-flex justify-content-between mb-2'>
									<p
										className='font-medium text-[#2A2A2A] mb-0 text-[20px] me-2'
										style={{ color: '#4f4f4f' }}
									>
										{campaign?.name}
									</p>
									<Chip
										label={moment(campaign?.createdAt).format(
											'Do MMMM, YYYY hh:mm a'
										)}
										sx={{
											background: '#ECECEC',
											borderRadius: '6px',
											color: '#4F4F4F',
											fontSize: '14px',
											height: '20px',
											marginTop: '8px',
											fontWeight: '400',
										}}
									/>
								</div>
								<p
									className='font-light text-[#2A2A2A] mb-0 text-[14px] me-2'
									style={{ color: '#4f4f4f', whiteSpace: 'pre-line' }}
								>
									{campaign?.template
										? campaign?.template?.components?.find(
												(comp) => comp?.type === 'BODY'
										  )?.text
										: 'Template hooked with this campaign has been deleted.'}
								</p>
								<div className='row mt-4'>
									<div
										className='col-10'
										style={{ margin: 'auto' }}
									>
										<LinearProgress
											sx={{ height: '7px' }}
											variant='determinate'
											value={
												(campaign?.contactsReached / campaign?.totalContacts) *
												100
											}
										/>
									</div>
									<div className='col-2'>
										<p
											className='font-medium text-[#2A2A2A] mb-0 text-[12px] me-2'
											style={{ color: '#4f4f4f' }}
										>
											{campaign?.contactsReached}/{campaign?.totalContacts}{' '}
											contacts reached
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</Loader>
		</MainLayout>
	);
};

export default MagicCampaigns;
