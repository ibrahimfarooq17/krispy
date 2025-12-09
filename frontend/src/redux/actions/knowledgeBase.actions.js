import krispyAxios from '../../utilities/krispyAxios';

export const GET_KNOWLEDGE_BASE = 'GET_KNOWLEDGE_BASE';

export const getKnowledgeBase = () => {
  return async (dispatch) => {
    const { knowledgeBase } = await krispyAxios({
      method: 'GET',
      url: 'knowledge-bases',
    });
    dispatch({
      type: GET_KNOWLEDGE_BASE,
      payload: knowledgeBase || {},
    });
  };
};
