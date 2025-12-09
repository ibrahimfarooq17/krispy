const Heading = ({ title, subtitle, buttons }) => {
	return (
		<div className='flex flex-row justify-between items-center mb-4'>
			<div>
				<h1 className='text-xl font-medium m-0 text-slate-700'>{title}</h1>
				{subtitle && <p className='text-sm text-slate-500 m-0'>{subtitle}</p>}
			</div>
			{buttons &&
				buttons.map((button, index) => (
					<button
						key={index}
						onClick={button.onClick}
						className='px-3 py-2 bg-slate-100 rounded-md flex items-center gap-2 hover:bg-slate-200 ease-in-out duration-100'
					>
						{button?.image?.url && (
							<img
								src={button.image.url}
								alt={button.image.altText}
							/>
						)}
						{button.text}
					</button>
				))}
		</div>
	);
};

export default Heading;
