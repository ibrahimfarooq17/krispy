import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNodeId, useNodes } from 'reactflow';
import { setSubFlowNodes } from '../../redux/actions/subFlow.actions';
import generateRandomString from '../../utilities/generateRandomString';
import getTemplateById from '../../utilities/getTemplateById';
import NodeContainer from './NodeContainer';
import RenderTemplate from './RenderTemplate';

const SubFlowStartNode = () => {
	const dispatch = useDispatch();
	const nodeId = useNodeId();
	const nodes = useNodes();
	const searchParams = useSearchParams();
	const templateId = searchParams.get('templateId');
	const [currentTemplate, setCurrentTemplate] = useState({});
	const buttonRef = useRef(null);

	const templates = useSelector((state) => state.templateReducer.allTemplates);
	const isSubFlowFromSaved = useSelector(
		(state) => state.subFlowReducer.currentSubFlow.startNode
	);

	useEffect(() => {
		if (templates) setCurrentTemplate(getTemplateById(templates, templateId));
	}, [templates]);

	useEffect(() => {
		if (!isSubFlowFromSaved) addButtons();
	}, []);

	const addButtons = () => {
		const buttonElement = buttonRef.current;

		setTimeout(() => {
			if (buttonElement) {
				const event = new MouseEvent('click', {
					bubbles: true,
					cancelable: true,
					view: window,
				});

				buttonElement.dispatchEvent(event);
			}
		}, 200);

		clearTimeout(buttonElement);
	};

	const createButtonNodes = () => {
		const buttonNodes = [];
		let buttons = [];
		const currentNode = nodes.filter((node) => node.id === nodeId)[0];
		let currentYPosition = currentNode.position.y + currentNode.height;

		if (currentTemplate && currentTemplate.components) {
			currentTemplate.components.map((component) => {
				switch (component.type) {
					case 'BUTTONS':
						buttons = component.buttons;
						break;
					default:
						break;
				}
			});
		}

		buttons.map((button) => {
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
					url: button.type === 'URL' ? button.url : null,
				},
			};

			buttonNodes.push(buttonNode);
			currentYPosition += 65;
		});

		dispatch(setSubFlowNodes([...nodes, ...buttonNodes]));
	};

	return (
		<NodeContainer
			title={'Sub-flow'}
			icon={{
				src: '/images/message-icon.svg',
				altText: 'Message icon',
			}}
			showDeleteButton={false}
			handles={{
				showSourceHandle: false,
				showTargetHandle: false,
			}}
		>
			<div className='flex flex-col gap-2'>
				<label className='text-sm text-slate-400'>Template message</label>
				{currentTemplate && currentTemplate.components && (
					<RenderTemplate
						template={currentTemplate}
						showButtons={false}
						showAddButtonNodes={false}
					/>
				)}
				<button
					ref={buttonRef}
					onClick={createButtonNodes}
					className='opacity-0 absolute'
				/>
			</div>
		</NodeContainer>
	);
};

export default SubFlowStartNode;
