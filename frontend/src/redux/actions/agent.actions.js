import krispyAxios from '../../utilities/krispyAxios';

export const GET_ALL_AGENTS = 'GET_ALL_AGENTS';

export const getAllAgents = () => {
  return async (dispatch) => {
    const { agents } = await krispyAxios({
      method: 'GET',
      url: 'agents'
    });
    dispatch({
      type: GET_ALL_AGENTS,
      payload: agents || [],
    });
  };
};
