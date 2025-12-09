'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../components/@generalComponents/Loader';
import SettingsSidebar from '../components/layout/SettingsSidebar';
import MainLayout from './MainLayout.jsx';

const SettingsLayout = ({ children }) => {
	const router = useRouter();

	const currentUser = useSelector((state) => state.userReducer.currentUser);
	const preferences = useSelector(
		(state) => state.preferenceReducer.entityPreferences
	);

	useEffect(() => {
		if (
			router &&
			typeof window != 'undefined' &&
			!localStorage.getItem('accessToken')
		)
			router.push('/login');
	}, [router]);

	return (
		<MainLayout>
			<Loader renderChildren={currentUser && preferences}>
				<div className=''>
					<div className='flex'>
						<div className='w-1/6 fixed'>
							<div className='p-4 !border-r h-screen -mt-2'>
								<SettingsSidebar />
							</div>
						</div>
						<div className='w-4/5 ml-auto'>
							<div className='py-4 pr-8'>{children}</div>
						</div>
					</div>
				</div>
			</Loader>
		</MainLayout>
	);
};

export default SettingsLayout;
