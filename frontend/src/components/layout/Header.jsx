import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function () {
	const pathname = usePathname();
	const isSettingsActive = pathname.includes('/settings');

	const currentUser = useSelector((state) => state.userReducer.currentUser);

	return (
		<div className='flex gap-3 py-3 justify-between items-center z-10 bg-white fixed top-0 left-0 right-0 ml-14 px-8 !border-b font-inter '>
			<Link href='/'>
				<img
					src='/images/logo-name.svg'
					alt='Krispy logo with text'
					width={80}
					height={25}
				/>
			</Link>
			<div className='flex items-center gap-4'>
				<span class='font-bold text-sm text-slate-700'>
					{currentUser?.entity.name}
				</span>
				<Link href='/settings/general'>
					<div
						className={`${
							isSettingsActive ? '' : '!border-2 p-2 mr-1'
						}  rounded-full hover:border-orange-500 ease-in-out duration-100`}
					>
						{isSettingsActive ? (
							<img
								width='40px'
								src='/images/active-settings.svg'
								alt='settings icon active'
							/>
						) : (
							<img
								width='20px'
								src='/images/setting.svg'
								alt='settings icon'
							/>
						)}
					</div>
				</Link>
			</div>
		</div>
	);
}
