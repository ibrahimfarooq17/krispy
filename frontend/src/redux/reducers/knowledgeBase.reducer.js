import * as Actions from '../actions/knowledgeBase.actions';

const initialState = {
  knowledgeBase: null,
};

export const knowledgeBaseReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.GET_KNOWLEDGE_BASE:
      return (state = {
        ...state,
        knowledgeBase: payload,
      });
    default:
      return state;
  }
};
