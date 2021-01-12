import { actionTypes } from 'actions/TimelineActions';

const timelineReducer = (state = {}, { payload, type }) => {
  switch (type) {
    case actionTypes.CREATE_TIMELINE:
      return { ...state, ...payload.user };
 
    case actionTypes.CLEAR_STORE:
      return {};
    
    default:
      return state;
  }
};

export default timelineReducer;
