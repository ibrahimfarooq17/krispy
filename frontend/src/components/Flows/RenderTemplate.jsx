import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNodeId, useNodes } from 'reactflow';
import {
	removeSubFlow,
	setSubFlowNodes,
} from '../../redux/actions/subFlow.actions';
import generateRandomString from '../../utilities/generateRandomString';

const RenderTemplate = ({
	template,
	showButtons = true,
	isSubFlow = false,
	addButtonNodesButton,
	subFlow,
}) => {
	const [templateComponents, setTemplateComponents] = useState({});
	const router = useRouter();
	const pathname = usePathname();
	const nodeId = useNodeId();
	const nodes = useNodes();
	const dispatch = useDispatch();
	const allSubFlows = useSelector(
		(state) => state.subFlowReducer.allSubFlows.subFlows
	);

	useEffect(() => {
		const components = {};

		if (template && template.components) {
			template.components.map((component) => {
				switch (component.type) {
					case 'HEADER':
						components['header'] = component.defaultUrl;
						break;
					case 'BODY':
						components['body'] = component.text;
						break;
					case 'BUTTONS':
						components['buttons'] = component.buttons;
						break;
					case 'FOOTER':
						components['footer'] = component.text;
						break;
					default:
						break;
				}
			});
		}

		setTemplateComponents(components);
	}, [template]);

	const createButtonNodes = () => {
		const buttonNodes = [];
		const currentNode = nodes.filter((node) => node.id === nodeId)[0];
		let currentYPosition = currentNode.position.y + currentNode.height;

		templateComponents.buttons.map((button) => {
			const newNodeId = generateRandomString(20);
			const buttonNode = {
				id: newNodeId,
				type: 'buttonNode',
				position: {
					x: currentNode.position.x,
					y: currentYPosition + 10,
				},
				parentId: nodeId,
				extent: 'parent',
				data: {
					id: button.type === 'QUICK_REPLY' ? button.id : null,
					text: button.text,
					type: button.type,
				},
			};

			buttonNodes.push(buttonNode);
			currentYPosition += 68;
		});

		dispatch(setSubFlowNodes([...nodes, ...buttonNodes]));
	};

	const deleteSubFlow = () => {
		dispatch(removeSubFlow({ id: nodeId }));
		subFlow.setHasSubFlow(false);

		const subFlowsToDeleteFromLocalStorage =
			localStorage.getItem('subFlowsToDelete');

		let subFlowsToDelete = subFlowsToDeleteFromLocalStorage
			? JSON.parse(subFlowsToDeleteFromLocalStorage)
			: [];

		const subFlowIdToDelete = allSubFlows.find(
			(subFlow) => subFlow?.startNode === nodeId
		);
		if (subFlowIdToDelete.flowId) {
			subFlowsToDelete = [...subFlowsToDelete, subFlowIdToDelete.flowId];
			localStorage.setItem(
				'subFlowsToDelete',
				JSON.stringify(subFlowsToDelete)
			);
		}
	};

	return (
		<>
			{Object.keys(template).length !== 0 && (
				<>
					<div className='text-xs text-slate-600 border rounded-md p-3 flex flex-col gap-2 items-start'>
						{templateComponents.header && (
							<img
								src={templateComponents.header}
								className='mx-auto'
								alt='Template header image'
							/>
						)}
						{templateComponents.body && <span>{templateComponents.body}</span>}
						{templateComponents.footer && (
							<span>{templateComponents.footer}</span>
						)}
						{showButtons &&
							templateComponents.buttons &&
							templateComponents.buttons.map((button) => (
								<span className='bg-slate-100 p-2 w-full rounded-md'>
									{button.text}
								</span>
							))}
					</div>
					{addButtonNodesButton?.show && templateComponents.buttons && (
						<div className='flex absolute -bottom-12 left-0 right-0 gap-2 text-sm'>
							<button
								className='flex-1 !shadow-md !shadow-slate-200 text-center text-slate-700 bg-white !border border-slate-100 py-2 rounded-lg hover:border-orange-500 ease-in-out duration-150'
								onClick={() =>
									isSubFlow
										? createButtonNodes()
										: router.push(
												`${pathname}?templateId=${template.templateId}&nodeId=${nodeId}`
										  )
								}
							>
								{addButtonNodesButton.text}
							</button>
							{subFlow?.hasSubFlow && (
								<button
									className='flex-1 !shadow-md !shadow-slate-200 text-center text-slate-700 bg-white !border border-orange-500 py-2 rounded-lg hover:!bg-red-100 ease-in-out duration-150'
									onClick={deleteSubFlow}
								>
									Delete sub-flow
								</button>
							)}
						</div>
					)}
				</>
			)}
		</>
	);
};

export default RenderTemplate;
