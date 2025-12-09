'use client';
import React, { useEffect, useState } from 'react'
import SettingsLayout from '../../../layout/SettingsLayout'
import { Tab, Tabs } from '@mui/material';
import Loader from '../../../components/@generalComponents/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getAllAgents } from '../../../redux/actions/agent.actions';
import Agents from '../../../components/Settings/Automations/Agents';

const Automations = () => {
  const dispatch = useDispatch();

  const [currentTab, setCurrentTab] = useState('1');

  const agents = useSelector(state => state.agentReducer.allAgents);

  useEffect(() => {
    dispatch(getAllAgents());
  }, []);

  return (
    <SettingsLayout>
      <Loader renderChildren={agents}>
        <div className='row g-0 d-flex justify-content-center mt-3 mb-5'>
          <div className='col-md-12 p-2'>
            <Tabs
              textColor='red'
              style={{
                margin: '0 0 30px 0px',
              }}
              value={currentTab}
              onChange={(e, value) => setCurrentTab(value)}
            >
              <Tab label="Agents" className='text-[#7C7C7C]' value='1' />
            </Tabs>
            {currentTab === '1' ?
              <Agents />
              : null
            }
          </div>
        </div>
      </Loader>
    </SettingsLayout>
  );
};

export default Automations;