import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import {
	sidebarActiveNavLinks,
	sidebarBottomNavLinks,
} from '../../exports/commonExports';
import CustomButton from '../@generalComponents/CustomButton';

const Sidebar = () => {
	const pathname = usePathname();
	const router = useRouter();

	const currentUser = useSelector((state) => state.userReducer.currentUser);

	const logOut = () => {
		if (typeof window !== 'undefined') {
			localStorage.clear();
			router.push('/login');
			window.location.reload();
		}
	};

	return (
		<div className='sidebar'>
			{/* <h2 className='sidebar-title mb-0'>Krispy</h2> */}
			<img
				src='/images/logo-main.png'
				width={120}
				height={25}
				alt='Krispy logo'
			/>
			<p className='sidebar-subtitle mb-0 mt-1'>
				{currentUser?.firstName + ' ' + currentUser?.lastName}
			</p>
			<div className='sidebar-links'>
				{sidebarActiveNavLinks?.map((link, index) => {
					const active = pathname.includes(link.link);
					return (
						<div
							className={`sidebar-link-item ${active && 'active'}`}
							key={index}
							onClick={() => router.push(link.link)}
						>
							<img
								src={active ? link.iconActive : link.icon}
								alt={link.name}
							/>
							<p className={`sidebar-link-name ${active && 'active'}`}>
								{link.name}
							</p>
						</div>
					);
				})}
			</div>
			<div className='sidebar-bottom-links mb-4'>
				{sidebarBottomNavLinks?.map((link, index) => {
					const active = pathname.includes(link.link);
					return (
						<div
							className={`sidebar-link-item ${active && 'active'}`}
							key={index}
							onClick={() => router.push(link.link)}
						>
							<img
								src={link.icon}
								alt={link.name}
							/>
							<p className={`sidebar-link-name ${active && 'active'}`}>
								{link.name}
							</p>
							&nbsp; &nbsp; &nbsp; &nbsp;
						</div>
					);
				})}
				<CustomButton
					type='medium-purple'
					label='Log Out'
					customStyle={{ marginTop: '10px' }}
					icon={
						<img
							src='/images/log-out-icon.svg'
							width={22}
							height={22}
							alt='Logout icon'
						/>
					}
					onClick={logOut}
				/>
			</div>
			<div className='sidebar-bottom-button'></div>
		</div>
	);
};

export default Sidebar;
