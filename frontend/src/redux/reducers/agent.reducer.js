import * as Actions from '../actions/agent.actions';

const initialState = {
  allAgents: null,
};

export const agentReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.GET_ALL_AGENTS:
      return (state = {
        ...state,
        allAgents: payload,
      });
    default:
      return state;
  }
};
