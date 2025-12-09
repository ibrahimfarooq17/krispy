'use client';
import { IconButton } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CustomButton from '../../../components/@generalComponents/CustomButton';
import Loader from '../../../components/@generalComponents/Loader';
import MainLayout from '../../../layout/MainLayout';
import krispyAxios from '../../../utilities/krispyAxios';

const RoutesDashboard = ({}) => {
	const router = useRouter();
	const [allRouters, setAllRouters] = useState({});

	useEffect(() => {
		getAllRouters();
	}, []);

	const getAllRouters = async () => {
		const { semanticRouters } = await krispyAxios({
			method: 'GET',
			url: 'semantic-routers',
		});

		setAllRouters(semanticRouters);
	};

	const deleteRouter = async (routerId) => {
		await krispyAxios({
			method: 'DELETE',
			url: `semantic-routers/${routerId}`,
			loadingMessage: 'Deleting route...',
			successMessage: 'Route deleted.',
			onSuccess: () => getAllRouters(),
		});
	};

	return (
		<MainLayout>
			<Loader renderChildren={allRouters}>
				<div className='p-4'>
					<div className='flex justify-between mb-4 items-center'>
						<h1 className='text-xl'>Routes</h1>
						<div>
							<CustomButton
								type='medium-purple'
								label='Add new route'
								onClick={() => router.push('routes/create')}
							/>
						</div>
					</div>
					<div className='flex flex-col gap-3'>
						{Object.keys(allRouters).length !== 0 ? (
							allRouters.map((router) => (
								<div className='bg-slate-100 p-3 flex justify-between items-center rounded-lg'>
									<div className='flex flex-col gap-1'>
										<span className='text-lg'>{router.name}</span>
										<span className='text-xs text-slate-500'>
											Webhook: {router.aiActionSessions[0].webhookUrl}
										</span>
									</div>
									<div>
										<IconButton
											onClick={() => deleteRouter(router?.semanticRouterId)}
										>
											<img
												src='/images/bin-icon.svg'
												width={20}
												alt='Bin icon'
											/>
										</IconButton>
									</div>
								</div>
							))
						) : (
							<div>
								No routes setup. Please create one by clicking the button above.
							</div>
						)}
					</div>
				</div>
			</Loader>
		</MainLayout>
	);
};

export default RoutesDashboard;
