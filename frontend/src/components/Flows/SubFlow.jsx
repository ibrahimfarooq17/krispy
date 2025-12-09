import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, { Background, Controls, ReactFlowProvider } from 'reactflow';
import { useNodeTypes } from '../../hooks/useNodeTypes';
import {
	addSubFlowEdge,
	removeSubFlowNode,
	resetCurrentSubFlowEdges,
	resetCurrentSubFlowNodes,
	saveSubFlow,
	setCurrentSubFlow,
	updateSubFlowNodePosition,
} from '../../redux/actions/subFlow.actions';
import getChildNodeIds from '../../utilities/getChildNodeIds';

const SubFlow = ({ isFullScreen, setIsFullScreen, router }) => {
	const nodeTypes = useNodeTypes();
	const dispatch = useDispatch();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const subFlowNodes = useSelector(
		(state) => state.subFlowReducer.currentSubFlow.nodes
	);
	const subFlowEdges = useSelector(
		(state) => state.subFlowReducer.currentSubFlow.edges
	);
	const currentSubFlow = useSelector(
		(state) => state.subFlowReducer.currentSubFlow
	);

	useEffect(() => {
		return () => {
			dispatch(resetCurrentSubFlowEdges());
			dispatch(resetCurrentSubFlowNodes());
		};
	}, []);

	useEffect(() => {
		const nodeId = searchParams.get('nodeId');
		if (nodeId) {
			dispatch(setCurrentSubFlow({ startNode: nodeId }));
		}
	}, [searchParams]);

	const getChildNodes = (parentId) => {
		const childNodes = subFlowNodes.filter(
			(node) => node.parentId === parentId
		);

		return childNodes;
	};

	const getNode = (nodeId) => {
		return subFlowNodes.find((node) => node.id === nodeId);
	};

	const onSubFlowNodesChange = (subFlowChanges) => {
		const change = subFlowChanges?.[0];
		if (change.type === 'position' && change.dragging) {
			const node = getNode(change.id);
			if (node.parentId) {
				return;
			}

			dispatch(
				updateSubFlowNodePosition({ id: change.id, position: change.position })
			);

			const parentNode = getNode(change.id);
			const childNodes = getChildNodes(change.id);
			const parentHeight = parentNode.height;
			let previousNodeInfo = {
				height: 58,
				position: {
					y: 0,
				},
			};

			for (let childNode of childNodes) {
				let newYPosition =
					previousNodeInfo.position.y === 0
						? change.position.y + parentHeight + 10
						: previousNodeInfo.position.y + previousNodeInfo.height + 10;

				dispatch(
					updateSubFlowNodePosition({
						id: childNode.id,
						position: {
							x: change.position.x,
							y: newYPosition,
						},
					})
				);

				previousNodeInfo = {
					height: 58,
					position: {
						y: newYPosition,
					},
				};
			}
		}
		if (change.type === 'remove') {
			const nodeToBeRemoved = change.id;
			const startNode = subFlowNodes.find(
				(node) => node.type === 'subFlowStartNode'
			);

			if (nodeToBeRemoved === startNode.id) {
				toast.error('Start node cannot be removed.');
				return;
			}

			const startNodeButtons = subFlowNodes.filter(
				(node) => node?.parentId === startNode.id
			);

			for (let startNodeButton of startNodeButtons) {
				if (nodeToBeRemoved === startNodeButton.id) {
					toast.error('Start node buttons cannot be removed.');
					return;
				}
			}

			dispatch(removeSubFlowNode({ id: nodeToBeRemoved }));
			const childNodes = getChildNodeIds(nodeToBeRemoved, subFlowNodes);

			for (let childNode of childNodes) {
				dispatch(removeSubFlowNode({ id: childNode.id }));
			}
		}
		return;
	};

	// const onSubFlowEdgesChange = (changes) => {
	// 	const change = changes?.[0];
	// 	if (change.type === 'remove')
	// 		dispatch(removeSubFlowEdge({ id: change.id }));
	// };

	const onSubFlowConnect = (params) => {
		dispatch(
			addSubFlowEdge({
				id: `e${params.source}-${params.target}`,
				source: params.source,
				target: params.target,
			})
		);
	};

	const onSaveSubFlow = () => {
		const startNode = searchParams.get('nodeId');

		const templateNodes = currentSubFlow.nodes.filter(
			(node) => node.type === 'subFlowTemplateNode'
		);

		const textMessageNodes = currentSubFlow.nodes.filter(
			(node) => node.type === 'subFlowTextMessageNode'
		);

		// if template nodes do not have any template selected, subflow should not be saved
		for (let templateNode of templateNodes) {
			if (!templateNode.data) {
				toast.error('Please select a template.');
				return;
			}
		}

		for (let textMessageNode of textMessageNodes) {
			if (!textMessageNode.data?.textMessage?.trim()) {
				toast.error('Text message node cannot be empty.');
				return;
			}
		}

		const actionNodes = currentSubFlow.nodes.filter(
			(node) =>
				node.type === 'subFlowTemplateNode' ||
				node.type === 'subFlowTextMessageNode'
		);

		// if there are no template nodes or text message nodes, subflow is empty, should not be saved
		if (actionNodes.length === 0) {
			toast.error(
				'Subflow cannot be empty. Please add a template or text message.'
			);
			return;
		}

		router.push(pathname);
		setIsFullScreen(false);
		dispatch(
			saveSubFlow({
				startNode: startNode,
				...currentSubFlow,
			})
		);
		toast.success('Subflow saved successfully.');
	};

	return (
		<>
			<div className='h-full flex-1 !border rounded-md relative'>
				<ReactFlowProvider disabled='true'>
					<ReactFlow
						id='sub-flow'
						nodeTypes={nodeTypes}
						nodes={subFlowNodes}
						edges={subFlowEdges}
						onNodesChange={onSubFlowNodesChange}
						// onEdgesChange={onSubFlowEdgesChange}
						onConnect={onSubFlowConnect}
					>
						<Controls />
						<Background
							id='sub-flow-bg'
							variant='dots'
							gap={24}
							size={4}
							color='#e2e8f0'
							className='bg-slate-50'
						/>
					</ReactFlow>
				</ReactFlowProvider>
				<div>
					<button
						className='group absolute top-0 bottom-0 -left-0.5 h-fit my-auto bg-white text-slate-800 pl-2.5 pr-3 py-4 rounded-md rounded-l-none !border !border-l-0'
						onClick={() => {
							isFullScreen ? setIsFullScreen(false) : setIsFullScreen(true);
						}}
					>
						<img
							src={
								isFullScreen
									? '/images/double-right.svg'
									: '/images/double-left.svg'
							}
							alt={isFullScreen ? 'double right icon' : 'double left icon'}
							width={16}
							className={`${
								isFullScreen
									? 'group-hover:translate-x-1'
									: 'group-hover:-translate-x-1'
							} ease-in-out duration-150`}
						/>
					</button>
				</div>
				<div className='absolute top-0 right-0 flex gap-2 z-10 text-sm m-2 bg-white p-2 !border rounded-md'>
					<button
						className='text-white bg-slate-600 p-2 rounded-md !border hover:bg-slate-500 ease-in-out duration-100'
						onClick={onSaveSubFlow}
					>
						Save sub-flow
					</button>
					<button
						onClick={() => {
							router.push(pathname);
							setIsFullScreen(false);
						}}
						className='bg-slate-50 text-slate-800 p-2 rounded-md !border hover:bg-slate-200 ease-in-out duration-100'
					>
						Close
					</button>
				</div>
			</div>
		</>
	);
};

export default SubFlow;
