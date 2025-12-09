import krispyAxios from '../../utilities/krispyAxios';

export const GET_CURRENT_USER = 'GET_CURRENT_USER';

export const getCurrentUser = () => {
  return async (dispatch) => {
    const { user } = await krispyAxios({
      method: 'GET',
      url: 'users/me',
    });
    if (user && typeof window !== 'undefined')
      localStorage.setItem('currentUser', JSON.stringify({ user }));
    dispatch({
      type: GET_CURRENT_USER,
      payload: user,
    });
  };
};
