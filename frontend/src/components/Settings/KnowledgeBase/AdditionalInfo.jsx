import { IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addScrapingUrlModal } from '../../../redux/actions/modal.actions';
import krispyAxios from '../../../utilities/krispyAxios';
import CustomButton from '../../@generalComponents/CustomButton';
import Input from '../../@generalComponents/Input';

const AdditionalInfo = () => {
	const dispatch = useDispatch();

	const [resLoading, setResLoading] = useState(false);
	const [formState, setFormState] = useState();

	const knowledgeBase = useSelector(
		(state) => state.knowledgeBaseReducer.knowledgeBase
	);

	useEffect(() => {
		if (knowledgeBase)
			setFormState({
				additionalInfo: knowledgeBase?.additionalInfo,
			});
	}, [knowledgeBase]);

	const changeHandler = (e) => {
		const { name, value } = e?.target;
		setFormState({
			...formState,
			[name]: value,
		});
	};

	const handleSubmit = async () => {
		await krispyAxios({
			method: 'PATCH',
			url: `knowledge-bases`,
			body: {
				additionalInfo: formState?.additionalInfo,
			},
			loadingStateSetter: setResLoading,
			successMessage: 'Additional Information updated.',
		});
	};

	const openModalToAddUrl = () => {
		dispatch(
			addScrapingUrlModal({
				isOpen: true,
			})
		);
	};

	return (
		<React.Fragment>
			<div className='flex flex-col gap-4'>
				<div>
					<div className='flex justify-between items-center mb-2'>
						<span className='text-sm font-medium text-slate-500'>
							Scraping URLs
						</span>
						<button
							onClick={openModalToAddUrl}
							className='!border border-slate-200 flex gap-2 justify-center items-center p-2 rounded-md bg-slate-50 hover:bg-slate-200 ease-in-out duration-150'
						>
							<img
								src='/images/add-icon.svg'
								alt='Add icon'
							/>
							<span className='text-sm'>Add URL</span>
						</button>
					</div>
					<div className='flex flex-col gap-1 !border border-slate-200 rounded-lg p-3 bg-slate-100'>
						{knowledgeBase?.scrapingUrls?.map((url) => {
							return (
								<code>
									<a
										style={{ textDecoration: 'none' }}
										href={url}
										target='__blank'
									>
										{url}
									</a>
								</code>
							);
						})}
					</div>
				</div>
				<div>
					<label className='text-sm font-medium text-slate-500 mb-2'>
						Additional information
					</label>
					<Input
						thin
						type='textarea'
						name='additionalInfo'
						value={formState?.additionalInfo}
						onChange={changeHandler}
					/>
					<div className='w-fit ml-auto mt-2'>
						<CustomButton
							type='medium-purple'
							label='Save'
							loading={resLoading}
							onClick={handleSubmit}
						/>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default AdditionalInfo;
