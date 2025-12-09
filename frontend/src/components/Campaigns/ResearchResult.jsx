import { Chip, IconButton } from '@mui/material';
import Link from 'next/link';
import React from 'react';
import truncateString from '../../utilities/truncateString';

const chipColors = [
	{ color: '#68CBBA', bgColor: '#E6F6F3' },
	{ color: '#5C78FF', bgColor: '#EFF1FF' },
	{ color: '#E14500', bgColor: '#FFEDE6' },
];

const ResearchResult = ({ result }) => {
	return (
		<div className='col-3 '>
			<Link
				style={{ textDecoration: 'none' }}
				href='/dashboard/campaigns/magicDetail'
			>
				<div className='shadow-none research-result-container'>
					<div className='shadow-none'>
						<div className='flex items-center justify-between'>
							<span className='f-sm-regular grey mb-0'>
								{truncateString(result?.title, 25)}
							</span>
							<IconButton>
								<img src='/images/ellipsis-icon.svg' />
							</IconButton>
						</div>
						<p className='f-sm-regular black mt-[-0px]'>
							{truncateString(result?.subtitle, 25)}
						</p>
					</div>
					<div className='flex justify-end'>
						<Chip
							label={result?.label}
							sx={{
								backgroundColor: chipColors[result.chipColorIndex].bgColor,
								color: chipColors[result.chipColorIndex].color,
								borderRadius: '6px',
							}}
						/>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default ResearchResult;
