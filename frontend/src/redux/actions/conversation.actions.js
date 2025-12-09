import krispyAxios from '../../utilities/krispyAxios';

export const GET_CONVERSATIONS = 'GET_CONVERSATIONS';
export const GET_PAGINATED_CHATS = 'GET_PAGINATED_CHATS';
export const CLEAR_PAGINATED_CHATS = 'CLEAR_PAGINATED_CHATS';
export const GET_SINGLE_CHAT = 'GET_SINGLE_CHAT';
export const CLEAR_SINGLE_CHAT = 'CLEAR_SINGLE_CHAT';

export const getConversations = () => {
  return async (dispatch) => {
    const { chats } = await krispyAxios({
      method: 'GET',
      url: 'chats/all?type=whatsapp',
    });
    dispatch({
      type: GET_CONVERSATIONS,
      payload: chats || [],
    });
  };
};

export const getPaginatedChats = (type, page) => {
  return async (dispatch) => {
    const { chats, pagination } = await krispyAxios({
      method: 'GET',
      url: `chats/${page}?type=${type}`,
    });
    dispatch({
      type: GET_PAGINATED_CHATS,
      payload: {
        chats: chats || [],
        pagination: pagination || null
      }
    });
  };
};

export const clearPaginatedChats = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_PAGINATED_CHATS,
      payload: {
        chats: [],
        pagination: null
      }
    });
  };
};

export const getSingleChat = (chatId) => {
  return async (dispatch) => {
    const response = await krispyAxios({
      method: 'GET',
      url: `messages/chat/${chatId}`,
    });
    dispatch({
      type: GET_SINGLE_CHAT,
      payload: response?.messages,
    });
  };
};

export const clearSingleChat = () => {
  return (dispatch) => {
    dispatch({
      type: CLEAR_SINGLE_CHAT,
      payload: null,
    });
  };
};
