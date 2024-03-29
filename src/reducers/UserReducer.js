import { actionTypes } from 'actions/UserActions';

const userReducer = (state = {}, { payload, type }) => {
  switch (type) {
    case actionTypes.LOGIN_SUCCESS:
      return { ...state, ...payload.user };
    case actionTypes.LOGIN_ERROR:
      return {};
    case actionTypes.CLEAR_STORE:
      return {};
    case actionTypes.UPDATE_USER:
       return {...payload.user};
    default:
      return state;
  }
};

export default userReducer;
