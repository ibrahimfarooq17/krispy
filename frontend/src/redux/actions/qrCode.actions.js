import krispyAxios from '../../utilities/krispyAxios';

export const GET_ALL_QR_CODES = 'GET_ALL_QR_CODES';

export const getAllQrCodes = () => {
  return async (dispatch) => {
    const { qrCodes } = await krispyAxios({
      method: 'GET',
      url: 'qr-codes'
    });
    dispatch({
      type: GET_ALL_QR_CODES,
      payload: qrCodes || [],
    });
  };
};
