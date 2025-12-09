'use client';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import ChatInput from '../../../components/@generalComponents/ChatInput';
import Loader from '../../../components/@generalComponents/Loader';
import ChatThreadMessage from '../../../components/Settings/Demo/ChatThreadMessage';
import MainLayout from '../../../layout/MainLayout';
import generateRandomString from '../../../utilities/generateRandomString';
import krispyAxios from '../../../utilities/krispyAxios';

const Demo = () => {
	const [chatId, setChatId] = useState();
	const [chatMessages, setChatMessages] = useState();
	const [newMessage, setNewMessage] = useState({
		key: generateRandomString(10),
		content: '',
	});
	const [newMessageLoading, setNewMessageLoading] = useState(false);
	const [aiResponse, setAiResponse] = useState();
	const [aiLinks, setAiLinks] = useState();
	const [chatLoading, setChatLoading] = useState(true);
	const [embeddingInProgress, setEmbeddingInProgress] = useState(false);
	const [activeTab, setActiveTab] = useState(0);
	const [workerPlan, setWorkerPlan] = useState(
		JSON.parse(
			typeof window != 'undefined' && localStorage.getItem('workerPlan')
		)
	);
	const [currentIndex, setCurrentIndex] = useState(0); // ! TEMPORARY - FOR VISUAL EFFECT ONLY - TO BE REMOVED LATER ON
	const chatContainerRef = useRef(null);

	const samplePrompts = [
		'Create me 3 email newsletters for next week',
		'Analyze our customer churn rate for the past quarter and provide insights',
		"We're launching a new product line next month. Can you develop a retention plan",
		'I want to create a marketing campaign',
	];

	// ! TABS component
	const tabs = ['Planner', 'Logs'];
	const tabContent = [
		{
			key: 'browser',
			text: 'Event Research: Utilize available resources to identify important events happening next week.',
		},
		{
			key: 'content',
			text: 'Content Creation: Generate engaging and informative newsletter content tailored to each identified event.',
		},
		{
			key: 'segmentation',
			text: 'Segmentation: Segment the subscriber list based on preferences, past purchase behavior, and demographics.',
		},
		{
			key: 'newsletter',
			text: "Newsletter Design: Design newsletters that align with the brand's aesthetic.",
		},
		{
			key: 'schedule',
			text: 'Scheduling: Determine the optimal timing for sending each newsletter.',
		},
		{
			key: 'quality',
			text: 'Quality Assurance: Conduct thorough testing to ensure that the newsletters render correctly across different devices and email clients.',
		},
	];

	const connectors = useSelector(
		(state) => state.connectorReducer.allConnectors
	);
	const knowledgeBase = useSelector(
		(state) => state.knowledgeBaseReducer.knowledgeBase
	);
	const preferences = useSelector(
		(state) => state.preferenceReducer.entityPreferences
	);

	// ! TEMPORARY - FOR VISUAL EFFECT ONLY - TO BE REMOVED LATER ON
	useEffect(() => {
		if (workerPlan) {
			const timer = setInterval(() => {
				setCurrentIndex((prevIndex) => {
					// If the current index is the last index, clear the interval
					if (prevIndex === tabContent.length - 1) {
						clearInterval(timer);
						return prevIndex; // Keep the current index unchanged
					}
					// Otherwise, increment the index
					return prevIndex + 1;
				});
			}, 1000);
		}
	}, [workerPlan]);
	// ! TEMPORARY - FOR VISUAL EFFECT ONLY - TO BE REMOVED LATER ON

	useEffect(() => {
		if (connectors && knowledgeBase && checkForShopifyEmbedding())
			initiateChat();
	}, [connectors, knowledgeBase]);

	useEffect(() => {
		if (!aiResponse || !aiLinks) return;

		setChatMessages([
			...chatMessages,
			...aiResponse?.map((msg) => {
				console.log(msg);
				return {
					key: generateRandomString(10),
					sentBy: 'AI',
					content: msg,
					msgTimestamp: new Date().toISOString(),
				};
			}),
		]);
	}, [aiResponse, aiLinks]);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [chatMessages]);

	const initiateChat = () => {
		const localChatId = localStorage.getItem('krispyDemoChatId');
		if (localChatId) {
			setChatId(localChatId);
			getChatMessages(localChatId);
		} else createChat();
	};

	const createChat = async () => {
		setChatLoading(true);
		const { chat } = await krispyAxios({
			method: 'POST',
			url: 'chats/demo/create',
		});
		chat && localStorage.setItem('krispyDemoChatId', chat);
		setChatId(chat);
		setChatMessages([]);
		setChatLoading(false);
	};

	const getChatMessages = async (createdChatId) => {
		setChatLoading(true);
		const { messages } = await krispyAxios({
			method: 'GET',
			url: `messages/chat/${createdChatId}`,
		});

		setChatMessages(messages);
		setChatLoading(false);
	};

	const sendMessage = async (e) => {
		e.preventDefault();

		if (newMessage.content.trim().length !== 0) {
			setNewMessageLoading(true);

			const workerId = localStorage.getItem('workerId');

			setChatMessages([
				...chatMessages,
				{
					key: newMessage.key,
					sentBy: 'CONTACT',
					content: newMessage.content,
					msgTimestamp: new Date().toISOString(),
				},
			]);

			console.log(newMessage.content);

			const { messages, links, plan } = await krispyAxios({
				method: 'POST',
				url: `chats/workspace/send-message/${workerId}/${chatId}`,
				body: {
					text: newMessage.content,
				},
			});

			if (plan) {
				setWorkerPlan(plan);
				localStorage.setItem('workerPlan', JSON.stringify(plan));
			}

			setAiResponse(messages);
			setAiLinks(links || []);
			setNewMessageLoading(false);
			new Audio('/sounds/message-sent-sound.mp3').play();
			setNewMessage({
				key: generateRandomString(10),
				content: '',
			});
		}
	};

	const onMsgChange = (e) => {
		setNewMessage({
			...newMessage,
			content: e.target.value,
		});
	};

	const checkForShopifyEmbedding = () => {
		// if (!knowledgeBase?.domain || knowledgeBase?.domain === "")
		//   return false;
		return true;
	};

	const renderTabContent = (currentTab) => {
		if (currentTab === 0) {
			return (
				<div className='plan-container my-2 text-sm flex flex-col gap-4 text-slate-600'>
					{workerPlan &&
						tabContent.map((item, index) => (
							<div
								key={index}
								className={`flex ${index === currentIndex ? 'fade-in' : ''}`}
							>
								<input
									type='checkbox'
									id={`item-${index}`}
									checked={workerPlan[item.key]}
								/>
								<label
									htmlFor={`item-${index}`}
									className='inline ml-2'
								>
									{item.text}
								</label>
							</div>
						))}
				</div>
			);
		} else if (currentTab === 1) {
			return (
				<div className='my-2 text-sm flex flex-col gap-4 text-slate-600'>
					Digital worker logs go here...
				</div>
			);
		}
	};

	return (
		<MainLayout>
			<Loader renderChildren={connectors && knowledgeBase}>
				{checkForShopifyEmbedding() ? (
					<div className='flex flex-row'>
						{/* <h2>AI Agent</h2>
              <p className="settings-subtext">
                Have a quick chat with your AI agent to test out it's
                capabilities. The AI agent has been trained on the data provided
                by you.
              </p> */}
						{/* <Divider
                sx={{
                  border: "none",
                  marginTop: "15px",
                  marginBottom: "15px",
                }}
              /> */}
						<div className='chat-box w-full ml-4 mr-4'>
							<div
								style={{
									height:
										preferences?.onboardingStep > 0
											? 'calc(-8rem + 100vh)'
											: 'calc(100vh - 250px)',
								}}
							>
								{chatLoading ? (
									<div className='empty-chat-container'>
										<p className='empty-chat-text'>Initiating chat...</p>
									</div>
								) : embeddingInProgress ? (
									<div className='empty-chat-container'>
										<p className='empty-chat-text'>
											Try again in a few seconds. Your Shopify data is being
											embedded.
										</p>
									</div>
								) : chatMessages && chatMessages?.length == 0 ? (
									<>
										<div className='flex flex-col py-20 items-center justify-evenly h-full text-center text-slate-600 text-sm'>
											<div className='flex flex-col'>
												<img
													width={150}
													src='/images/zoe.png'
													alt='Zoé image'
												/>
												<div className='flex flex-col'>
													<span>Thanks for checking in.</span>
													<span>How can I help?</span>
												</div>
											</div>
											<div className='grid grid-cols-2 grid-rows-2 gap-4 w-2/3'>
												{samplePrompts.map((prompt, index) => (
													<button
														type='button'
														className='flex items-center justify-center border border-slate-300 px-4 py-3 rounded-md'
														key={index}
														onClick={() =>
															setNewMessage({
																key: generateRandomString(10),
																content: prompt,
															})
														}
													>
														{prompt}
													</button>
												))}
											</div>
										</div>
										<div className='fixed bottom-0 left-0 right-0 mt-0 mr-4 mb-4 ml-20 '>
											<ChatInput
												onSubmit={sendMessage}
												inputValue={newMessage.content}
												isDisabled={newMessageLoading}
												onInputChange={onMsgChange}
												placeholder={'Message Zoé'}
											/>
										</div>
									</>
								) : (
									<div className='flex flex-col gap-2 items-stretch h-full'>
										<div className='flex gap-2 w-full h-full'>
											<div className='flex flex-col justify-between flex-1 border border-slate-300 rounded-lg p-2'>
												<div
													ref={chatContainerRef}
													className='overflow-auto scroll-smooth'
												>
													<p className='p-2 m-0 text-lg font-medium'>
														Chat title - summary of the question
													</p>
													<div className='p-2'>
														{chatMessages?.map((msg) => (
															<ChatThreadMessage
																message={msg}
																allMessages={chatMessages}
																messageLoading={newMessageLoading}
																messageLoadingKey={newMessage.key}
															/>
														))}
													</div>
												</div>
												<ChatInput
													onSubmit={sendMessage}
													inputValue={newMessage.content}
													isDisabled={newMessageLoading}
													onInputChange={onMsgChange}
													placeholder={'Message Zoé'}
												/>
											</div>
											<div className='flex-1 flex flex-col border border-slate-300 rounded-lg p-4 bg-slate-100'>
												<p className='m-0 text-lg font-medium'>
													Zoé's workspace
												</p>
												<div className='flex my-4 gap-4 text-sm font-medium'>
													{/* //! TABS component, need to make a separate component */}
													{tabs.map((tab, index) => (
														<div
															key={index}
															className={`p-2 cursor-pointer hover:!border-b-2 hover:border-orange-500 hover:text-orange-600 transition-all ease-in-out duration-100 ${
																activeTab === index
																	? '!border-b-2 border-orange-500 text-orange-600'
																	: 'text-slate-400'
															}`}
															onClick={() => setActiveTab(index)}
														>
															{tab}
														</div>
													))}
												</div>
												{renderTabContent(activeTab)}
												{/* //! TABS component, need to make a separate component */}
											</div>
										</div>
										<div className='flex gap-3 border border-slate-300 rounded-lg p-2 mb-2'>
											<button>
												<img
													src='/images/pause.svg'
													alt='pause button'
												/>
											</button>
											<button>
												<img
													src='/images/backward.svg'
													alt='backward button'
												/>
											</button>
											<button>
												<img
													src='/images/forward.svg'
													alt='forward button'
												/>
											</button>
											<button
												className={`${newMessageLoading ? 'blinking-dot' : ''}`}
											>
												<div
													className={`h-2.5 w-2.5 rounded-lg ${
														newMessageLoading
															? 'bg-orange-600'
															: 'bg-emerald-500'
													}`}
												></div>
											</button>
											<span>Live</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				) : (
					<div className='empty-chat-container h-screen'>
						<p className='empty-chat-text w-50 text-center'>
							You have not yet trained your AI agent on sufficient amount of
							data. Atleast train it on your
							<Link
								href='/settings/connected-apps'
								style={{
									color: 'rgba(253, 79, 2, 0.9)',
									margin: '0 5px 0 5px',
								}}
							>
								Shopify data
							</Link>
							to be able to demo it's capabilities!
						</p>
					</div>
				)}
			</Loader>
		</MainLayout>
	);
};

export default Demo;
