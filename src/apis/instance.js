import axios from 'axios';
import { api } from '../constants/route';
import { store } from '../store/index';
import { actionTypes, update } from 'actions/UserActions';
import { BackHandler } from "react-native";
export const getAPI = jwtToken => {
  let isRefreshing = false;
  let refreshSubscribers = [];
  const options = {};

  const instance = axios.create(options);
  instance.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

  function subscribeTokenRefresh(cb) {
    refreshSubscribers.push(cb);
  }

  function onRrefreshed(token) {
    refreshSubscribers.map(cb => cb(token));
  }
  instance.interceptors.response.use(
    response => {
      return response;
    },
    async function (error) {
      const {
        config,
        response: { status },
      } = error;

      const originalRequest = config;

      if (status === 400) {
        if (!isRefreshing) {
          isRefreshing = true;

          await axios
            .post('http://192.168.36.2/api/Accounts/refresh-token')
            .then(response => {
              isRefreshing = false;
              store.dispatch(update(response.data.result.jwtToken));
              onRrefreshed(jwtToken);
              BackHandler.exitApp();
            })
            .catch(err => console.log(err));
        }

        const retryOrigReq = new Promise((resolve, reject) => {
          subscribeTokenRefresh(token => {
            // replace the expired token and retry
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            resolve(axios(originalRequest));
          });
        });
        return retryOrigReq;
      } else {
        return Promise.reject(error);
      }
    }
  );

  return instance;
};

// export const getAPI = jwtToken => {
//   const options = {};

//   const instance = axios.create(options);
//   instance.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
//   instance.interceptors.response.use(
//     response => {
//       return response;
//     },
//     async function (error) {
//       const originalRequest = error.config;
//       console.log(originalRequest);
//       if (error.response.status === 400 && !originalRequest._retry) {
//         await axios.post(api + 'Accounts/refresh-token').then(response => {
//           console.log(response.data.result);

//           store.dispatch(update(response.data.result.jwtToken));
//           originalRequest.headers.common[
//             'Authorization'
//           ] = `Bearer ${response.data.result.jwtToken}`;
//           return axios(originalRequest);
//         });
//       }
//       return Promise.reject(error);
//     }
//   );
//   return instance;
// };
