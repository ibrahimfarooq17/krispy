import { IconButton } from '@mui/material';

const ChatInput = ({
	onSubmit,
	inputValue,
	isDisabled = false,
	onInputChange,
	placeholder,
}) => {
	return (
		<div className='!border rounded-lg p-3 bg-white'>
			<div className='flex gap-2 text-sm items-center'>
				<div className='flex flex-col gap-1 w-full'>
					<form
						onSubmit={onSubmit}
						className='mb-2'
					>
						<input
							className='w-full max-w-full outline-none'
							placeholder={placeholder}
							value={inputValue}
							disabled={isDisabled}
							onChange={onInputChange}
							autoFocus
						/>
					</form>
					<div className='flex gap-2'>
						<img
							src='/images/plus.svg'
							alt='Plus icon'
						/>
						<img
							src='/images/face-smile.svg'
							alt='Face smile icon'
						/>
						<img
							src='/images/at-symbol.svg'
							alt='@ (at) symbol icon'
						/>
					</div>
				</div>
				<IconButton
					onClick={onSubmit}
					sx={{
						backgroundColor: 'rgba(253, 79, 2, 0.9)',
						borderRadius: '4px',
						'&:hover': {
							backgroundColor: 'rgb(227, 70, 0)',
						},
					}}
					disabled={isDisabled}
				>
					<img
						src='/images/paper-airplane.svg'
						width={18}
						height={18}
						alt='Paper airplane icon'
					/>
				</IconButton>
			</div>
		</div>
	);
};

export default ChatInput;
