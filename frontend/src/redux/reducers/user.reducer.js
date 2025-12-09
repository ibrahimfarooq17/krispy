import * as Actions from '../actions/user.actions';

const initialState = {
  currentUser: null,
};

export const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.GET_CURRENT_USER:
      return (state = {
        ...state,
        currentUser: payload,
      });
    default:
      return state;
  }
};
