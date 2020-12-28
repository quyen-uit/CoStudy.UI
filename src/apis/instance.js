import axios from 'axios';
import { api } from '../constants/route';
import { store } from '../store/index';
import { actionTypes, update } from 'actions/UserActions';

export const getAPI = jwtToken => {
 
  const options = {};
 
  const instance = axios.create(options);
  instance.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
  instance.interceptors.response.use(
    response => {
      return response;
    },
    async function (error) {
      const originalRequest = error.config;
      if (error.response.status === 400 && !originalRequest._retry) {
        await axios.post(api + 'Accounts/refresh-token').then(response => {
          console.log(response.data.result);
          store.dispatch(update(response.data.result.jwtToken));
        });
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
