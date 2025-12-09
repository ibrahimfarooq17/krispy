'use client';
import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import Heading from '../../../components/@generalComponents/Heading';
import AdditionalInfo from '../../../components/Settings/KnowledgeBase/AdditionalInfo';
import BusinessInfo from '../../../components/Settings/KnowledgeBase/BusinessInfo';
import SettingsLayout from '../../../layout/SettingsLayout';

const KnowledgeBase = () => {
	const [currentTab, setCurrentTab] = useState('0');

	return (
		<SettingsLayout>
			<div className='flex flex-col'>
				<Heading
					title={'Knowledge base'}
					subtitle={'Import all your relevant data to train your dedicated AI'}
				/>
				<div className='mb-4'>
					<Tabs
						textColor='red'
						value={currentTab}
						onChange={(e, value) => setCurrentTab(value)}
					>
						<Tab
							label='Business Information'
							className='text-[#7C7C7C]'
							value='0'
						/>
						<Tab
							label='Additional Information'
							className='text-[#7C7C7C]'
							value='1'
						/>
					</Tabs>
				</div>
				{currentTab === '0' ? <BusinessInfo /> : <AdditionalInfo />}
			</div>
		</SettingsLayout>
	);
};

export default KnowledgeBase;
