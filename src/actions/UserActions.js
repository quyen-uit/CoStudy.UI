import UserController from 'controllers/UserController';
import axios from 'axios';
import { api } from '../constants/route';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import ConnectyCube from 'react-native-connectycube';
import navigationConstants from 'constants/navigation';

export const actionTypes = {
  CLEAR_STORE: 'CLEAR_STORE',
  LOGIN: 'LOGIN',
  LOGIN_REQUEST: 'LOGIN_REQUEST',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  UPDATE_USER: 'UPDATE_USER',
};

const loginRequest = () => ({
  type: actionTypes.LOGIN_REQUEST,
  payload: null,
});

const loginError = error => ({
  type: actionTypes.LOGIN_ERROR,
  payload: { error },
});

const loginSuccess = user => ({
  type: actionTypes.LOGIN_SUCCESS,
  payload: { user },
});
export const updateUser = user => ({
  type: actionTypes.UPDATE_USER,
  payload: { user },
});
const clearStore = () => ({
  type: actionTypes.CLEAR_STORE,
  payload: null,
});

export const login = (email, password, navigation) => async dispatch => {
  dispatch(loginRequest());
  try {
    await axios
      .post(api + `Accounts/login`, { email: email, password: password })
      .then(async res => {
        await axios
          .get(api + 'User/current', {
            headers: { Authorization: `Bearer ${res.data.result.jwtToken}` },
          })
          .then(response => {
            response.data.result.jwtToken = res.data.result.jwtToken;
            if (
              response.data.result.call_id == null ||
              typeof response.data.result.call_id == 'undefined'
            ) {
              ConnectyCube.createSession()
                .then(session => {
                  console.log(session);
                  ConnectyCube.users
                    .signup({
                      login: email,
                      password: 'connectycube',
                      email: email,
                      full_name:
                        response.data.result.first_name +
                        '' +
                        response.data.result.last_name,
                    })
                    .then(user => {
                      console.log(user);
                      response.data.result.call_id = user.user.id;
                      axios
                        .post(api + 'User/call-id', {
                          user_id: response.data.result.oid,
                          call_id: user.user.id.toString(),
                        })
                        .then(callres => {
                          messaging()
                            .getToken()
                            .then(async token => {
                              await axios
                                .post(
                                  api +
                                    'Fcm/add?userId=' +
                                    response.data.result.oid +
                                    '&token=' +
                                    token,
                                  {
                                    userId: response.data.result.oid,
                                    token: token,
                                  },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${res.data.result.jwtToken}`,
                                    },
                                  }
                                )

                                .catch(err => console.log(err));
                            });
                          dispatch(loginSuccess(response.data.result));
                        })
                        .catch(err => {
                          console.log('--------------------------');
                          console.log(err);
                        });
                    })
                    .catch(error => {});
                })
                .catch(error => {});
            } else {
              messaging()
                .getToken()
                .then(async token => {
                  await axios
                    .post(
                      api +
                        'Fcm/add?userId=' +
                        response.data.result.oid +
                        '&token=' +
                        token,
                      {
                        userId: response.data.result.oid,
                        token: token,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${res.data.result.jwtToken}`,
                        },
                      }
                    )

                    .catch(err => console.log(err));
                });
              dispatch(loginSuccess(response.data.result));
            }
          })
          .catch(error => console.log(error));
      })
      .catch(error => {
        if (
          { ...error }.response.data.message ==
          'Tài khoản hoặc mật khẩu không đúng. '
        ) {
          Alert.alert('Thông báo', 'Tài khoản hoặc mật khẩu không đúng. ');
        } else {
          Alert.alert(
            'Tài khoản chưa xác thực',
            'Vui lòng nhập mã xác thực vừa được gửi đến email của bạn.'
          );
          navigation.navigate(navigationConstants.verifyEmail, {
            email: email,
            password: password,
          });
        }
        dispatch(loginSuccess());
      });
  } catch (error) {
    dispatch(loginError(error.message));
  }
};
export const loginGoogle = ggParams => async dispatch => {
  dispatch(loginRequest());
  try {
    await axios
      .post(api + `Accounts/google-login`, ggParams)
      .then(async res => {
        await axios
          .get(api + 'User/current', {
            headers: { Authorization: `Bearer ${res.data.result.jwtToken}` },
          })
          .then(response => {
            response.data.result.jwtToken = res.data.result.jwtToken;
            if (
              response.data.result.call_id == null ||
              typeof response.data.result.call_id == 'undefined'
            ) {
              ConnectyCube.createSession()
                .then(session => {
                  ConnectyCube.users
                    .signup({
                      login: email,
                      password: 'connectycube',
                      email: email,
                      full_name:
                        response.data.result.first_name +
                        '' +
                        response.data.result.last_name,
                    })
                    .then(user => {
                      response.data.result.call_id = user.user.id;
                      axios
                        .post(api + 'User/call-id', {
                          user_id: response.data.result.oid,
                          call_id: user.user.id.toString(),
                        })
                        .then(callres => {
                          messaging()
                            .getToken()
                            .then(async token => {
                              await axios
                                .post(
                                  api +
                                    'Fcm/add?userId=' +
                                    response.data.result.oid +
                                    '&token=' +
                                    token,
                                  {
                                    userId: response.data.result.oid,
                                    token: token,
                                  },
                                  {
                                    headers: {
                                      Authorization: `Bearer ${res.data.result.jwtToken}`,
                                    },
                                  }
                                )

                                .catch(err => console.log(err));
                            });
                          dispatch(loginSuccess(response.data.result));
                        })
                        .catch(err => {
                          console.log('--------------------------');
                          console.log(err);
                        });
                    })
                    .catch(error => {});
                })
                .catch(error => {});
            } else {
              messaging()
                .getToken()
                .then(async token => {
                  await axios
                    .post(
                      api +
                        'Fcm/add?userId=' +
                        response.data.result.oid +
                        '&token=' +
                        token,
                      {
                        userId: response.data.result.oid,
                        token: token,
                      },
                      {
                        headers: {
                          Authorization: `Bearer ${res.data.result.jwtToken}`,
                        },
                      }
                    )

                    .catch(err => console.log(err));
                });
              dispatch(loginSuccess(response.data.result));
            }
          })
          .catch(err => console.log(err));
      })
      .catch(error => {
        console.log(error);
        Alert.alert('Thông báo', 'Email hoặc mật khẩu không đúng.');
        dispatch(loginSuccess());
      });
  } catch (error) {
    dispatch(loginError(error.message));
  }
};
export const logout = token => async dispatch => {
  try {
    await axios
      .post(api + 'Accounts/revoke-token', { token: token })
      .then(res => console.log(res))
      .catch(err => console.log(err));
  } finally {
    dispatch(clearStore());
  }
  //
  dispatch(clearStore());
};

export const update = jwt => async dispatch => {
  try {
    await axios
      .get(api + 'User/current', {
        headers: { Authorization: `Bearer ${jwt}` },
      })
      .then(response => {
        response.data.result.jwtToken = jwt;
        dispatch(updateUser(response.data.result));
      })
      .catch(error => console.log(error));
  } catch (error) {
    dispatch(loginError(error.message));
  }
};
