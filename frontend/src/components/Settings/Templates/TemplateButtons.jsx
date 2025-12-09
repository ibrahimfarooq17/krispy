import { Divider, IconButton } from '@mui/material';
import { cloneDeep } from 'lodash';
import React from 'react';
import { TEMPLATE_BUTTONS } from '../../../exports/commonExports';
import generateRandomString from '../../../utilities/generateRandomString';
import Input from '../../@generalComponents/Input';

const TemplateButtons = ({ buttons, setButtons }) => {
	const addButton = () => {
		setButtons([
			...buttons,
			{
				id: generateRandomString(15),
				type: 'QUICK_REPLY',
				text: 'Display text',
			},
		]);
	};

	const removeButton = (buttonId) => {
		const clonedButtons = cloneDeep(buttons);
		const filteredButtons = clonedButtons?.filter(
			(button) => button?.id !== buttonId
		);
		setButtons(filteredButtons);
	};

	const changeHandler = (e, buttonId) => {
		const { name, value } = e?.target;
		const clonedButtons = cloneDeep(buttons);
		const foundButton = clonedButtons?.find(
			(button) => button?.id === buttonId
		);
		foundButton[name] = value;
		setButtons(clonedButtons);
	};

	const addNewUtm = (buttonId) => {
		const clonedButtons = cloneDeep(buttons);
		const foundButton = clonedButtons?.find(
			(button) => button?.id === buttonId
		);
		const newUtm = {
			id: generateRandomString(15),
			key: '',
			value: '',
		};
		if (foundButton.utms) foundButton.utms = [...foundButton.utms, newUtm];
		else foundButton.utms = [newUtm];
		setButtons(clonedButtons);
	};

	const onUtmChange = (e, utmId, buttonId) => {
		const { name, value } = e?.target;
		const clonedButtons = cloneDeep(buttons);
		const foundButton = clonedButtons?.find(
			(button) => button?.id === buttonId
		);

		const clonedUtms = cloneDeep(foundButton.utms);
		const foundUtm = clonedUtms?.find((utm) => utm?.id === utmId);
		foundUtm[name] = value;

		foundButton.utms = clonedUtms;
		setButtons(clonedButtons);
	};

	return (
		<div className='col-md-12 mt-3'>
			<div className=' d-flex justify-content-between'>
				<div>
					<label className='input-label'>Buttons</label>
				</div>
				<IconButton onClick={addButton}>
					<img
						src='/images/add-icon.svg'
						width={20}
						height={20}
						alt='Add icon'
					/>
				</IconButton>
			</div>
			{buttons.map((button) => {
				return (
					<div className='row'>
						<Divider
							sx={{
								border: '1px solid #ECECEC',
								marginTop: '15px',
								marginBottom: '30px',
							}}
						/>
						<div className='col-md-10'>
							<div className='row'>
								<div className='col-md-4'>
									<label className='input-label me-2'>Type</label>
									<Input
										thin
										type='select'
										name='type'
										options={TEMPLATE_BUTTONS}
										value={button?.type}
										onChange={(e) => changeHandler(e, button?.id)}
									/>
								</div>
								<div className='col-md-8'>
									<Input
										thin
										type='text'
										name='text'
										label='Display Text'
										maxLength={25}
										value={button?.text}
										onChange={(e) => changeHandler(e, button?.id)}
									/>
								</div>
								{button?.type === 'URL' && (
									<div className='col-md-12'>
										<Input
											thin
											type='text'
											name='url'
											label='URL'
											maxLength={2000}
											value={button?.url}
											onChange={(e) => changeHandler(e, button?.id)}
										/>
										<label className='input-label'>UTMs</label>
										{button?.utms?.map((utm) => {
											return (
												<div className='row'>
													<div className='col-md-6'>
														<Input
															type='text'
															name='key'
															placeholder='Key'
															value={utm?.key}
															onChange={(e) =>
																onUtmChange(e, utm?.id, button?.id)
															}
														/>
													</div>
													<div className='col-md-6'>
														<Input
															type='text'
															name='value'
															placeholder='Value'
															value={utm?.value}
															onChange={(e) =>
																onUtmChange(e, utm?.id, button?.id)
															}
														/>
													</div>
												</div>
											);
										})}
										<div className='col-md-12'>
											<IconButton onClick={() => addNewUtm(button?.id)}>
												<img
													src='/images/add-icon.svg'
													alt='Add icon'
												/>
												<p className='mb-0 ms-2 text-[13px] font-[700]'>
													Add new utm
												</p>
											</IconButton>
										</div>
									</div>
								)}
							</div>
						</div>
						<div className='col-md-2 d-flex align-items-center justify-content-center'>
							<IconButton onClick={() => removeButton(button?.id)}>
								<img
									src='/images/bin-icon.svg'
									width={20}
									height={20}
									alt='Bin icon'
								/>
							</IconButton>
						</div>
					</div>
				);
			})}
			<p className='input-subtitle'>
				A template may contain upto 10 buttons. A button can be either a URL
				button or a quick reply one. Variables can only be added on URL buttons
				for now.
			</p>
		</div>
	);
};

export default TemplateButtons;
