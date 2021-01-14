import { actionTypes } from 'actions/NotifyAction';

const notifyReducer = (state = { count: 0 }, { payload, type }) => {
  switch (type) {
    case actionTypes.SET_NOTIFY:
      return { count: 0 };
    case actionTypes.INCREASE_NOTIFY:
      let newState1 = { ...state };
      newState1.count = newState1.count + 1;
      return newState1;
    case actionTypes.DECREASE_NOTIFY:
      let newState = { ...state };
      newState.count = newState.count - 1 < 0 ? 0 : newState.count - 1;

      return newState;
    default:
      return state;
  }
};

export default notifyReducer;
