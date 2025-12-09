import * as Actions from '../actions/preference.actions';

const initialState = {
  entityPreferences: null,
};

export const preferenceReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.GET_PREFERENCES:
      return (state = {
        ...state,
        entityPreferences: payload,
      });
    default:
      return state;
  }
};
