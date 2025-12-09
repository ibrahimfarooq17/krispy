import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import krispyAxios from '../../../utilities/krispyAxios';
import CustomButton from '../../@generalComponents/CustomButton';
import Input from '../../@generalComponents/Input';

const BusinessInfo = () => {
	const [resLoading, setResLoading] = useState(false);
	const [formState, setFormState] = useState();

	const knowledgeBase = useSelector(
		(state) => state.knowledgeBaseReducer.knowledgeBase
	);

	console.log(knowledgeBase);
	console.log(formState);

	useEffect(() => {
		if (knowledgeBase)
			setFormState({
				aboutUs: knowledgeBase?.aboutUs,
				aiName: knowledgeBase?.aiName,
				systemPrompt: knowledgeBase.systemPrompt,
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
				aboutUs: formState?.aboutUs,
				aiName: formState?.aiName,
				systemPrompt: formState.systemPrompt,
			},
			loadingStateSetter: setResLoading,
			successMessage: 'Knowledge base updated.',
		});
	};

	return (
		<div className='flex flex-col gap-2'>
			<div>
				<label className='text-sm font-medium text-slate-500 mb-1'>
					AI agent name
				</label>
				<Input
					thin
					name='aiName'
					value={formState?.aiName}
					onChange={changeHandler}
				/>
			</div>
			<div>
				<label className='text-sm font-medium text-slate-500 mb-1'>
					System prompt
				</label>
				<Input
					thin
					type='textarea'
					name='systemPrompt'
					value={formState?.systemPrompt}
					onChange={changeHandler}
				/>
			</div>
			<div>
				<label className='text-sm font-medium text-slate-500 mb-1'>
					About us
				</label>
				<Input
					thin
					type='textarea'
					name='aboutUs'
					value={formState?.aboutUs}
					onChange={changeHandler}
				/>
			</div>
			<div className='w-fit ml-auto mt-2'>
				<CustomButton
					type='medium-purple'
					label='Save'
					loading={resLoading}
					onClick={handleSubmit}
				/>
			</div>
		</div>
	);
};

export default BusinessInfo;
