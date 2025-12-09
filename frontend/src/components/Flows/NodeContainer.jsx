import { Position } from 'reactflow';
import generateRandomString from '../../utilities/generateRandomString';
import CustomHandle from './CustomHandle';

const NodeContainer = ({
	title,
	icon,
	showDeleteButton,
	onDelete,
	handles,
	children,
}) => {
	return (
		<div className='flex flex-col gap-3 !border border-slate-200 rounded-lg bg-white p-3 relative !shadow-md !shadow-slate-200 w-[256px] text-slate-700'>
			<div className='flex font-medium items-center justify-between !border-b-2 border-slate-200 border-opacity-40 pb-2.5'>
				<div className='flex gap-2'>
					<img
						src={icon.src}
						width={20}
						height={20}
						alt={icon.altText}
					/>
					<p className='m-0'>{title}</p>
				</div>
				{showDeleteButton && (
					<button
						className='!border border-transparent hover:border-red-500 p-1.5 rounded-md ease-in-out duration-150'
						onClick={onDelete}
					>
						<img
							src='/images/bin-icon.svg'
							width={20}
							height={20}
							alt='Bin icon'
							className='opacity-75'
						/>
					</button>
				)}
			</div>
			{children}
			{handles.showSourceHandle && (
				<CustomHandle
					type='source'
					position={Position.Right}
					id={generateRandomString(20)}
					allowedNodes={handles.allowedNodes}
				/>
			)}
			{handles.showTargetHandle && (
				<CustomHandle
					type='target'
					position={Position.Left}
					id={generateRandomString(20)}
				/>
			)}
		</div>
	);
};

export default NodeContainer;
