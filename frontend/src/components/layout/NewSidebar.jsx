import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import {
	sidebarActiveNavLinks,
	sidebarBottomNavLinks,
} from '../../exports/commonExports';
import NavItem from '../@generalComponents/NavItem';

const NewSidebar = () => {
	const pathname = usePathname();
	const router = useRouter();

	const logOut = () => {
		if (typeof window !== 'undefined') {
			localStorage.clear();
			router.push('/login');
			window.location.reload();
		}
	};

	return (
		<div className='px-2 h-full flex flex-col justify-between'>
			<div className='w-full flex flex-col items-center'>
				<Link href='/'>
					<Image
						src='/images/logo.svg'
						alt='Krispy logo icon'
						width={40}
						height={40}
					/>
				</Link>
				<div className='flex flex-col gap-3 mt-4'>
					{sidebarActiveNavLinks?.map((link, index) => {
						const active = pathname.includes(link.link);
						return (
							<NavItem
								link={link}
								active={active}
								index={index}
								router={router}
							/>
						);
					})}
				</div>
			</div>
			<div className='w-full flex flex-col items-center'>
				{sidebarBottomNavLinks?.map((link, index) => {
					return (
						<NavItem
							link={link}
							index={index}
							onClick={logOut}
							router={router}
						/>
					);
				})}
			</div>
		</div>
	);
};

export default NewSidebar;
