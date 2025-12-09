import styled from '@emotion/styled';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {
	Button,
	Checkbox,
	IconButton,
	InputAdornment,
	MenuItem,
	Input as MuiInput,
	TextField,
} from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

const CssTextField = styled(TextField, {
	shouldForwardProp: (props) =>
		props !== 'startIcon' && props !== 'thin' && props !== 'inputAdornment',
})((p) => ({
	width: '100%',
	'& .MuiInputLabel-root': {
		fontWeight: 500,
	},
	// input label when focused
	'& label.Mui-focused': {
		color: '#fd4f02',
	},
	// focused color for input with variant='standard'
	'& .MuiInput-underline:after': {
		borderBottomColor: '#fd4f02',
	},
	// focused color for input with variant='filled'
	'& .MuiFilledInput-underline:after': {
		borderBottomColor: '#fd4f02',
	},
	// focused color for input with variant='outlined'
	'& .MuiOutlinedInput-root': {
		paddingLeft: p.startIcon ? '30px' : '10px !important',
		paddingRight: '10px !important',
		'&.Mui-focused fieldset': {
			borderColor: '#fd4f02',
		},
	},
	// '& .MuiOutlinedInput-root.Mui-focused fieldset': {
	//   borderColor: '#fd4f02',
	// },
	'& .MuiOutlinedInput-input': {
		fontSize: '14px',
		fontWeight: '400',
		...(p?.thin && p?.type === 'select'
			? { padding: '8.5px' }
			: { padding: '10px' }),
	},
	'& .MuiInputBase-input': {
		...(p?.inputAdornment && {
			marginLeft: '-30px !important',
		}),
	},
	'& .MuiInputAdornment-root': {
		marginRight: '25px',
	},
}));

const CssCheckBox = styled(Checkbox)(({ theme }) => ({
	'&.Mui-checked': {
		color: '#fd4f02',
	},
	'& .MuiSvgIcon-root': {
		fontSize: 20, // set the size of the checkbox icon
	},
	'&.Mui-checked .MuiSvgIcon-root': {
		fontSize: 20, // set the size of the selected checkbox icon
	},
}));

