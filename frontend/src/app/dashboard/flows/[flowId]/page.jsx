'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ReactFlow, { Background, Controls, ReactFlowProvider } from 'reactflow';
import CustomButton from '../../../../components/@generalComponents/CustomButton';
import Loader from '../../../../components/@generalComponents/Loader';
import SubFlow from '../../../../components/Flows/SubFlow';
import { useNodeTypes } from '../../../../hooks/useNodeTypes';
import MainLayout from '../../../../layout/MainLayout';
import {
	addEdge,
	removeEdge,
	removeNode,
	resetEdges,
	resetNodes,
	setEdges,
	setFlowAnalytics,
	setNodes,
	updateNodePosition,
} from '../../../../redux/actions/flow.actions';
import {
	removeSubFlow,
	resetAllSubFlows,
	resetCurrentSubFlowEdges,
	resetCurrentSubFlowNodes,
	setAllSubFlows,
} from '../../../../redux/actions/subFlow.actions';
import krispyAxios from '../../../../utilities/krispyAxios';

const UpdateFlow = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { flowId } = useParams();
	const nodeTypes = useNodeTypes();

	const [resLoading, setResLoading] = useState(false);
	const [flowName, setFlowName] = useState();
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [subFlowsToDelete, setSubFlowsToDelete] = useState([]);

	const templateId = searchParams.get('templateId');
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

	useEffect(() => {
		if (!flowId) return;
		getFlow();
	}, [flowId]);

	const getFlow = async () => {
		const { flow } = await krispyAxios({
			method: 'GET',
			url: `flows/${flowId}`,
		});

		dispatch(setNodes(flow?.tree?.nodes));
		dispatch(setEdges(flow?.tree?.edges));
		dispatch(
			setFlowAnalytics({
				analytics: {
					openRate: flow?.openRate,
					ctaClicks: flow?.ctaClicks,
					orderMetrics: flow?.orderMetrics,
				},
			})
		);
		setFlowName(flow?.name);

		const { subFlows } = flow;
		const allSubFlows = [];
		for (let subFlow of subFlows) {
			allSubFlows.push({
				...subFlow.tree,
				flowId: subFlow.subFlowsId,
			});
		}

		dispatch(setAllSubFlows(allSubFlows));
	};

	const onNodesChange = (changes) => {
		const change = changes?.[0];
		if (change.type === 'position' && change.dragging)
			dispatch(
				updateNodePosition({ id: change.id, position: change.position })
			);
		if (change.type === 'remove' && !templateId) {
			const nodeIdToDelete = change.id;
			dispatch(removeNode({ id: nodeIdToDelete }));
			dispatch(removeSubFlow({ id: nodeIdToDelete }));

			const subFlowIdToDelete = allSubFlows.find(
				(subFlow) => subFlow?.startNode === nodeIdToDelete
			);
			if (subFlowIdToDelete?.flowId) {
				setSubFlowsToDelete([...subFlowsToDelete, subFlowIdToDelete.flowId]);
			}
		}
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

		const triggerType = nodes?.find((node) => node?.type === 'startNode')?.data
			?.triggerType;
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

		const saveSubFlows = async () => {
			if (allSubFlows.length === 0) {
				router.push('/dashboard/flows');
			}

			let allSubFlowsToDelete = [...subFlowsToDelete];

			const subFlowsToDeleteFromLocalStorage =
				localStorage.getItem('subFlowsToDelete');
			if (subFlowsToDeleteFromLocalStorage) {
				const subFlowsToDeleteParsed = JSON.parse(
					subFlowsToDeleteFromLocalStorage
				);
				allSubFlowsToDelete = [
					...allSubFlowsToDelete,
					...subFlowsToDeleteParsed,
				];
			}

			if (allSubFlowsToDelete.length > 0) {
				for (let subFlowId of allSubFlowsToDelete) {
					console.log(subFlowId);
					await krispyAxios({
						method: 'DELETE',
						url: `flows/${subFlowId}`,
					});
				}
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

				if (!subFlow.flowId) {
					await krispyAxios({
						method: 'POST',
						url: 'flows',
						body: {
							name: `${flowName} - ${parentNode}`,
							parentFlowId: flowId,
							tree: subFlow,
							trigger: 'CTA',
							isActive: true,
							actions: actions,
						},
						loadingStateSetter: setResLoading,
						// loadingMessage: 'Finishing up...',
						successMessage: 'Changes saved successfully!',
						onSuccess: () => router.push('/dashboard/flows'),
					});
				} else {
					await krispyAxios({
						method: 'PATCH',
						url: `flows/${subFlow.flowId}`,
						body: {
							name: `${flowName} - ${parentNode}`,
							parentFlowId: flowId,
							tree: subFlow,
							trigger: 'CTA',
							isActive: true,
							actions: actions,
						},
						loadingStateSetter: setResLoading,
						// loadingMessage: 'Finishing up...',
						successMessage: 'Changes saved successfully!',
						onSuccess: () => router.push('/dashboard/flows'),
					});
				}
			}
			localStorage.removeItem('subFlowsToDelete');
		};

		await krispyAxios({
			method: 'PATCH',
			url: `flows/${flowId}`,
			body: {
				name: flowName,
				isActive: true,
				trigger: triggerType,
				actions: actions,
				tree: { nodes, edges },
			},
			loadingStateSetter: setResLoading,
			loadingMessage: 'Saving changes...',
			// successMessage: 'Flow saved.',
			onSuccess: () => saveSubFlows(),
		});
	};

	return (
		<MainLayout>
			<Loader renderChildren={flowName && nodes?.length > 1}>
				<div className='flex flex-row justify-between items-center px-3 py-2'>
					<input
						className='font-medium flex-1 p-0 !pl-3 border-l-4 border-orange-400 focus:outline-none'
						value={flowName}
						onChange={(e) => setFlowName(e?.target?.value)}
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
								label='Save'
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
										nodeTypes={nodeTypes}
										nodes={nodes}
										edges={edges}
										onNodesChange={onNodesChange}
										onEdgesChange={onEdgesChange}
										onConnect={onConnect}
									>
										<Controls />
										<Background
											id='main-flow'
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
			</Loader>
		</MainLayout>
	);
};

export default UpdateFlow;
