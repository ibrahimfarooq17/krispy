import React from 'react';

const ComingSoon = () => {
	return (
		<div
			className='d-flex justify-content-center align-items-center'
			style={{ height: '100vh' }}
		>
			<div>
				<p
					className='text-center'
					style={{
						fontSize: '30px',
						textTransform: 'uppercase',
						letterSpacing: '9px',
						fontWeight: 100,
					}}
				>
					Coming Soon
				</p>
				<img
					src='/images/maintenance-graphic.svg'
					style={{ width: '60vw', height: '60vh' }}
					alt='maintenance icon'
				/>
			</div>
		</div>
	);
};

export default ComingSoon;
