import styled from '@emotion/styled';
import {
	Button,
	Checkbox,
	IconButton,
	InputAdornment,
	InputLabel,
	MenuItem,
	Input as MuiInput,
	TextField,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const CssTextField = styled(TextField, {
	shouldForwardProp: (props) =>
		props !== 'focusColor' &&
		props !== 'startIcon' &&
		props !== 'thin' &&
		props !== 'inputAdornment' &&
		props !== 'error',
})((p) => ({
	width: '100%',
	'& .MuiInputLabel-root': {
		fontWeight: 500,
	},
	// input label when focused
	'& label.Mui-focused': {
		color: p.error ? 'red' : p.focusColor,
	},
	// focused color for input with variant='standard'
	'& .MuiInput-underline:after': {
		borderBottomColor: p.error ? 'red' : p.focusColor,
	},
	// focused color for input with variant='filled'
	'& .MuiFilledInput-underline:after': {
		borderBottomColor: p.error ? 'red' : p.focusColor,
	},
	// focused color for input with variant='outlined'
	'& .MuiOutlinedInput-root': {
		paddingLeft: p.startIcon ? '30px' : '10px !important',
		paddingRight: '10px !important',
		borderRadius: '16px',
		boxShadow:
			'0px 12px 24px -12px rgba(0, 0, 0, 0.08), 0px 6px 12px -6px rgba(0, 0, 0, 0.10)',
		// fontFamily: 'Inter',
	},
	'& .MuiOutlinedInput-root.Mui-focused fieldset': {
		borderColor: p.error ? 'red' : p.focusColor,
	},
	'& .MuiOutlinedInput-input': {
		fontSize: '14px',
		fontWeight: '400',
		padding: '15px 5px 15px 0',
	},
	'& .MuiInputBase-input': {
		...(p?.inputAdornment && {
			marginLeft: '-20px !important',
		}),
	},
	'& .MuiInputAdornment-root': {
		marginRight: '10px',
	},
}));

const SearchInput = ({
	name,
	type,
	thin,
	disabled,
	placeholder,
	startIcon,
	onChange,
	onBlur,
	value,
	onSearch,
	options,
	innerInputSx,
	rows,
	maxRows,
	inputAdornment,
	error,
}) => {
	return (
		<CssTextField
			focusColor='rgba(253, 79, 2, 0.9)'
			id='outlined-basic'
			disabled={disabled}
			type={type}
			thin={thin}
			error={error}
			label=''
			name={name}
			placeholder={placeholder}
			variant='outlined'
			startIcon={startIcon}
			inputAdornment={inputAdornment}
			InputProps={{
				startAdornment: (
					<InputAdornment position='start'>
						<IconButton onClick={onSearch}>
							<img
								src='/images/search-icon.svg'
								width={22}
								height={22}
								alt='Search icon'
							/>
						</IconButton>
					</InputAdornment>
				),
				endAdornment: <InputAdornment position='end'></InputAdornment>,
				sx: innerInputSx,
			}}
			multiline={type === 'textarea'}
			rows={rows}
			maxRows={maxRows}
			onChange={onChange}
			onBlur={onBlur}
			value={value}
			sx={{
				marginBottom: '15px',
			}}
		/>
	);
};

export default SearchInput;
