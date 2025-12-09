import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNodeId } from 'reactflow';
import { removeNode, updateNodeData } from '../../redux/actions/flow.actions';
import Input from '../@generalComponents/Input';
import NodeContainer from './NodeContainer';

const TextMessageNode = ({ data }) => {
	const dispatch = useDispatch();
	const nodeId = useNodeId();

	const [formState, setFormState] = useState({
		textMessage: data?.textMessage || '',
	});

	useEffect(() => {
		if (!formState || !nodeId || !formState.textMessage) return;
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

	const onNodeDelete = () => {
		dispatch(removeNode({ id: nodeId }));
	};

	return (
		<NodeContainer
			title={'Send message'}
			icon={{
				src: '/images/message-icon.svg',
				altText: 'Message icon',
			}}
			showDeleteButton={true}
			onDelete={onNodeDelete}
			handles={{
				showSourceHandle: true,
				showTargetHandle: true,
				allowedNodes: ['timeDelayNode', 'messageNode', 'textMessageNode'],
			}}
		>
			<div className='flex flex-col'>
				<label className='text-sm text-slate-400 mb-2'>Text message</label>
				<Input
					thin
					type='textarea'
					className='nodrag !m-0'
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

export default TextMessageNode;
