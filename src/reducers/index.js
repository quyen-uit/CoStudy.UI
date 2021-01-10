import { combineReducers } from 'redux';
import error from 'reducers/ErrorReducer';
import status from 'reducers/StatusReducer';
import user from 'reducers/UserReducer';
import timeline from 'reducers/TimelineReducer';
import chat from 'reducers/ChatReducer';
import notify from 'reducers/NotifyReducer';
export default combineReducers({ error, status, user, timeline, chat, notify });
