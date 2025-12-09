'use client';
import Heading from '../../../components/@generalComponents/Heading';
import Loader from '../../../components/@generalComponents/Loader';
import ConversationThread from '../../../components/Conversations/ConversationThread';
import ConversationsList from '../../../components/Conversations/ConversationsList';
import MainLayout from '../../../layout/MainLayout';
import {
	clearPaginatedChats,
	getPaginatedChats,
} from '../../../redux/actions/conversation.actions';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const Conversations = () => {
	const dispatch = useDispatch();
	const [selectedConvo, setSelectedConvo] = useState();

	const paginatedChats = useSelector(
		(state) => state.conversationReducer.paginatedChats
	);

	useEffect(() => {
		dispatch(getPaginatedChats('WHATSAPP', 0));
		return () => dispatch(clearPaginatedChats());
	}, []);

	return (
		<MainLayout>
			<Loader renderChildren={paginatedChats?.pagination}>
				<div className='flex flex-col px-8 pt-4'>
					<Heading
						title={'Conversations'}
						subtitle={'You can find all your customer conversations here'}
					/>
					<div className='flex gap-4'>
						<div className='w-1/3'>
							<ConversationsList
								selectedConvo={selectedConvo}
								setSelectedConvo={setSelectedConvo}
							/>
						</div>
						<div className='w-2/3'>
							<ConversationThread selectedConvo={selectedConvo} />
						</div>
					</div>
				</div>
			</Loader>
		</MainLayout>
	);
};

export default Conversations;
