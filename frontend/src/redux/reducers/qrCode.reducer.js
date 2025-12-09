import * as Actions from '../actions/qrCode.actions';

const initialState = {
  qrCodes: null,
};

export const qrCodeReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case Actions.GET_ALL_QR_CODES:
      return (state = {
        ...state,
        qrCodes: payload,
      });
    default:
      return state;
  }
};
