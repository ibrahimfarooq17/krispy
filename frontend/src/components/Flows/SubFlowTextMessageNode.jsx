import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Position, useNodeId } from 'reactflow';
import {
	removeSubFlowNode,
	updateSubFlowNodeData,
} from '../../redux/actions/subFlow.actions';
import generateRandomString from '../../utilities/generateRandomString';
import Input from '../@generalComponents/Input';
import CustomHandle from './CustomHandle';
import NodeContainer from './NodeContainer';

const SubFlowTextMessageNode = ({ data }) => {
	const dispatch = useDispatch();
	const nodeId = useNodeId();

	const [formState, setFormState] = useState({
		textMessage: data?.textMessage || '',
	});

	useEffect(() => {
		if (!formState || !nodeId || !formState.textMessage) return;
		dispatch(
			updateSubFlowNodeData({
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

	const onNodeDelete = () => {
		dispatch(removeSubFlowNode({ id: nodeId }));
	};

	return (
		<NodeContainer
			title={'Send text message'}
			icon={{
				src: '/images/message-icon.svg',
				altText: 'Message icon',
			}}
			showDeleteButton={true}
			onDelete={onNodeDelete}
			handles={{
				showSourceHandle: false,
				showTargetHandle: true,
			}}
		>
			<div className='flex flex-col'>
				<label className='text-sm text-slate-400 mb-2'>Text message</label>
				<Input
					thin
					type='textarea'
					className='nodrag'
					name='textMessage'
					rows={4}
					maxRows={4}
					value={formState.textMessage}
					onChange={changeHandler}
				/>
			</div>
		</NodeContainer>
	);
};

export default SubFlowTextMessageNode;
