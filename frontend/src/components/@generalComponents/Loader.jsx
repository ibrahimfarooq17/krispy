import Lottie from 'lottie-react';
import React from 'react';
import * as animationData from '../../assets/lotties/logo-loader.json';

const Loader = ({ renderChildren, children }) => {
	if (!renderChildren)
		return (
			<div className='fixed flex flex-col items-center justify-center h-screen w-screen pb-32'>
				<Lottie
					data-testid='lottie-animation'
					animationData={animationData}
					rendererSettings={{
						preserveAspectRatio: 'xMidYMid slice',
					}}
					loop={true}
					autoplay={true}
					style={{ height: 250, width: 250 }}
				/>
			</div>
		);
	else return children;
};

export default Loader;
