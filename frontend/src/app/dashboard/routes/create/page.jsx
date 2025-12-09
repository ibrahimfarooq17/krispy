'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CustomButton from '../../../../components/@generalComponents/CustomButton';
import Action from '../../../../components/Routes/Action';
import Block from '../../../../components/Routes/Block';
import Form from '../../../../components/Routes/Form';
import MainLayout from '../../../../layout/MainLayout';
import generateRandomString from '../../../../utilities/generateRandomString';
import krispyAxios from '../../../../utilities/krispyAxios';

const CreateRoute = ({}) => {
	const LAST_STEP = 2;
	const router = useRouter();

	const [resLoading, setResLoading] = useState(false);
	const [allActions, setAllActions] = useState();
	const [step, setStep] = useState(0);
	const [data, setData] = useState({
		name: '',
		utterances: [''],
		formDesc: '',
		formFields: [
			{
				key: generateRandomString(10),
				name: '',
				type: 'str',
				description: '',
			},
		],
		actionId: null,
		actionMetadata: {},
	});

	useEffect(() => {
		getActions();
	}, []);

	const getActions = async () => {
		const { aiActions } = await krispyAxios({
			method: 'GET',
			url: 'ai-actions',
		});
		setAllActions(aiActions);
	};

	const nextStep = () => setStep(step + 1);
	const previousStep = () => setStep(step - 1);

	const isStepComplete = () => {
		if (step === 0)
			return data.blockName !== '' && data?.utterances?.[0] !== '';
		if (step === 1)
			return (
				data.formDesc !== '' &&
				data?.formFields?.[0].name !== '' &&
				data?.formFields?.[0].description !== ''
			);
		if (step === 2)
			return (
				data.actionId !== null &&
				Object.keys(data.actionMetadata).length !== 0 &&
				data.actionMetadata.webhookUrl.trim() !== ''
			);
	};

	const saveRoute = async () => {
		let formFields = {};
		data?.formFields?.map(
			(field) =>
				(formFields[field.name] = {
					type: field.type,
					description: field.description,
				})
		);

		const { form } = await krispyAxios({
			method: 'POST',
			url: 'forms',
			body: {
				name: `Form-${data.blockName}`,
				description: data.formDesc,
				fields: formFields,
			},
			loadingStateSetter: setResLoading,
		});

		if (!form) return;

		const { semanticRouter } = await krispyAxios({
			method: 'POST',
			url: 'semantic-routers',
			body: {
				name: data.blockName,
				utterances: data.utterances,
				forms: [form?.formId],
				actions: [
					{
						actionId: data.actionId,
						actionMetadata:
							Object.keys(data.actionMetadata).length > 0
								? {
										webhookUrl: data.actionMetadata?.webhookUrl,
								  }
								: {},
					},
				],
			},
			loadingStateSetter: setResLoading,
			successMessage: 'Route created!',
			onSuccess: () => router.push('/dashboard/routes'),
		});

		if (!semanticRouter) return;
	};

	return (
		<MainLayout>
			<div className='container'>
				<div className='row d-flex justify-content-center'>
					<div className='col-md-7 p-[45px] !border border-slate-300 rounded-md mt-5'>
						{step == 0 ? (
							<Block
								data={data}
								setData={setData}
							/>
						) : step == 1 ? (
							<Form
								data={data}
								setData={setData}
							/>
						) : (
							<Action
								data={data}
								setData={setData}
								allActions={allActions}
							/>
						)}
						<div className='row flex justify-between mt-5'>
							<div className={`col-3 ${step === 0 ? 'hidden' : ''}`}>
								<CustomButton
									type='medium-purple'
									label='Previous'
									disabled={step === 0}
									onClick={previousStep}
								/>
							</div>
							<div className='col-3 ml-auto'>
								<CustomButton
									type='medium-purple'
									label={step === LAST_STEP ? 'Save' : 'Next'}
									onClick={step === LAST_STEP ? saveRoute : nextStep}
									disabled={!isStepComplete()}
									loading={resLoading}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</MainLayout>
	);
};

export default CreateRoute;
