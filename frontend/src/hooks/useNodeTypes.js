import { useMemo } from 'react';
import ButtonNode from '../components/Flows/ButtonNode';
import StartNode from '../components/Flows/StartNode';
import SubFlowStartNode from '../components/Flows/SubFlowStartNode';
import SubFlowTemplateNode from '../components/Flows/SubFlowTemplateNode';
import SubFlowTextMessageNode from '../components/Flows/SubFlowTextMessageNode';
import TemplateNode from '../components/Flows/TemplateNode';
import TextMessageNode from '../components/Flows/TextMessageNode';
import TimeDelayNode from '../components/Flows/TimeDelayNode';

export const useNodeTypes = () => {
	return useMemo(
		() => ({
			startNode: StartNode,
			timeDelayNode: TimeDelayNode,
			messageNode: TemplateNode,
			subFlowStartNode: SubFlowStartNode,
			subFlowTemplateNode: SubFlowTemplateNode,
			textMessageNode: TextMessageNode,
			subFlowTextMessageNode: SubFlowTextMessageNode,
			buttonNode: ButtonNode,
		}),
		[]
	);
};
