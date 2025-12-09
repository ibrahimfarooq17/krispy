import { Avatar, CircularProgress, IconButton } from '@mui/material';
import moment from 'moment';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addFeedbackModal } from '../../redux/actions/modal.actions';
import getInitials from '../../utilities/getNameInitials';

const SingleMessage = ({
	message,
	profileName,
	prevMessage,
	sameSenderAsPrev,
	messageLoading,
}) => {
	const dispatch = useDispatch();
	const isInternal =
		message?.sentBy === 'INTERNAL_USER' || message?.sentBy === 'AI';

	const [showReact, setShowReact] = useState(false);
	const [showLike, setShowLike] = useState(false);
	const [handleLike, sethandleLike] = useState(false);
	const currentMessageTime = moment(message?.msgTimestamp);
	const prevMessageTime = moment(prevMessage?.msgTimestamp);
	const showTime =
		Math.abs(
			moment.duration(currentMessageTime.diff(prevMessageTime)).asMinutes()
		) > 10;

	const currentUser = useSelector((state) => state.userReducer.currentUser);

	const openFeedbackModal = (message) => {
		dispatch(
			addFeedbackModal({
				isOpen: true,
				messageId: message?.messageId,
				messageContent: message?.content,
				chatId: message?.chat,
			})
		);
	};

	if (isInternal)
		return (
			<React.Fragment>
				{showTime && (
					<div className='flex items-center gap-3'>
						<div className='w-full h-0.5 bg-slate-100' />
						<p className='text-xs text-slate-500 m-0'>
							{moment(currentMessageTime).format('DD/MM/YYYY')}
						</p>
						<div className='w-full h-0.5 bg-slate-100' />
					</div>
				)}
				<div className='flex flex-row-reverse gap-2 my-2'>
					{messageLoading && (
						<CircularProgress
							sx={{
								color: 'grey',
								marginTop: 1,
								marginRight: 1,
							}}
							size={22}
							thickness={7}
						/>
					)}
					<Avatar
						sx={{
							background: '#ffedd5',
							fontWeight: 500,
							fontSize: '16px',
							color: '#57534e',
							width: '40px',
							height: '40px',
							...(sameSenderAsPrev && { visibility: 'hidden' }),
						}}
					>
						{message?.sentBy === 'INTERNAL_USER'
							? getInitials(currentUser?.firstName)
							: 'AI'}
					</Avatar>
					<div
						className={`relative !max-w-xl bg-indigo-50 flex flex-col gap-1 text-sm text-slate-800 py-2 px-2.5 rounded-lg !rounded-tr-none items-end hover:bg-indigo-100 ${
							messageLoading ?? 'opacity-50'
						}`}
						onMouseLeave={() => {
							setShowReact(false);
							handleLike && setShowLike(true);
						}}
						onMouseOver={() => {
							setShowReact(true);
							setShowLike(false);
						}}
					>
						{message.content}
						<p className='m-0 text-[0.64rem] text-slate-600'>
							{moment(currentMessageTime).format('HH:mm a')}
						</p>
						{/* MESSAGE LINKS */}
						{message?.links?.map((link) => {
							return (
								<React.Fragment>
									<br />
									<a
										style={{ color: '#ffffff' }}
										href={link}
										target='_blank'
									>
										{link}
									</a>
								</React.Fragment>
							);
						})}
						{showReact && (
							<div className='absolute -left-20 top-0 bottom-0 my-auto h-fit bg-slate-50 p-2 -ml-4 rounded-md !border border-indigo-100'>
								<div className=''>
									<IconButton
										style={{ background: '#7D93FF', padding: '5px' }}
										onClick={() => {
											setShowLike(!showLike);
											setShowReact(false);
											sethandleLike(!handleLike);
										}}
									>
										<img
											style={{ width: '13px', height: '13px' }}
											src='/images/like.svg'
											alt='Thumbs up icon'
										/>
									</IconButton>
									<IconButton
										style={{ background: '#7D93FF', padding: '5px' }}
										className='ms-2'
									>
										<img
											style={{ width: '13px', height: '13px' }}
											src='/images/hand-thumb-down.svg'
											alt='Thumbs down icon'
										/>
									</IconButton>
									<IconButton
										style={{ background: '#7D93FF', padding: '5px' }}
										className='ms-2'
										onClick={() => openFeedbackModal(message)}
									>
										<img
											className=''
											style={{ width: '13px', height: '13px' }}
											src='/images/chat-bubble-left-ellipsis.svg'
										/>
									</IconButton>
								</div>
							</div>
						)}
						{showLike && (
							<div className='absolute left-0 top-0 bottom-0 my-auto h-fit bg-indigo-50 p-2.5 rounded-full -ml-10'>
								<img
									src='/images/yellow.svg'
									width={16}
								/>
							</div>
						)}
					</div>
				</div>
			</React.Fragment>
		);
	else
		return (
			<React.Fragment>
				{showTime && (
					<div className='flex items-center gap-3'>
						<div className='w-full h-0.5 bg-slate-100' />
						<p className='text-xs text-slate-500 m-0'>
							{moment(currentMessageTime).format('DD/MM/YYYY')}
						</p>
						<div className='w-full h-0.5 bg-slate-100' />
					</div>
				)}
				<div className={`flex gap-2 my-2`}>
					<Avatar
						sx={{
							background: '#e2e8f0',
							fontWeight: 500,
							fontSize: '16px',
							color: '#475569',
							width: '40px',
							height: '40px',
							...(sameSenderAsPrev && { visibility: 'hidden' }),
						}}
					>
						{getInitials(profileName)}
					</Avatar>
					<div className='flex flex-col gap-1 max-w-md text-sm text-slate-800 bg-slate-100 py-2 px-2.5 rounded-lg !rounded-tl-none items-start'>
						{message.content}
						<p className='m-0 text-[0.64rem] text-slate-600'>
							{moment(currentMessageTime).format('HH:mm a')}
						</p>
					</div>
				</div>
			</React.Fragment>
		);
};

export default SingleMessage;
