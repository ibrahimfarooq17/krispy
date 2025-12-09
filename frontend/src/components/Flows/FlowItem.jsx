import { Switch } from '@mui/material';
import CustomChip from '../@generalComponents/CustomChip';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import roundToTwoDecimals from '../../utilities/roundToTwoDecimals';

const Accordion = styled((props) => (
	<MuiAccordion
		disableGutters
		elevation={0}
		square
		{...props}
	/>
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:before': {
		display: 'none',
	},
	marginBottom: -4,
	borderRadius: 8,
}));

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === 'dark'
			? 'rgba(255, 255, 255, .05)'
			: 'rgba(0, 0, 0, .03)',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const FlowItem = ({ flow, editFlow, onSwitchChange, deleteFlow }) => {
	return (
		<Accordion>
			<AccordionSummary>
				<div className='w-100 d-flex justify-content-between align-items-center'>
					<div className='d-flex align-items-center'>
						<p className='mb-0 font-medium text-slate-600 mr-3'>{flow?.name}</p>
						<CustomChip
							label={flow.isActive ? 'Active' : 'Inactive'}
							type={flow.isActive ? 'green' : 'orange'}
						/>
					</div>
					<div className='flex justify-end gap-3 items-center'>
						<Switch
							defaultChecked={flow?.isActive}
							onChange={(e) => {
								onSwitchChange(e, flow?.flowId);
								e.stopPropagation();
							}}
							size='small'
						/>
						<button
							onClick={(e) => {
								editFlow(flow?.flowId);
								e.stopPropagation();
							}}
							className='flex p-2 bg-white !border border-slate-200 rounded-md items-center gap-2 hover:!bg-slate-100 transition-all ease-in-out duration-100'
						>
							<img
								src='/images/pencil-square-black.svg'
								alt='Edit icon'
								width={16}
							/>
							<span className='text-sm font-medium text-slate-700'>
								Edit flow
							</span>
						</button>
						<button
							onClick={(e) => {
								deleteFlow(flow?.flowId);
								e.stopPropagation();
							}}
							className='p-2 bg-white !border border-red-400 rounded-md flex items-center gap-2 hover:!bg-slate-100 ease-in-out duration-100'
						>
							<img
								src='/images/bin-icon.svg'
								alt='Bin icon'
								width={16}
							/>
							<span className='text-sm font-medium text-slate-700'>Delete</span>
						</button>
					</div>
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<p className='text-md font-bold text-slate-600 mr-3'>Performance</p>
				<div className='flex'>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm font-bold mr-3'>Revenue</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>€{flow?.totalRevenue}</p>
					</div>
				</div>
				<div className='flex'>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm font-bold mr-3'>Order Count</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>{flow?.totalOrders}</p>
					</div>
				</div>
				<div className='flex'>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm font-bold mr-3'>Reach</p>
					</div>
					<div className='w-[100px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{roundToTwoDecimals(
								(flow?.messagesCount / flow?.messagesCount) * 100 || 0
							)}
							%
						</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{flow?.messagesCount} of {flow?.messagesCount} contacts
						</p>
					</div>
				</div>
				<div className='flex'>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm font-bold mr-3'>Open Rate</p>
					</div>
					<div className='w-[100px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{roundToTwoDecimals(
								(flow?.openedCount / flow?.messagesCount) * 100 || 0
							)}
							%
						</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{flow?.openedCount} opens
						</p>
					</div>
				</div>
				<div className='flex'>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm font-bold mr-3'>Click Rate</p>
					</div>
					<div className='w-[100px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{roundToTwoDecimals(
								(flow?.ctaClicksCount / flow?.messagesCount) * 100 || 0
							)}
							%
						</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{flow?.ctaClicksCount} clicks
						</p>
					</div>
				</div>
			</AccordionDetails>
		</Accordion>
	);
};

export default FlowItem;
