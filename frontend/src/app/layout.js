'use client';
import { configureStore } from '@reduxjs/toolkit';
import 'bootstrap/dist/css/bootstrap.css';
import { toast, ToastBar, Toaster } from 'react-hot-toast';
import { Provider, useDispatch } from 'react-redux';
import 'reactflow/dist/style.css';
import GlobalCalls from '../components/@generalComponents/GlobalCalls';
import AllModalsRoot from '../modals';
import allReducers from '../redux/reducers';
import './globals.css';

const store = configureStore({
	reducer: allReducers,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<title>Krispy</title>
			<body>
				<Provider store={store}>
					{typeof window !== 'undefined' &&
						localStorage.getItem('accessToken') && <GlobalCalls />}
					<AllModalsRoot />
					{children}
					<Toaster
						position='bottom-center'
						toastOptions={{
							style: {
								color: '#475569',
								borderRadius: '0px 8px 8px 0',
								borderTop: '1px #f1f5f9 solid',
								borderRight: '1px #f1f5f9 solid',
								borderBottom: '1px #f1f5f9 solid',
								borderLeft: '2px #fd4f02 solid',
								boxShadow:
									'0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
								width: '50%',
							},
						}}
					>
						{(t) => (
							<ToastBar toast={t}>
								{({ icon, message }) => (
									<div className='flex px-2 gap-6 justify-between w-full'>
										<div className='flex'>
											{icon}
											<span className='font-medium'>{message}</span>
										</div>
										{t.type !== 'loading' && (
											<button
												onClick={() => toast.dismiss(t.id)}
												className='flex items-center justify-center flex-shrink-0'
											>
												<img
													src='/images/x-mark.svg'
													alt='cancel x-mark icon'
													width={22}
													height={22}
												/>
											</button>
										)}
									</div>
								)}
							</ToastBar>
						)}
					</Toaster>
				</Provider>
			</body>
		</html>
	);
}
