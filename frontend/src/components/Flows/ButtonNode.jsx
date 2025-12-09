import { Position } from 'reactflow';
import generateRandomString from '../../utilities/generateRandomString';
import CustomHandle from './CustomHandle';

const ButtonNode = ({ data }) => {
	return (
		<>
			<div className='!border border-slate-200 rounded-lg bg-white !shadow-md !shadow-slate-200 w-[256px] p-3 flex justify-between items-end'>
				{data.text}
			</div>
			{data.type !== 'URL' && (
				<CustomHandle
					type='source'
					position={Position.Right}
					id={generateRandomString(20)}
					allowedNodes={['subFlowTemplateNode', 'subFlowTextMessageNode']}
					isSubFLow={true}
				/>
			)}
		</>
	);
};

export default ButtonNode;
