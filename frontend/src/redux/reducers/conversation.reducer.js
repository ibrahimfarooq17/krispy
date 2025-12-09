import * as Actions from '../actions/conversation.actions';

const initialState = {
  allConversations: null,
  paginatedChats: {
    chats: [],
    pagination: null
  },
  singleChat: null,
};

export const conversationReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.GET_CONVERSATIONS:
      return (state = {
        ...state,
        allConversations: payload,
      });
    case Actions.GET_PAGINATED_CHATS:
      return (state = {
        ...state,
        paginatedChats: {
          chats: [
            ...state.paginatedChats.chats,
            ...payload.chats
          ],
          pagination: payload.pagination
        }
      });
    case Actions.CLEAR_PAGINATED_CHATS:
      return (state = {
        ...state,
        paginatedChats: payload
      });
    case Actions.GET_SINGLE_CHAT:
      return (state = {
        ...state,
        singleChat: payload,
      });
    case Actions.CLEAR_SINGLE_CHAT:
      return (state = {
        ...state,
        singleChat: payload,
      });
    default:
      return state;
  }
};
