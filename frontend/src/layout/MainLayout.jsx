'use client';
import { Alert, AlertTitle, ThemeProvider, createTheme } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import CustomButton from '../components/@generalComponents/CustomButton';
import Loader from '../components/@generalComponents/Loader';
import Header from '../components/layout/Header';
import NewSidebar from '../components/layout/NewSidebar';

const MainLayout = ({ children }) => {
	const router = useRouter();
	const pathname = usePathname();
	const currentUser = useSelector((state) => state.userReducer.currentUser);
	const preferences = useSelector(
		(state) => state.preferenceReducer.entityPreferences
	);

	const theme = createTheme({
		palette: {
			orange: {
				light: '#eff1ff',
				main: '#FD4F02',
				dark: '#fd601b',
				contrastText: '#fff',
			},
		},
	});

	useEffect(() => {
		if (
			router &&
			typeof window != 'undefined' &&
			!localStorage.getItem('accessToken')
		)
			router.push('/login');
	}, [router]);

	const goToOnboarding = () => {
		router.push(`/onboard?step=${preferences?.onboardingStep + 1}`);
	};
	return (
		<ThemeProvider theme={theme}>
			<Loader renderChildren={currentUser && preferences}>
				<div className='w-full h-full font-inter'>
					<div>
						<div className='bg-white h-full overflow-y-auto fixed top-0 z-20 !border-r w-auto py-3'>
							<NewSidebar />
						</div>
						<div className='ml-14 mt-20 !h-full'>
							<div className='main-panel-root'>
								<Header />
								<div>
									{preferences?.onboardingStep < 1 &&
										pathname !== '/onboard' &&
										!pathname?.includes('/settings') && (
											<Alert
												severity='error'
												sx={{ background: '#ffede6' }}
												action={
													<div className='d-flex align-items-center h-100'>
														<CustomButton
															label='Onboard now'
															type='medium-purple'
															size='small'
															onClick={goToOnboarding}
														/>
													</div>
												}
											>
												<AlertTitle>Hold on!</AlertTitle>
												You have not completed your onboarding yet.
											</Alert>
										)}
									{children}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Loader>
		</ThemeProvider>
	);
};

export default MainLayout;
