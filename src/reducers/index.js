import { combineReducers } from 'redux';
import error from 'reducers/ErrorReducer';
import status from 'reducers/StatusReducer';
import user from 'reducers/UserReducer';
import timeline from 'reducers/TimelineReducer';
export default combineReducers({ error, status, user , timeline});
