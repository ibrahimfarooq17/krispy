import { IconButton } from '@mui/material';
import moment from 'moment';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';
import CustomChip from '../@generalComponents/CustomChip';
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
	marginBottom: 20,
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

const CampaignItem = ({
	campaign,
	templateVisibility,
	setTemplateVisibility,
	handleMouseMove,
	hoveredElementStyle,
	confirmCampaignDeletion,
}) => {
	const isCampaignSent = moment(campaign?.scheduledFor).isBefore(new Date());
	const templateComponents = {};
	if (campaign?.template?.components) {
		campaign?.template?.components?.map((component) => {
			switch (component?.type) {
				case 'HEADER':
					templateComponents['header'] = component?.defaultUrl;
					break;
				case 'BODY':
					templateComponents['body'] = component?.text;
					break;
				case 'BUTTONS':
					templateComponents['buttons'] = component?.buttons;
					break;
				case 'FOOTER':
					templateComponents['footer'] = component?.text;
					break;
				default:
					break;
			}
		});
	}

	return (
		<Accordion>
			<AccordionSummary>
				<div className='w-100 d-flex justify-content-between align-items-center'>
					<div className='d-flex justify-content-between align-items-center'>
						<p className='mb-0 font-medium text-slate-600 mr-3'>
							{campaign?.name}
						</p>
						<span
							className='relative text-slate-400 text-xs cursor-pointer hover:underline'
							onMouseEnter={() =>
								setTemplateVisibility({
									...templateVisibility,
									[campaign?.campaignId]: true,
								})
							}
							onMouseLeave={() =>
								setTemplateVisibility({
									...templateVisibility,
									[campaign?.campaignId]: false,
								})
							}
							onMouseMove={handleMouseMove}
						>
							(View template)
							{templateVisibility[campaign?.campaignId] && (
								<div
									className='absolute bg-white w-[256px] z-10 text-xs text-slate-600 border rounded-md p-3 flex flex-col gap-2 items-start shadow-sm'
									style={{ ...hoveredElementStyle }}
								>
									<span className='font-bold'>{campaign?.template?.name}</span>
									{templateComponents?.header && (
										<img
											src={templateComponents?.header}
											className='mx-auto'
											alt='Template header image'
											width={'75%'}
										/>
									)}
									{templateComponents?.body && (
										<span>{templateComponents?.body}</span>
									)}
									{templateComponents?.footer && (
										<span>{templateComponents?.footer}</span>
									)}
									{templateComponents?.buttons &&
										templateComponents?.buttons?.map((button) => (
											<span className='bg-slate-100 p-2 w-full rounded-md'>
												{button?.text}
											</span>
										))}
								</div>
							)}
						</span>
					</div>
					<div>
						<CustomChip
							className='w-fit'
							label={isCampaignSent ? 'Sent' : 'Scheduled'}
							type={isCampaignSent ? 'green' : 'orange'}
						/>
						<IconButton
							sx={{ border: '0.5px solid #cbd5e1' }}
							onClick={(e) => {
								confirmCampaignDeletion(campaign?.campaignId);
								e.stopPropagation();
							}}
							className='bg-white hover:!bg-slate-100 ms-4'
						>
							<img
								src='/images/bin-icon.svg'
								width={20}
								alt='Bin icon'
							/>
						</IconButton>
					</div>
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<div className='d-flex justify-content-between'>
					<p className='text-md font-bold text-slate-600 mr-3'>Performance</p>
					<div className='d-flex'>
						<p className='text-sm font-bold text-slate-600 mr-3'>
							{isCampaignSent ? 'Sent on' : 'Scheduled for'}
						</p>
						<p className='text-sm text-slate-500'>
							{campaign?.scheduledFor
								? moment(campaign?.scheduledFor).format('Do MMMM, YYYY hh:mm a')
								: '-'}
						</p>
					</div>
				</div>
				<div className='flex'>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm font-bold mr-3'>Revenue</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>
							€{campaign?.totalRevenue}
						</p>
					</div>
				</div>
				<div className='flex'>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm font-bold mr-3'>Order Count</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{campaign?.totalOrders}
						</p>
					</div>
				</div>
				<div className='flex'>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm font-bold mr-3'>Reach</p>
					</div>
					<div className='w-[100px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{roundToTwoDecimals(
								(campaign?.contactsReached / campaign?.totalContacts) * 100 || 0
							)}
							%
						</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{campaign?.contactsReached} of {campaign?.totalContacts} contacts
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
								(campaign?.openedCount / campaign?.messagesCount) * 100 || 0
							)}
							%
						</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{campaign?.openedCount} opens
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
								(campaign?.ctaClicksCount / campaign?.messagesCount) * 100 || 0
							)}
							%
						</p>
					</div>
					<div className='w-[150px]'>
						<p className='mb-1 text-sm text-slate-500'>
							{campaign?.ctaClicksCount} clicks
						</p>
					</div>
				</div>
			</AccordionDetails>
		</Accordion>
	);
};

export default CampaignItem;
