import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNodeId } from 'reactflow';
import {
	removeNode,
	setFlowAnalytics,
	updateNodeData,
} from '../../redux/actions/flow.actions';
import { removeSubFlow } from '../../redux/actions/subFlow.actions';
import { getAllTemplates } from '../../redux/actions/template.actions';
import getTemplateById from '../../utilities/getTemplateById';
import Input from '../@generalComponents/Input';
import Spinner from '../@generalComponents/Spinner';
import NodeContainer from './NodeContainer';
import RenderTemplate from './RenderTemplate';
import roundToTwoDecimals from '../../utilities/roundToTwoDecimals';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const TemplateNode = ({ data }) => {
	const dispatch = useDispatch();
	const nodeId = useNodeId();
	const searchParams = useSearchParams();
	const [formState, setFormState] = useState({
		template: data?.template || '',
	});
	const [currentTemplate, setCurrentTemplate] = useState({});
	const [hasSubFlow, setHasSubFlow] = useState();
	const [viewPerformance, setViewPerformance] = useState(false);
	const [templateAnalytics, setTemplateAnalytics] = useState();

	const templateIdFromParams = searchParams.get('templateId');
	const templates = useSelector((state) => state.templateReducer.allTemplates);
	const subFlows = useSelector(
		(state) => state.subFlowReducer.allSubFlows.subFlows
	);
	const flowAnalytics = useSelector((state) => state.flowReducer.analytics);

	console.log(templateAnalytics);

	useEffect(() => {
		if (!templates) dispatch(getAllTemplates());
	}, [templates]);

	useEffect(() => {
		if (!flowAnalytics || !currentTemplate?.templateId) return;
		const openRate = flowAnalytics?.openRate?.find(
			(obj) => obj?.templateId == currentTemplate?.templateId
		);
		const ctaClicks = flowAnalytics?.ctaClicks?.find(
			(obj) => obj?.templateId == currentTemplate?.templateId
		);
		const orderMetrics = flowAnalytics?.orderMetrics?.find(
			(obj) => obj?.templateId == currentTemplate?.templateId
		);
		setTemplateAnalytics({ openRate, ctaClicks, orderMetrics });
	}, [flowAnalytics, currentTemplate]);

	useEffect(() => {
		if (
			(templateIdFromParams &&
				Object.keys(currentTemplate).length === 0 &&
				formState.template !== '') ||
			formState.template
		) {
			const templateId = formState.template
				? formState.template
				: templateIdFromParams;

			if (templates) setCurrentTemplate(getTemplateById(templates, templateId));
			doesHaveSubFlow();
		}
	}, [templates, templateIdFromParams]);

	useEffect(() => {
		if (!formState || !nodeId || !formState.template) return;
		dispatch(
			updateNodeData({
				id: nodeId,
				data: formState,
			})
		);
	}, [dispatch, nodeId, formState]);

	const changeHandler = (event) => {
		const { name, value } = event?.target;
		setCurrentTemplate(getTemplateById(templates, value));
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const doesHaveSubFlow = () => {
		const subFlow = subFlows.find((subFlow) => subFlow.startNode === nodeId);
		if (subFlow) {
			setHasSubFlow(true);
		}
	};

	const onNodeDelete = () => {
		dispatch(removeNode({ id: nodeId }));
		dispatch(removeSubFlow({ id: nodeId }));

		const subFlowsToDeleteFromLocalStorage =
			localStorage.getItem('subFlowsToDelete');

		let subFlowsToDelete = subFlowsToDeleteFromLocalStorage
			? JSON.parse(subFlowsToDeleteFromLocalStorage)
			: [];

		const subFlowIdToDelete = subFlows.find(
			(subFlow) => subFlow?.startNode === nodeId
		);

		if (subFlowIdToDelete?.flowId) {
			subFlowsToDelete = [...subFlowsToDelete, subFlowIdToDelete.flowId];
			localStorage.setItem(
				'subFlowsToDelete',
				JSON.stringify(subFlowsToDelete)
			);
		}
	};

	return (
		<NodeContainer
			title={'Send template'}
			icon={{
				src: '/images/message-icon.svg',
				altText: 'Message icon',
			}}
			showDeleteButton={true}
			onDelete={onNodeDelete}
			handles={{
				showSourceHandle: true,
				showTargetHandle: true,
				allowedNodes: ['timeDelayNode'],
			}}
		>
			<div className='flex flex-col'>
				{templateAnalytics && (
					<label
						className='text-sm text-slate-400 mb-2 hover:underline cursor-pointer'
						onClick={() => setViewPerformance(true)}
					>
						{viewPerformance ? (
							<ArrowDropDownIcon sx={{ marginLeft: -1 }} />
						) : (
							<ArrowRightIcon sx={{ marginLeft: -1 }} />
						)}
						View Performance
					</label>
				)}
				{viewPerformance && (
					<React.Fragment>
						<p className='text-md font-bold text-slate-600 mr-3'>Performance</p>
						<div className='flex justify-between items-center'>
							<p className='mb-1 text-sm font-bold mr-3'>Revenue</p>
							<p className='mb-1 text-sm text-slate-500'>
								€{templateAnalytics?.orderMetrics?.totalAmount || 0}
							</p>
						</div>
						<div className='flex justify-between items-center'>
							<p className='mb-1 text-sm font-bold mr-3'>Order Count</p>
							<p className='mb-1 text-sm text-slate-500'>
								{templateAnalytics?.orderMetrics?.count || 0}
							</p>
						</div>
						<div className='flex justify-between items-center'>
							<p className='mb-1 text-sm font-bold mr-3 w-[80px]'>Reach</p>
							<p className='mb-1 text-sm text-slate-500 text-start w-[60px]'>
								{roundToTwoDecimals(
									(templateAnalytics?.openRate?.totalMessages /
										templateAnalytics?.openRate?.totalMessages) *
										100 || 0
								)}
								%
							</p>
							<p className='mb-1 text-xs text-slate-500 text-end'>
								{templateAnalytics?.openRate?.totalMessages || 0} of{' '}
								{templateAnalytics?.openRate?.totalMessages || 0}
							</p>
						</div>
						<div className='flex justify-between items-center'>
							<p className='mb-1 text-sm font-bold mr-3 w-[80px]'>Open Rate</p>
							<p className='mb-1 text-sm text-slate-500 text-start w-[50px]'>
								{roundToTwoDecimals(
									(templateAnalytics?.openRate?.readMessages /
										templateAnalytics?.openRate?.totalMessages) *
										100 || 0
								)}
								%
							</p>
							<p className='mb-1 text-xs text-slate-500 text-end'>
								{templateAnalytics?.openRate?.readMessages || 0} opens
							</p>
						</div>
						<div className='flex justify-between items-center mb-2'>
							<p className='mb-1 text-sm font-bold mr-3 w-[80px]'>Click Rate</p>
							<p className='mb-1 text-sm text-slate-500 text-start w-[50px]'>
								{roundToTwoDecimals(
									(templateAnalytics?.ctaClicks?.count /
										templateAnalytics?.openRate?.totalMessages) *
										100 || 0
								)}
								%
							</p>
							<p className='mb-1 text-xs text-slate-500'>
								{templateAnalytics?.ctaClicks?.count || 0} clicks
							</p>
						</div>
					</React.Fragment>
				)}
				<label
					className='text-sm text-slate-400 mb-2 hover:underline  cursor-pointer'
					onClick={() => setViewPerformance(false)}
				>
					{!viewPerformance ? (
						<ArrowDropDownIcon sx={{ marginLeft: -1 }} />
					) : (
						<ArrowRightIcon sx={{ marginLeft: -1 }} />
					)}
					Select template
				</label>
				{!viewPerformance && (
					<React.Fragment>
						{!templates ? (
							<Spinner />
						) : (
							<React.Fragment>
								<Input
									thin
									type='select'
									className='nodrag'
									name='template'
									options={templates?.map((template) => {
										return {
											label: template?.name,
											value: template?.templateId,
										};
									})}
									value={formState.template}
									onChange={changeHandler}
									disabled={templateIdFromParams || hasSubFlow}
								/>
								<RenderTemplate
									template={currentTemplate}
									showButtons={true}
									addButtonNodesButton={{
										show: true,
										text: hasSubFlow
											? 'Edit sub-flow'
											: 'Add sub-flow to buttons',
									}}
									subFlow={{
										hasSubFlow: hasSubFlow,
										setHasSubFlow: setHasSubFlow,
									}}
								/>
							</React.Fragment>
						)}
					</React.Fragment>
				)}
			</div>
		</NodeContainer>
	);
};

export default TemplateNode;
