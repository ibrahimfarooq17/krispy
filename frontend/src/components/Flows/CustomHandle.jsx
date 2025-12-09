import Menu from '@mui/material/Menu';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Handle, getNodesBounds, useNodeId } from 'reactflow';
import { addEdge, addNode } from '../../redux/actions/flow.actions';
import {
	addSubFlowEdge,
	addSubFlowNode,
} from '../../redux/actions/subFlow.actions';
import generateRandomString from '../../utilities/generateRandomString';
import NodeContainer from './NodeContainer';

const CustomHandle = ({ allowedNodes, isSubFLow, ...props }) => {
	const dispatch = useDispatch();
	const nodeId = useNodeId();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const nodes = useSelector((state) => state.flowReducer.nodes);
	const subFlowNodes = useSelector(
		(state) => state.subFlowReducer.currentSubFlow.nodes
	);

	const handleMenuClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const addNewAction = (nodeType, nodeData) => {
		const bounds = getNodesBounds(subFlowNodes);

		const newNodeId = generateRandomString(20);
		if (isSubFLow) {
			const currentNode = subFlowNodes?.find((node) => node.id === nodeId);
			dispatch(
				addSubFlowNode({
					id: newNodeId,
					type: nodeType,
					width: 256,
					position: {
						x: bounds.width + 100,
						y: bounds.y,
					},
					data: nodeData,
				})
			);
			dispatch(
				addSubFlowEdge({
					id: `e${currentNode.id}-${newNodeId}`,
					source: currentNode.id,
					target: newNodeId,
				})
			);
		} else {
			const currentNode = nodes?.find((node) => node.id === nodeId);
			dispatch(
				addNode({
					id: newNodeId,
					type: nodeType,
					position: {
						x: currentNode.position.x + 300,
						y: currentNode.position.y,
					},
					data: nodeData,
				})
			);
			dispatch(
				addEdge({
					id: `e${currentNode.id}-${newNodeId}`,
					source: currentNode.id,
					target: newNodeId,
				})
			);
		}
		handleMenuClose();
	};

	return (
		<React.Fragment>
			<Handle
				{...props}
				onClick={handleMenuClick}
				className={`${
					props.position === 'right' ? '!cursor-pointer' : '!cursor-default'
				}`}
			/>
			{props.position === 'right' && (
				<Menu
					id='long-menu'
					anchorEl={anchorEl}
					open={open}
					onClose={handleMenuClose}
					sx={{
						'& .MuiMenu-list': {
							padding: 0,
						},
						'& .MuiMenu-paper': {
							minWidth: '200px',
							borderRadius: '8px',
							border: '1px solid #ECECEC',
							boxShadow:
								'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(226, 232, 240) 0px 4px 6px -1px, rgb(226, 232, 240) 0px 2px 4px -2px !important',
						},
					}}
				>
					<NodeContainer
						title={'Choose node to add'}
						icon={{
							src: '/images/zap.svg',
							altText: 'Zap icon',
						}}
						showDeleteButton={false}
						handles={{
							showSourceHandle: false,
							showTargetHandle: false,
						}}
					>
						{allowedNodes?.includes('timeDelayNode') && (
							<button
								className='flex gap-2 p-1.5 !pl-0 items-center rounded-md hover:bg-slate-100 hover:!pl-2 hover:!border-l-2 hover:border-orange-500 hover:rounded-l-none transition-all ease-in-out duration-150'
								onClick={() =>
									addNewAction('timeDelayNode', {
										units: '1',
										interval: 'days',
									})
								}
							>
								<img
									src='/images/clock-icon.svg'
									width={20}
									height={20}
									alt='Clock icon'
								/>
								<p className='m-0 text-slate-700'>Time delay</p>
							</button>
						)}
						{allowedNodes?.includes('messageNode') && (
							<button
								className='flex gap-2 p-1.5 !pl-0 items-center rounded-md hover:bg-slate-100 hover:!pl-2 hover:!border-l-2 hover:border-orange-500 hover:rounded-l-none transition-all ease-in-out duration-150'
								onClick={() => addNewAction('messageNode')}
							>
								<img
									src='/images/message-icon.svg'
									width={20}
									height={20}
									alt='Message icon'
								/>
								<p className='m-0 text-slate-700'>Template Message</p>
							</button>
						)}
						{allowedNodes?.includes('subFlowTemplateNode') && (
							<button
								className='flex gap-2 p-1.5 !pl-0 items-center rounded-md hover:bg-slate-100 hover:!pl-2 hover:!border-l-2 hover:border-orange-500 hover:rounded-l-none transition-all ease-in-out duration-150'
								onClick={() => addNewAction('subFlowTemplateNode')}
							>
								<img
									src='/images/message-icon.svg'
									width={20}
									height={20}
									alt='Message icon'
								/>
								<p className='m-0 text-slate-700'>Template Message</p>
							</button>
						)}
						{allowedNodes?.includes('textMessageNode') && (
							<button
								className='flex gap-2 p-1.5 !pl-0 items-center rounded-md hover:bg-slate-100 hover:!pl-2 hover:!border-l-2 hover:border-orange-500 hover:rounded-l-none transition-all ease-in-out duration-150'
								onClick={() => addNewAction('textMessageNode')}
							>
								<img
									src='/images/message-icon.svg'
									width={20}
									height={20}
									alt='Message icon'
								/>
								<p className='m-0 text-slate-700'>Text Message</p>
							</button>
						)}
						{allowedNodes?.includes('subFlowTextMessageNode') && (
							<button
								className='flex gap-2 p-1.5 !pl-0 items-center rounded-md hover:bg-slate-100 hover:!pl-2 hover:!border-l-2 hover:border-orange-500 hover:rounded-l-none transition-all ease-in-out duration-150'
								onClick={() => addNewAction('subFlowTextMessageNode')}
							>
								<img
									src='/images/message-icon.svg'
									width={20}
									height={20}
									alt='Message icon'
								/>
								<p className='m-0 text-slate-700'>Text Message</p>
							</button>
						)}
					</NodeContainer>
				</Menu>
			)}
		</React.Fragment>
	);
};

export default CustomHandle;
