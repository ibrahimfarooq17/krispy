import * as Actions from '../actions/connector.actions';

const initialState = {
  allConnectors: null,
};

export const connectorReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.GET_ALL_CONNECTORS:
      return (state = {
        ...state,
        allConnectors: payload,
      });
    default:
      return state;
  }
};
