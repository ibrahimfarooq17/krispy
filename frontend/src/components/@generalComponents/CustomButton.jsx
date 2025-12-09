import { CircularProgress } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';

const CssButtonLarge = styled(Button)(({ theme }) => ({
	backgroundColor: 'rgba(253, 79, 2, 0.9)', // set the background color
	color: '#ffffff', // set the font color
	fontSize: '22px', // set the font size
	fontWeight: 600,
	textTransform: 'capitalize',
	padding: '10px',
	width: '100%',
	boxShadow: 'none',

	'&:hover': {
		backgroundColor: 'rgb(112, 90, 220)',
		color: '#ffffff',
	},
	borderRadius: '8px',
}));

const CssButtonMedium = styled(Button)(({ theme }) => ({
	backgroundColor: 'rgba(253, 79, 2, 0.9)', // set the background color
	color: '#ffffff', // set the font color
	fontSize: '14px', // set the font size
	fontWeight: 500,
	lineHeight: '20px',
	textTransform: 'capitalize',
	padding: '10px 16px',
	width: '100%',
	boxShadow: 'none',
	'&:hover': {
		backgroundColor: 'rgb(227, 70, 0)',
		color: '#ffffff',
	},
	borderRadius: '8px',
}));

const CssButtonMediumOutline = styled(Button)(({ theme }) => ({
	backgroundColor: 'transparent', // set the background color
	color: 'rgba(253, 79, 2, 0.9)', // set the font color
	fontSize: '14px', // set the font size
	fontWeight: 700,
	lineHeight: '21px',
	textTransform: 'capitalize',
	padding: '6px',
	width: '100%',
	boxShadow: 'none',
	borderRadius: '6px',
	border: '1px solid rgba(253, 79, 2, 0.9)',
}));

const CssButtonMediumGrey = styled(Button)(({ theme }) => ({
	backgroundColor: '#D9D9D9', // set the background color
	color: '#000000', // set the font color
	fontSize: '14px', // set the font size
	fontWeight: 500,
	lineHeight: '21px',
	textTransform: 'capitalize',
	padding: '8px',
	width: '100%',
	boxShadow: 'none',
	'&:hover': {
		backgroundColor: '#9e9d9d',
		color: '#ffffff',
	},
	borderRadius: '6px',
}));

const CssButtonMediumLight = styled(Button)(({ theme }) => ({
	background: '#FFFFFF', // set the background color
	color: '#8960D2', // set the font color
	fontSize: '12px', // set the font size
	fontWeight: 700,
	textTransform: 'capitalize',
	padding: '10px',
	boxShadow: 'none',
	width: '100%',
	'&:hover': {
		backgroundColor: 'rgb(112, 90, 220)',
		color: '#ffffff',
	},
	borderRadius: '10px',
}));

const CustomButton = ({
	label,
	type,
	icon,
	customStyle,
	disabled,
	loading,
	onClick,
	showConfirmation,
}) => {
	const [confirmation, setConfirmation] = useState(false);

	const onButtonClick = () => {
		if (showConfirmation && !confirmation) setConfirmation(true);
		else {
			setConfirmation(false);
			if (onClick) onClick();
		}
	};

	if (type === 'large')
		return (
			<CssButtonLarge
				startIcon={icon}
				variant='contained'
				onClick={onClick}
			>
				{confirmation ? 'Are you sure?' : label}
			</CssButtonLarge>
		);
	else if (type === 'medium')
		return (
			<CssButtonMedium
				sx={customStyle}
				startIcon={icon}
				variant='contained'
				onClick={onButtonClick}
			>
				{confirmation ? 'Are you sure?' : label}
			</CssButtonMedium>
		);
	else if (type === 'medium-purple')
		return (
			<CssButtonMedium
				startIcon={loading ? null : icon}
				variant='contained'
				style={{
					background: 'rgba(253, 79, 2, 0.9)',
					...(customStyle && { ...customStyle }),
				}}
				disabled={disabled || loading}
				onClick={onButtonClick}
			>
				{loading ? (
					<CircularProgress
						size='21px'
						sx={{ color: '#fff' }}
					/>
				) : confirmation ? (
					'Are you sure?'
				) : (
					label
				)}
			</CssButtonMedium>
		);
	else if (type === 'medium-grey')
		return (
			<CssButtonMediumGrey
				startIcon={icon}
				variant='contained'
				sx={customStyle}
				onClick={onButtonClick}
				disabled={disabled}
			>
				{confirmation ? 'Are you sure?' : label}
			</CssButtonMediumGrey>
		);
	else if (type === 'medium-light')
		return (
			<CssButtonMediumLight
				startIcon={icon}
				variant='contained'
				onClick={onButtonClick}
			>
				{confirmation ? 'Are you sure?' : label}
			</CssButtonMediumLight>
		);
	else if (type === 'medium-outline')
		return (
			<CssButtonMediumOutline
				startIcon={icon}
				sx={customStyle}
				variant='outlined'
				onClick={onButtonClick}
			>
				{confirmation ? 'Are you sure?' : label}
			</CssButtonMediumOutline>
		);
};

export default CustomButton;
