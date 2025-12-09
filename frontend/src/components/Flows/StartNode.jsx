import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNodeId } from 'reactflow';
import { updateNodeData } from '../../redux/actions/flow.actions';
import Input from '../@generalComponents/Input';
import NodeContainer from './NodeContainer';

const StartNode = ({ data }) => {
	const dispatch = useDispatch();
	const nodeId = useNodeId();
	const { flowId } = useParams();

	const [formState, setFormState] = useState({
		triggerType: data?.triggerType || 'SHOPIFY_ORDER_RECEIVED',
		textToMatch: data?.textToMatch || '',
	});

	const currentUser = useSelector((state) => state.userReducer.currentUser);

	useEffect(() => {
		if (!formState || !nodeId) return;
		dispatch(
			updateNodeData({
				id: nodeId,
				data: formState,
			})
		);
	}, [dispatch, nodeId, formState]);

	const changeHandler = (event) => {
		const { name, value } = event?.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	return (
		<NodeContainer
			title={'Flow trigger'}
			icon={{
				src: '/images/zap.svg',
				altText: 'Zap icon',
			}}
			showDeleteButton={false}
			handles={{
				showSourceHandle: true,
				showTargetHandle: false,
				allowedNodes: ['timeDelayNode'],
			}}
		>
			<div className='flex flex-col gap-2'>
				<label className='text-sm text-slate-400'>Trigger event/source</label>
				<Input
					thin
					type='select'
					className='nodrag m-0'
					name='triggerType'
					options={[
						{
							label: 'Shopify Order Received',
							value: 'SHOPIFY_ORDER_RECEIVED',
						},
						{
							label: 'Shopify Abandoned Checkout',
							value: 'SHOPIFY_ABANDONED_CHECKOUT',
						},
						{
							label: 'Matched Message',
							value: 'MATCHED_MESSAGE',
						},
						{
							label: 'Klaviyo Webhook',
							value: 'KLAVIYO_WEBHOOK',
						},
					]}
					value={formState.triggerType}
					onChange={changeHandler}
				/>
			</div>
			{formState.triggerType === 'MATCHED_MESSAGE' && (
				<div className='flex flex-col'>
					<label className='text-sm text-slate-400'>
						Text to match
						<Input
							thin
							type='text'
							className='nodrag m-0 mt-2'
							name='textToMatch'
							value={formState.textToMatch}
							onChange={changeHandler}
						/>
					</label>
				</div>
			)}
			{formState.triggerType === 'KLAVIYO_WEBHOOK' && flowId && (
				<div
					// className='nodrag'
					onClick={() => {
						navigator.clipboard.writeText(
							`https://hooks.krispy.ai/webhooks/klaviyo-trigger/${currentUser?.entity?.entityId}/${flowId}`
						);
						toast.success('URL copied!');
					}}
				>
					<p className='f-xs-regular grey mb-1'>
						This event can be triggered via the following url. Click to copy.
					</p>
					<code className='f-xs-regular black'>
						{`https://hooks.krispy.ai/webhooks/klaviyo-trigger/${currentUser?.entity?.entityId}/${flowId}`}
					</code>
				</div>
			)}
		</NodeContainer>
	);
};

export default StartNode;
