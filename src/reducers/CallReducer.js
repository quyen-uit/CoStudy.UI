import { actionTypes } from 'actions/CallAction';

const callReducer = (state = { count: 0 }, { payload, type }) => {
  switch (type) {
    case actionTypes.SET_REMOTE_STREAM:
       return { ...payload.stream };
    case actionTypes.CLEAR_STORE:
        return {};
    default:
      return state;
  }
};

export default callReducer;
