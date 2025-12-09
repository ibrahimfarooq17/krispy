import { Avatar, Switch } from '@mui/material';
import { cloneDeep } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	clearSingleChat,
	getSingleChat,
} from '../../redux/actions/conversation.actions';
import generateRandomString from '../../utilities/generateRandomString';
import getInitials from '../../utilities/getNameInitials';
import krispyAxios from '../../utilities/krispyAxios';
import ChatInput from '../@generalComponents/ChatInput';
import Loader from '../@generalComponents/Loader';
import SingleMessage from './SingleMessage';

const ConversationThread = ({ selectedConvo }) => {
	const dispatch = useDispatch();
	const bottomOfChat = useRef(null);
	const [messages, setMessages] = useState();
	const [newMessage, setNewMessage] = useState();
	const [messageBeingSent, setMessageBeingSent] = useState(null);

	const singleChatMessages = useSelector(
		(state) => state.conversationReducer.singleChat
	);

	useEffect(() => {
		return () => {
			dispatch(clearSingleChat());
		};
	}, []);

	useEffect(() => {
		if (selectedConvo?.chatId) {
			dispatch(clearSingleChat());
			dispatch(getSingleChat(selectedConvo?.chatId));
		}
	}, [selectedConvo]);

	useEffect(() => {
		setMessages(cloneDeep(singleChatMessages));
	}, [singleChatMessages]);

	useEffect(() => {
		if (messages?.length > 0) scrollToBottomOfChat();
	}, [messages]);

	const scrollToBottomOfChat = () => {
		bottomOfChat?.current?.scrollIntoView({ behavior: 'instant' });
	};

	const sendMessage = async (e) => {
		e.preventDefault();

		if (newMessage.trim().length !== 0) {
			e.preventDefault();
			const newMessageKey = generateRandomString(20);
			setMessageBeingSent(newMessageKey);
			setMessages([
				...messages,
				{
					key: newMessageKey,
					content: newMessage,
					sentBy: 'INTERNAL_USER',
				},
			]);
			setNewMessage('');
			await krispyAxios({
				method: 'POST',
				url: `chats/whatsapp/send-message/${selectedConvo?.chatId}`,
				body: {
					text: newMessage,
				},
			});
			new Audio('/sounds/message-sent-sound.mp3').play();
			setMessageBeingSent(null);
		}
	};

	const changeChatAiStatus = async (e) => {
		const checked = e?.target?.checked;
		await krispyAxios({
			method: 'PATCH',
			url: `chats/${selectedConvo?.chatId}`,
			body: {
				aiConversing: checked,
			},
			loadingMessage: 'Updating chat AI status...',
			successMessage: 'Successful!',
		});
	};

	if (selectedConvo)
		return (
			<Loader renderChildren={messages}>
				<div className='relative'>
					<div className='sticky top-0 flex justify-between items-center py-2.5 bg-white z-10 !border-b'>
						<div className='flex items-center justify-center gap-2 mb-1'>
							<Avatar
								sx={{
									background: '#e5dfd3',
									fontSize: '16px',
									color: '#000000',
									width: '28px',
									height: '28px',
								}}
							>
								{getInitials(selectedConvo?.contact?.name)}
							</Avatar>
							<div className='flex flex-col items-center font-medium text-slate-700'>
								<p className='m-0 p-0'>
									{selectedConvo?.contact?.name}&nbsp; -&nbsp; (
									{selectedConvo?.contact?.phoneNumber})
								</p>
							</div>
						</div>
						<div className='flex items-center h-2'>
							<Switch
								defaultChecked={selectedConvo?.aiConversing}
								color='warning'
								onChange={changeChatAiStatus}
								className=''
							/>
						</div>
					</div>
					<div
						className='overflow-scroll p-3 !pb-24'
						style={{ height: 'calc(100vh - 14.4rem)' }}
					>
						{messages?.map((message, i) => {
							const sameSenderAsPrev =
								message?.sentBy === messages?.[i - 1]?.sentBy;
							const messageLoading = message?.key === messageBeingSent;
							return (
								<SingleMessage
									message={message}
									profileName={selectedConvo?.contact?.name}
									prevMessage={messages?.[i - 1]}
									sameSenderAsPrev={sameSenderAsPrev}
									messageLoading={messageLoading}
								/>
							);
						})}
						<div ref={bottomOfChat} />
					</div>
					<div className='absolute bottom-0 left-0 right-0 mx-3 mb-3'>
						<ChatInput
							onSubmit={sendMessage}
							inputValue={newMessage}
							isDisabled={!selectedConvo.isActive}
							onInputChange={(e) => setNewMessage(e.target.value)}
							placeholder={'Type in your message...'}
						/>
					</div>
				</div>
			</Loader>
		);
	else
		return (
			<div>
				<div className='flex flex-col items-center justify-center'>
					<img
						className='mt-24'
						src='/images/chat-bubble-left-right.svg'
						width={340}
						height={340}
						alt='Chat bubble icon'
					/>
					<span className='text-slate-400'>
						No conversation selected. Select a conversation from the left.
					</span>
				</div>
			</div>
		);
};

export default ConversationThread;
