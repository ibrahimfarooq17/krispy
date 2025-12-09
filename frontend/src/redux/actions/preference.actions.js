import krispyAxios from '../../utilities/krispyAxios';

export const GET_PREFERENCES = 'GET_PREFERENCES';

export const getPreferences = () => {
  return async (dispatch) => {
    const { preference } = await krispyAxios({
      method: 'GET',
      url: 'preferences/get',
    });
    dispatch({
      type: GET_PREFERENCES,
      payload: preference,
    });
  };
};