const Input = ({
	className,
	name,
	label,
	type,
	thin,
	maxLength,
	width,
	styles,
	disabled,
	placeholder,
	startIcon,
	onChange,
	onBlur,
	value,
	options,
	innerInputSx,
	rows,
	maxRows,
	inputAdornment,
	copyToClipboard,
	error,
	endButton,
	passImg,
}) => {
	const dateInputRef = useRef(null);
	const [showPassword, setShowPassword] = useState(false);

	if (type === 'password')
		return (
			<React.Fragment>
				{label && <label className='input-label'>{label}</label>}

				<CssTextField
					id='outlined-basic'
					disabled={disabled}
					thin={thin}
					name={name}
					type={showPassword ? 'text' : 'password'}
					placeholder={placeholder}
					variant='outlined'
					onChange={onChange}
					value={value}
					InputProps={{
						endAdornment: (
							<InputAdornment position='end'>
								{!passImg && (
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										edge='end'
									>
										{showPassword ? (
											<img
												src='/images/eye.svg'
												width={22}
												height={22}
												alt='Eye icon'
											/>
										) : (
											<img
												src='/images/eye-slash.svg'
												width={22}
												height={22}
												alt='Eyes closed icon'
											/>
										)}
									</IconButton>
								)}
							</InputAdornment>
						),
						startAdornment: passImg ? (
							<img
								src='/images/qr-code-icon.svg'
								width={22}
								height={22}
								alt='QR code icon'
							/>
						) : (
							<LockOutlinedIcon className='text-slate-500' />
						),
						...(copyToClipboard && {
							startAdornment: (
								<InputAdornment position='start'>
									<IconButton
										onClick={() => {
											navigator.clipboard.writeText(value);
											toast.success('Key copied!');
										}}
										edge='end'
									>
										<img
											src='/images/clipboard-icon.svg'
											width={22}
											height={22}
											alt='clipboard icon'
										/>
									</IconButton>
								</InputAdornment>
							),
						}),
					}}
					sx={{
						width: '100%',
					}}
				/>
			</React.Fragment>
		);
	else if (type === 'checkbox')
		return (
			<CssCheckBox
				label={label}
				checked={value}
				name={name}
				onChange={onChange}
				sx={{ padding: 0 }}
				onBlur={onBlur}
			/>
		);
	else if (type === 'select')
		return (
			<CssTextField
				id='outlined-basic'
				className={className}
				label={label}
				thin={thin}
				type='select'
				name={name}
				select
				disabled={disabled}
				placeholder={placeholder}
				variant='outlined'
				InputProps={{
					...(startIcon && {
						startAdornment: (
							<InputAdornment position='start'>
								<img
									src={startIcon}
									width={22}
									height={22}
								/>
							</InputAdornment>
						),
					}),
				}}
				onChange={onChange}
				onBlur={onBlur}
				value={value}
				sx={{
					marginBottom: '15px',
					width: width || '100%',
					'& .MuiOutlinedInput-root': {
						paddingRight: '0px !important',
						paddingLeft: '20px !important',
					},
					'& .MuiOutlinedInput-input': {
						padding: styles?.padding ? styles?.padding : '10px',
					},
				}}
			>
				{placeholder && (
					<MenuItem
						value={null}
						selected
					>
						{placeholder}
					</MenuItem>
				)}
				{options?.map((option) => {
					return (
						<MenuItem
							value={option.value}
							disabled={option.disabled}
						>
							{option.label}
						</MenuItem>
					);
				})}
			</CssTextField>
		);
	else if (type === 'file')
		return (
			<Button
				variant='outlined'
				startIcon={
					<img
						src='/images/start-icon.svg'
						width={22}
						height={22}
					/>
				}
				sx={{
					color: 'black',
					fontWeight: '500',
					fontFamily: 'Inter',
					width: '100%',
					fontSize: '18px',
					borderColor: '#fd4f02',
					textTransform: 'none',
					borderWidth: '1.5px',
					'&:hover': {
						borderColor: '#fd4f02',
						color: 'black',
						fontWeight: '500',
						fontFamily: 'Inter',
						width: '100%',
						fontSize: '18px',
						borderColor: '#fd4f02',
						textTransform: 'none',
						borderWidth: '1.5px',
					},
				}}
			>
				{label}
				<input
					type='file'
					accept='image/*'
					style={{
						opacity: 0,
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						cursor: 'pointer',
					}}
					onChange={onChange}
				/>
			</Button>
		);
	else
		return (
			<React.Fragment>
				<div className='d-flex justify-content-between'>
					{label && <label className='input-label'>{label}</label>}
					{maxLength && (
						<label className='input-sec-label grey'>
							{value?.length || 0}/{maxLength}
						</label>
					)}
				</div>
				<CssTextField
					className={className}
					id='outlined-basic'
					disabled={disabled}
					type={type}
					thin={thin}
					label=''
					name={name}
					placeholder={placeholder}
					variant='outlined'
					startIcon={startIcon}
					inputAdornment={inputAdornment}
					inputProps={{ maxLength: maxLength }}
					InputProps={{
						...(startIcon && {
							startAdornment: (
								<InputAdornment position='start'>
									<img
										src={startIcon}
										width={22}
										height={22}
									/>
								</InputAdornment>
							),
						}),
						...(inputAdornment && {
							startAdornment: (
								<InputAdornment position='start'>
									{inputAdornment}
								</InputAdornment>
							),
						}),
						...(endButton && {
							endAdornment: (
								<InputAdornment position='end'>
									<Tooltip
										title={endButton?.tooltip}
										arrow
									>
										<IconButton
											onClick={endButton?.onClick}
											sx={{ margin: '-15px' }}
										>
											<img
												src={endButton?.icon}
												width={22}
												height={22}
											/>
										</IconButton>
									</Tooltip>
								</InputAdornment>
							),
						}),
						sx: innerInputSx,
					}}
					multiline={type === 'textarea'}
					rows={rows}
					maxRows={maxRows}
					onChange={onChange}
					onBlur={onBlur}
					value={value}
				/>
			</React.Fragment>
		);
};

export default Input;
