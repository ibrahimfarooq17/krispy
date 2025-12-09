import krispyAxios from '../../utilities/krispyAxios';

export const GET_ALL_CONNECTORS = 'GET_ALL_CONNECTORS';

export const getAllConnectors = () => {
  return async (dispatch) => {
    const { connectors } = await krispyAxios({
      method: 'GET',
      url: 'connectors/all'
    });
    dispatch({
      type: GET_ALL_CONNECTORS,
      payload: connectors || [],
    });
  };
};
