import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { settingsSidebarLinks } from '../../exports/commonExports';

const SettingsSidebar = () => {
	const pathname = usePathname();
	const router = useRouter();

	return (
		<div className='flex flex-col gap-8'>
			<h6 className='text-2xl font-medium'>Settings</h6>
			<div className='text-sm flex flex-col gap-2'>
				{settingsSidebarLinks?.map((link, index) => {
					const active = pathname.includes(link.link);
					return (
						<div
							className={`py-2 rounded-lg cursor-pointer hover:bg-slate-100 hover:pl-3 hover:!border-l-2 hover:border-orange-500 hover:rounded-l-none transition-all ease-out duration-150 ${
								active
									? 'bg-slate-100 pl-3 !border-l-2 border-orange-500 rounded-l-none font-medium'
									: ''
							}`}
							key={index}
							onClick={() => router.push(link.link)}
						>
							<span>{link.name}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default SettingsSidebar;
