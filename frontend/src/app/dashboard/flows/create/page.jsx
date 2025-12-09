'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, { Background, Controls, ReactFlowProvider } from 'reactflow';
import CustomButton from '../../../../components/@generalComponents/CustomButton';
import SubFlow from '../../../../components/Flows/SubFlow';
import { useNodeTypes } from '../../../../hooks/useNodeTypes';
import MainLayout from '../../../../layout/MainLayout';
import {
	addEdge,
	removeEdge,
	removeNode,
	resetEdges,
	resetNodes,
	updateNodePosition,
} from '../../../../redux/actions/flow.actions';
import {
	removeSubFlow,
	resetAllSubFlows,
	resetCurrentSubFlowEdges,
	resetCurrentSubFlowNodes,
} from '../../../../redux/actions/subFlow.actions';
import krispyAxios from '../../../../utilities/krispyAxios';

const CreateFlow = () => {
	const dispatch = useDispatch();
	const nodeTypes = useNodeTypes();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const templateId = searchParams.get('templateId');

	const [resLoading, setResLoading] = useState(false);
	const [triggerName, setTriggerName] = useState('');
	const [isFullScreen, setIsFullScreen] = useState(false);

	const nodes = useSelector((state) => state.flowReducer.nodes);
	const edges = useSelector((state) => state.flowReducer.edges);
	const allSubFlows = useSelector(
		(state) => state.subFlowReducer.allSubFlows.subFlows
	);

	useEffect(() => {
		return () => {
			dispatch(resetNodes());
			dispatch(resetEdges());
			dispatch(resetAllSubFlows());
			dispatch(resetCurrentSubFlowNodes());
			dispatch(resetCurrentSubFlowEdges());
		};
	}, []);

	const onNodesChange = (changes) => {
		const change = changes?.[0];
		if (change.type === 'position' && change.dragging)
			dispatch(
				updateNodePosition({ id: change.id, position: change.position })
			);
		if (change.type === 'remove' && !templateId) {
			dispatch(removeNode({ id: change.id }));
			dispatch(removeSubFlow({ id: change.id }));
			if (templateId) router.push(pathname);
		}
		return;
	};

	const onEdgesChange = (changes) => {
		const change = changes?.[0];
		if (change.type === 'remove' && !templateId)
			dispatch(removeEdge({ id: change.id }));
	};

	const onConnect = (params) => {
		dispatch(
			addEdge({
				id: `e${params.source}-${params.target}`,
				source: params.source,
				target: params.target,
			})
		);
	};

	const getTargetNode = (sourceNodeId, nodes, edges) => {
		const targetNodeId = edges?.find(
			(edge) => edge?.source === sourceNodeId
		)?.target;
		return nodes?.find((node) => node?.id === targetNodeId);
	};

	const saveFlow = async () => {
		const actions = [];
		const startNode = nodes?.find((node) => node?.type === 'startNode');

		for (let node of nodes) {
			if (node?.type !== 'timeDelayNode') {
				if (!node.data || node.data?.textMessage?.trim() === '') {
					const errorMessage =
						node?.type === 'messageNode'
							? 'Please select a template.'
							: 'Text message cannot be empty.';
					toast.error(errorMessage);
					return;
				}
				continue;
			}
			const nextNode = getTargetNode(node?.id, nodes, edges);
			const lastAction = actions?.[actions.length - 1];
			if (!lastAction)
				actions.push({
					...nextNode?.data,
					type:
						nextNode?.type === 'textMessageNode'
							? 'REPLY_TEXT'
							: 'REPLY_TEMPLATE',
					delay: {
						days:
							node?.data?.interval === 'hours'
								? 0
								: parseFloat(node?.data?.units),
						hours:
							node?.data?.interval === 'days'
								? 0
								: parseFloat(node?.data?.units),
					},
				});
			else
				actions.push({
					...nextNode?.data,
					type:
						nextNode?.type === 'textMessageNode'
							? 'REPLY_TEXT'
							: 'REPLY_TEMPLATE',
					delay: {
						days:
							node?.data?.interval === 'hours'
								? lastAction?.delay?.days
								: parseFloat(node?.data?.units) + lastAction?.delay?.days,
						hours:
							node?.data?.interval === 'days'
								? lastAction?.delay?.hours
								: parseFloat(node?.data?.units) + lastAction?.delay?.hours,
					},
				});
		}

		const createSubFlows = async ({ flowId }) => {
			if (allSubFlows.length === 0) {
				toast.success('Flow created successfully!');
				router.push('/dashboard/flows');
			}
			for (let subFlow of allSubFlows) {
				const { startNode: parentNode, nodes, edges } = subFlow;
				const actions = [];

				for (let node of nodes) {
					if (node?.type !== 'buttonNode') continue;
					if (node?.data?.url) continue;

					const nextNode = getTargetNode(node?.id, nodes, edges);
					if (!nextNode) continue;

					actions.push({
						...nextNode.data,
						ctaId: node.data.id,
						type:
							nextNode.type === 'subFlowTemplateNode'
								? 'REPLY_TEMPLATE'
								: 'REPLY_TEXT',
						delay: {
							days: 0,
							hours: 0,
						},
					});
				}

				await krispyAxios({
					method: 'POST',
					url: 'flows',
					body: {
						name: `${triggerName} - ${parentNode}`,
						parentFlowId: flowId,
						tree: subFlow,
						trigger: 'CTA',
						isActive: true,
						actions: actions,
					},
					loadingStateSetter: setResLoading,
					// loadingMessage: 'Finishing up...',
					successMessage: 'Flow created successfully!',
					onSuccess: () => router.push('/dashboard/flows'),
				});
			}
		};

		await krispyAxios({
			method: 'POST',
			url: `flows`,
			body: {
				name: triggerName,
				isActive: true,
				trigger: startNode?.data?.triggerType,
				actions: actions,
				tree: { nodes, edges },
				...(startNode?.data?.triggerType === 'MATCHED_MESSAGE' && {
					metadata: {
						textToMatch: startNode?.data?.textToMatch,
					},
				}),
			},
			loadingStateSetter: setResLoading,
			loadingMessage: 'Creating flow...',
			// successMessage: 'Saving subflows...',
			onSuccess: ({ flow }) => createSubFlows(flow),
			onError: (data) => console.log(data),
		});
	};

	return (
		<MainLayout>
			<div className='flex flex-row justify-between items-center px-3 py-2'>
				<input
					placeholder='Name the flow here'
					className='font-medium focus:outline-none flex-1 p-0 !pl-3 border-l-4 border-orange-400'
					value={triggerName}
					onChange={(e) => setTriggerName(e?.target?.value)}
				/>
				<div className='flex gap-4'>
					<button
						onClick={() => router.push('/dashboard/flows')}
						className='px-3 py-2 bg-slate-100 rounded-md flex items-center gap-2 hover:bg-slate-200 ease-in-out duration-100'
					>
						<img
							src='/images/arrow-left-icon.svg'
							alt='left arrow icon'
						/>
						Back to all flows
					</button>
					<div>
						<CustomButton
							type='medium-purple'
							label='Launch'
							icon={
								<img
									src='/images/rocket-icon.svg'
									width={20}
									height={20}
									alt='Rocket icon'
								/>
							}
							loading={resLoading}
							onClick={saveFlow}
						/>
					</div>
				</div>
			</div>

			{templateId === null ? (
				<div
					className='flex px-3 pt-2'
					style={{
						height: 'calc(100vh - 152px)',
					}}
				>
					<div className='flex-1 !border rounded-md'>
						<ReactFlowProvider>
							<ReactFlow
								id='main-flow'
								nodeTypes={nodeTypes}
								nodes={nodes}
								edges={edges}
								onNodesChange={onNodesChange}
								onEdgesChange={onEdgesChange}
								onConnect={onConnect}
							>
								<Controls />
								<Background
									id='main'
									variant='dots'
									gap={24}
									size={4}
									color='#e2e8f0'
								/>
							</ReactFlow>
						</ReactFlowProvider>
					</div>
				</div>
			) : (
				<div
					className='flex px-3 py-2 gap-3'
					style={{
						height: 'calc(100vh - 152px)',
					}}
				>
					{!isFullScreen && (
						<div className='flex-1 !border rounded-md'>
							<ReactFlowProvider>
								<ReactFlow
									id='main-flow'
									nodeTypes={nodeTypes}
									nodes={nodes}
									edges={edges}
									onNodesChange={onNodesChange}
									onEdgesChange={onEdgesChange}
									onConnect={onConnect}
								>
									<Controls />
									<Background
										id='main-flow-bg'
										variant='dots'
										gap={24}
										size={4}
										color='#e2e8f0'
									/>
								</ReactFlow>
							</ReactFlowProvider>
						</div>
					)}
					<div className='flex-1'>
						<SubFlow
							isFullScreen={isFullScreen}
							setIsFullScreen={setIsFullScreen}
							router={router}
						/>
					</div>
				</div>
			)}
		</MainLayout>
	);
};

export default CreateFlow;
