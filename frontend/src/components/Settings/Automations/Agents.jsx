import { IconButton } from '@mui/material';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addAgentModal } from '../../../redux/actions/modal.actions';

const Agents = () => {
  const dispatch = useDispatch();

  const agents = useSelector(state => state.agentReducer.allAgents);

  const openAddAgentModal = () => {
    dispatch(addAgentModal({
      isOpen: true,
    }));
  };

  return (
    <React.Fragment>
      <div className='d-flex justify-content-between mb-1'>
        <h6 className='mb-0'>
          Agents
        </h6>
        <IconButton onClick={openAddAgentModal}>
          <img src='/images/add-icon.svg' alt="Add icon"/>
        </IconButton>
      </div>
      <p className='settings-subtext grey'>
        Create agents that perform a series of actions
        to extract some customer information.
      </p>
      {agents?.map(agent => {
        return (
          <div className='slider-container d-flex justify-content-between mb-2'>
            {agent?.name}
          </div>
        );
      })}
    </React.Fragment>
  )
}

export default Agents;