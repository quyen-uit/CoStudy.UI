import axios from 'axios';
import { api } from '../constants/route';
import { Alert } from 'react-native';

export const actionTypes = {
  CLEAR_TIMELINE: 'CLEAR_TIMELINE',
  CREATE_TIMELINE: 'CREATE_TIMELINE',
  UPDATE_TIMELINE: 'UPDATE_TIMELINE',
  ERROR: 'ERROR',
};

 
const clearStore = () => ({
  type: actionTypes.CLEAR_STORE,
  payload: null,
});
const create = (list) => ({
  type: actionTypes.C,
  payload: list,
});
export const createTimeline = (jwtToken, skip, count) => async dispatch => {
  try {
    await getAPI(jwtToken)
      .get(api + 'User/current')
      .then(async response => {
        await getAPI(jwtToken)
          .get(api + `Post/timeline/skip/${skip}/count/${count}`)
          .then(res => {
            res.data.result.forEach(item => {
              response.data.result.post_saved.forEach(i => {
                if (i == item.oid) {
                  item.saved = true;
                } else item.saved = false;
              });
              item.vote = 0;
              response.data.result.post_upvote.forEach(i => {
                if (i == item.oid) {
                  item.vote = 1;
                }
              });
              response.data.result.post_downvote.forEach(i => {
                if (i == item.oid) {
                  item.vote = -1;
                }
              });
            });

            dispatch(create)
            
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  } catch (error) {
    console.log('dispatch timeline err');
    console.log(error);
  }
};
