import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNodeId } from 'reactflow';
import { removeNode, updateNodeData } from '../../redux/actions/flow.actions';
import Input from '../@generalComponents/Input';
import NodeContainer from './NodeContainer';

const TimeDelayNode = ({ data }) => {
	const dispatch = useDispatch();
	const nodeId = useNodeId();

	const [formState, setFormState] = useState({
		units: data?.units || '1',
		interval: data?.interval || 'days',
	});

	const nodes = useSelector((state) => state.flowReducer.nodes);
	const triggerType = nodes?.find((node) => node?.type === 'startNode')?.data
		?.triggerType;

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

	const onNodeDelete = () => {
		dispatch(removeNode({ id: nodeId }));
	};

	return (
		<NodeContainer
			title={'Delay'}
			icon={{
				src: '/images/clock-icon.svg',
				altText: 'Clock icon',
			}}
			showDeleteButton={true}
			onDelete={onNodeDelete}
			handles={{
				showSourceHandle: true,
				showTargetHandle: true,
				allowedNodes: ['messageNode', 'textMessageNode'],
			}}
		>
			<div className='flex'>
				<label
					className='text-sm text-slate-400'
					htmlFor='units'
				>
					Wait for
					<div className='flex mt-2'>
						<Input
							thin
							type='text'
							name='units'
							id='units'
							className='nodrag !w-2/4 !mr-2 !mb-0'
							value={formState.units}
							onChange={changeHandler}
						/>
						<Input
							thin
							type='select'
							name='interval'
							className='nodrag flex-1 !mb-0'
							options={[
								{
									label: 'Days',
									value: 'days',
								},
								{
									label: 'Hours',
									value: 'hours',
								},
							]}
							value={formState.interval}
							onChange={changeHandler}
						/>
					</div>
				</label>
			</div>
		</NodeContainer>
	);
};

export default TimeDelayNode;
