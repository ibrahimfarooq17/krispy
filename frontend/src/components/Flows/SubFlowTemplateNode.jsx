import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNodeId } from 'reactflow';
import {
	removeSubFlowNode,
	updateSubFlowNodeData,
} from '../../redux/actions/subFlow.actions';
import { getAllTemplates } from '../../redux/actions/template.actions';
import getChildNodeIds from '../../utilities/getChildNodeIds';
import getTemplateById from '../../utilities/getTemplateById';
import Input from '../@generalComponents/Input';
import Spinner from '../@generalComponents/Spinner';
import NodeContainer from './NodeContainer';
import RenderTemplate from './RenderTemplate';

const SubFlowTemplateNode = ({ data }) => {
	const dispatch = useDispatch();
	const nodeId = useNodeId();
	const [formState, setFormState] = useState({
		template: data?.template || '',
	});
	const [currentTemplate, setCurrentTemplate] = useState({});
	const [unavailableTemplates, setUnavailableTemplates] = useState(new Set());
	const [showAddButtonNodes, setShowAddButtonNodes] = useState();
	const searchParams = useSearchParams();
	const templateId = searchParams.get('templateId');

	const templates = useSelector((state) => state.templateReducer.allTemplates);
	const currentSubFlowNodes = useSelector(
		(state) => state.subFlowReducer.currentSubFlow.nodes
	);

	useEffect(() => {
		if (!templates) dispatch(getAllTemplates());
	}, [templates]);

	useEffect(() => {
		if (formState.template !== '')
			setCurrentTemplate(getTemplateById(templates, formState.template));
	}, [templates]);

	useEffect(() => {
		checkUnavailableTemplates();
		setShowAddButtonNodes(!checkIfButtonNodesPresent());
	}, [currentSubFlowNodes]);

	useEffect(() => {
		if (!formState || !nodeId || !formState.template) return;
		dispatch(
			updateSubFlowNodeData({
				id: nodeId,
				data: formState,
			})
		);
	}, [dispatch, nodeId, formState]);

	const checkIfButtonNodesPresent = () => {
		const buttonNodes = getChildNodeIds(nodeId, currentSubFlowNodes);
		return buttonNodes.length > 0;
	};

	const checkUnavailableTemplates = () => {
		const filteredNodes = currentSubFlowNodes.filter(
			(node) => node.type === 'subFlowTemplateNode' && node.data
		);
		const usedTemplates = new Set(
			filteredNodes.map((node) => node.data.template)
		);
		usedTemplates.add(templateId);
		setUnavailableTemplates(usedTemplates);
	};

	const changeHandler = (event) => {
		const { name, value } = event?.target;
		setCurrentTemplate(getTemplateById(templates, value));
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
			title={'Send template'}
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
			<div className='flex flex-col gap-2'>
				<label className='text-sm text-slate-400'>Select a template</label>
				{!templates ? (
					<Spinner />
				) : (
					<>
						<Input
							thin
							type='select'
							className='nodrag mb-0'
							name='template'
							options={templates?.map((template) => {
								return {
									label: template?.name,
									value: template?.templateId,
									disabled: unavailableTemplates.has(template.templateId),
								};
							})}
							value={formState.template}
							onChange={changeHandler}
						/>
						<RenderTemplate
							template={currentTemplate}
							showButtons={true}
							addButtonNodesButton={{
								show: showAddButtonNodes,
								text: 'Add sub-flow to buttons',
							}}
							isSubFlow={true}
						/>
					</>
				)}
			</div>
		</NodeContainer>
	);
};

export default SubFlowTemplateNode;
