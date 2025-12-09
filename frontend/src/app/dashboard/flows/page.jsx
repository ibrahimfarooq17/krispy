'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Heading from '../../../components/@generalComponents/Heading';
import Loader from '../../../components/@generalComponents/Loader';
import FlowItem from '../../../components/Flows/FlowItem';
import MainLayout from '../../../layout/MainLayout';
import {
	clearAllFlows,
	getAllFlows,
} from '../../../redux/actions/flow.actions';
import krispyAxios from '../../../utilities/krispyAxios';

const Flows = () => {
	const dispatch = useDispatch();
	const router = useRouter();

	const flows = useSelector((state) => state.flowReducer.flows);

	useEffect(() => {
		dispatch(getAllFlows());
		return () => dispatch(clearAllFlows());
	}, []);

	const createFlow = () => {
		router.push('/dashboard/flows/create');
	};

	const editFlow = (flowId) => {
		router.push(`/dashboard/flows/${flowId}`);
	};

	const onSwitchChange = async (e, flowId) => {
		const checked = e?.target?.checked;
		await krispyAxios({
			method: 'PATCH',
			url: `flows/${flowId}`,
			body: {
				isActive: checked,
			},
			loadingMessage: 'Updating active status...',
			successMessage: 'Flow active status updated.',
		});
		dispatch(getAllFlows());
	};

	const deleteFlow = async (flowId) => {
		await krispyAxios({
			method: 'DELETE',
			url: `flows/${flowId}`,
			loadingMessage: 'Deleting flow...',
			successMessage: 'Flow deleted.',
			onSuccess: () => dispatch(getAllFlows()),
		});
		dispatch(getAllFlows());
	};

	return (
		<MainLayout>
			<Loader renderChildren={flows}>
				<div className='flex flex-col px-8 py-4'>
					<Heading
						title={'Flows'}
						subtitle={
							'Create flows that perform a series of actions upon the occurence of a trigger.'
						}
						buttons={[
							{
								text: 'Create new flow',
								onClick: createFlow,
								image: {
									url: '/images/add-icon.svg',
									altText: 'plus icon',
								},
							},
						]}
					/>
					<div className='flex flex-col gap-4'>
						{flows &&
							flows.map((flow) => {
								return (
									<FlowItem
										flow={flow}
										editFlow={editFlow}
										onSwitchChange={onSwitchChange}
										deleteFlow={deleteFlow}
									/>
								);
							})}
					</div>
				</div>
			</Loader>
		</MainLayout>
	);
};

export default Flows;
