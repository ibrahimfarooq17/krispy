'use client';
import { IconButton } from '@mui/material';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import CustomButton from '../@generalComponents/CustomButton';
import Input from '../@generalComponents/Input';

const Block = ({ data, setData }) => {
	const addUtterance = () => {
		setData({
			...data,
			utterances: [...data?.utterances, ''],
		});
	};

	const onUtteranceChange = (event, index) => {
		const { value } = event?.target;
		const clonedUtterances = cloneDeep(data?.utterances);
		clonedUtterances[index] = value;
		setData({ ...data, utterances: clonedUtterances });
	};

	const deleteUtterance = (index) => {
		const clonedUtterances = cloneDeep(data?.utterances);
		clonedUtterances.splice(index, 1);
		setData({ ...data, utterances: clonedUtterances });
	};

	return (
		<React.Fragment>
			<p className='font-[600] text-[24px] m-0'>Block</p>
			<p className='font-[400] text-[14px] text-[#5E5E5E] mb-5'>
				Define what your route is and add the utterances
			</p>
			<div className='w-[60%]'>
				<Input
					label='Name'
					value={data?.blockName}
					onChange={(e) => setData({ ...data, blockName: e?.target?.value })}
				/>
				<div className='row mb-2 mt-4'>
					<div className='col-10'>
						<label className='input-label'>Utterances</label>
						<p className='font-[400] text-[14px] text-[#5E5E5E]'>
							These sentences help AI to route the flow to this block
						</p>
					</div>
					<div className='col-2 d-flex align-items-center'>
						<CustomButton
							type='medium-purple'
							label='Add'
							onClick={addUtterance}
						/>
					</div>
				</div>
				{data?.utterances?.map((utterance, index) => {
					return (
						<div className='d-flex'>
							<Input
								value={utterance}
								onChange={(e) => onUtteranceChange(e, index)}
							/>
							<IconButton
								style={{ marginLeft: '10px', height: '100%' }}
								onClick={() => deleteUtterance(index)}
								hidden={data.utterances.length === 1}
							>
								<img
									src='/images/bin-icon.svg'
									width={20}
									alt='Bin icon'
								/>
							</IconButton>
						</div>
					);
				})}
			</div>
		</React.Fragment>
	);
};

export default Block;
