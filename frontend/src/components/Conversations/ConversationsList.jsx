import { Avatar, Button, ThemeProvider, createTheme } from '@mui/material';
import { Tooltip } from 'antd';
import moment from 'moment';
import React, { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import { getPaginatedChats } from '../../redux/actions/conversation.actions';
import getInitials from '../../utilities/getNameInitials';
import truncateString from '../../utilities/truncateString';
import CustomChip from '../@generalComponents/CustomChip';
import Spinner from '../@generalComponents/Spinner';

const theme = createTheme({
	palette: {
		orange: {
			light: '#eff1ff',
			main: '#FD4F02',
			dark: '#fd601b',
			contrastText: '#fff',
		},
		'light-orange': {
			light: '#eff1ff',
			main: '#FFEDE6',
			dark: '#ffe2d8',
			contrastText: '#fd601b',
		},
	},
});

const ConversationsList = ({ selectedConvo, setSelectedConvo }) => {
	const dispatch = useDispatch();

	const [selectedTab, setSelectedTab] = useState('1');

	const paginatedChats = useSelector(
		(state) => state.conversationReducer.paginatedChats
	);

	const handleTabChange = (newValue) => setSelectedTab(newValue);

	const filterConvos = () => {
		if (selectedTab === '0')
			return paginatedChats?.chats?.filter(
				(convo) => convo.aiConversing === false
			);
		else return paginatedChats?.chats;
	};

	const getNextPage = async () => {
		const nextPage = paginatedChats?.pagination?.nextPage;
		if (!nextPage) return;
		dispatch(getPaginatedChats('WHATSAPP', nextPage));
	};

	return (
		<ThemeProvider theme={theme}>
			<div>
				<div className='sticky top-0 flex justify-between gap-4 py-2 bg-white z-10'>
					<Button
						onClick={() => handleTabChange('0')}
						variant='contained'
						color={selectedTab === '0' ? 'orange' : 'light-orange'}
						className='flex-1'
						style={{ textTransform: 'capitalize' }}
					>
						Supervised
					</Button>
					<Button
						onClick={() => handleTabChange('1')}
						variant='contained'
						color={selectedTab === '1' ? 'orange' : 'light-orange'}
						className='flex-1'
						style={{ textTransform: 'capitalize' }}
					>
						All ({paginatedChats?.pagination?.totalRecords})
					</Button>
				</div>
				{filterConvos().length > 0 ? (
					<InfiniteScroll
						height='calc(100vh - 14.4rem)'
						dataLength={paginatedChats?.chats?.length}
						next={getNextPage}
						hasMore={paginatedChats?.pagination?.nextPage}
						loader={<Spinner />}
						hasChildren={filterConvos().length !== 0}
						endMessage={
							<p className='text-sm text-slate-400 text-center'>
								<b>No more conversations to show</b>
							</p>
						}
					>
						{filterConvos().map((convo) => {
							return (
								<div
									key={convo?.chatId}
									className={`flex gap-2 my-2 px-2 py-3 hover:bg-slate-50 rounded-md cursor-pointer transition-all ease-in-out duration-100 ${
										selectedConvo?.chatId === convo?.chatId
											? 'bg-slate-100 !border-l-2 border-orange-500 rounded-l-none'
											: ''
									}`}
									onClick={() => setSelectedConvo(convo)}
								>
									<Avatar
										sx={{
											background: '#e2e8f0',
											fontWeight: 500,
											fontSize: '16px',
											color: '#475569',
										}}
									>
										{getInitials(convo?.contact?.name)}
									</Avatar>
									<div className='flex justify-between w-full'>
										<div className='flex flex-col'>
											<div className='flex gap-2'>
												<p className='font-medium m-0'>
													{convo?.contact?.name}
												</p>
												<Tooltip
													title={
														convo.isActive
															? 'You can reply to this conversation'
															: '24-hour window for this conversation is over'
													}
													color='white'
													placement='right'
													overlayInnerStyle={{
														color: '#334155',
														paddingLeft: '12px',
														width: '80%',
													}}
												>
													<span>
														<CustomChip
															label={convo.isActive ? 'Active' : 'Inactive'}
															type={convo.isActive ? 'green' : 'orange'}
														/>
													</span>
												</Tooltip>
											</div>
											<p className='text-xs m-0 text-slate-500'>
												{truncateString(convo?.latestMsg?.content, 40)}
											</p>
										</div>
										<div className='shrink-0'>
											<p className='text-sm m-0 text-slate-500'>
												{moment(convo.lastMsgTimestamp).format(
													'DD/MM/YY hh:mm a'
												)}
											</p>
										</div>
									</div>
								</div>
							);
						})}
					</InfiniteScroll>
				) : (
					<p className='text-center mt-8 text-slate-400'>
						No conversations to show
					</p>
				)}
			</div>
		</ThemeProvider>
	);
};

export default ConversationsList;
