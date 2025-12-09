'use client';
import { Divider, IconButton } from '@mui/material';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import generateRandomString from '../../utilities/generateRandomString';
import CustomButton from '../@generalComponents/CustomButton';
import Input from '../@generalComponents/Input';

const Form = ({ data, setData }) => {
	const addField = () => {
		setData({
			...data,
			formFields: [
				...data?.formFields,
				{
					key: generateRandomString(10),
					name: '',
					type: 'str',
					description: '',
				},
			],
		});
	};

	const changeHandler = (e, key) => {
		const { name, value } = e?.target;
		const clonedFields = cloneDeep(data?.formFields);
		const foundField = clonedFields.find((field) => field?.key === key);
		if (!foundField) return;
		foundField[name] = value;
		setData({ ...data, formFields: clonedFields });
	};

	const removeField = (key) => {
		const filteredFields = data?.formFields?.filter(
			(field) => field?.key !== key
		);
		setData({ ...data, formFields: filteredFields });
	};

	return (
		<React.Fragment>
			<p className='font-[600] text-[24px] m-0'>Form</p>
			<p className='font-[400] text-[14px] text-[#5E5E5E] mb-5'>
				Add what data you need from the user
			</p>
			<div className='w-[60%]'>
				<Input
					label='Description'
					type='textarea'
					rows={1}
					maxRows={1}
					value={data?.formDesc}
					onChange={(e) => setData({ ...data, formDesc: e?.target?.value })}
				/>
				<div className='row mb-2 mt-4'>
					<div className='col-10'>
						<label className='input-label'>Fields</label>
						<p className='font-[400] text-[14px] text-[#5E5E5E]'>
							Add the fields and its data type that this form should collect
						</p>
					</div>
					<div className='col-2 d-flex align-items-center'>
						<CustomButton
							type='medium-purple'
							label='Add'
							onClick={addField}
						/>
					</div>
				</div>
				{data?.formFields?.map((field, index) => {
					return (
						<div className='row mb-3'>
							<div className='col-md-10'>
								<div className='row'>
									<div className='col-md-6'>
										<Input
											thin
											label='Name'
											type='text'
											name='name'
											value={field?.name}
											onChange={(e) => changeHandler(e, field.key)}
										/>
									</div>
									<div className='col-md-6'>
										<label className='input-label'>Type</label>
										<Input
											type='select'
											name='type'
											options={[
												{
													label: 'String',
													value: 'str',
												},
												{
													label: 'Number',
													value: 'int',
												},
											]}
											value={field?.type}
											onChange={(e) => changeHandler(e, field.key)}
										/>
									</div>
									<div className='col-md-12'>
										<Input
											thin
											label='Description'
											type='textarea'
											name='description'
											value={field?.description}
											onChange={(e) => changeHandler(e, field.key)}
											rows={1}
											maxRows={1}
										/>
									</div>
								</div>
							</div>
							<div className='col-md-2 d-flex align-items-center'>
								<IconButton
									onClick={() => removeField(field?.key)}
									hidden={data.formFields.length === 1}
								>
									<img
										src='/images/bin-icon.svg'
										width={20}
										alt='Bin icon'
									/>
								</IconButton>
							</div>
						</div>
					);
				})}
			</div>
		</React.Fragment>
	);
};

export default Form;
