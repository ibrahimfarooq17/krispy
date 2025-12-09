import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import Image from 'next/image';

const NavItem = ({ active = false, index, link, onClick, router }) => {
	const StyledTooltip = styled(({ className, ...props }) => (
		<Tooltip
			{...props}
			classes={{ popper: className }}
		/>
	))(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: theme.palette.common.white,
			color: '#475569',
			filter: 'drop-shadow(0 1px 1px rgb(0 0 0 / 0.05))',
			fontSize: 12,
			padding: '6px 12px',
			borderRadius: '0px 8px 8px 0',
			borderTop: '2px #f1f5f9 solid',
			borderRight: '2px #f1f5f9 solid',
			borderBottom: '2px #f1f5f9 solid',
			borderLeft: '2px #fd4f02 solid',
		},
	}));

	return (
		<StyledTooltip
			disableFocusListener
			placement='right'
			title={link.name}
		>
			<button
				className={`${
					active ? 'bg-orange-100' : ''
				} p-2.5 flex justify-center items-center rounded-lg hover:bg-orange-50 transition-all ease-in-out duration-100`}
				key={index}
				onClick={() => (onClick ? onClick() : router.push(link.link))}
			>
				<Image
					src={active ? link.iconActive : link.icon}
					alt={link.name}
					width={20}
					height={20}
				/>
			</button>
		</StyledTooltip>
	);
};

export default NavItem;
