import UserController from 'controllers/UserController';
import axios from 'axios';
import { api } from '../constants/route';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

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

export const login = (email, password) => async dispatch => {
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
            if (response.data.result.avatar.image_hash == null)
              response.data.result.avatar.image_hash =
                'https://firebasestorage.googleapis.com/v0/b/costudy-c5390.appspot.com/o/avatar%2Favatar.jpeg?alt=media&token=dbfd6455-9355-4b68-a711-111c18b0b243';
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
                    { userId: response.data.result.oid, token: token }
                  )

                  .catch(err => console.log(err));
              });
            dispatch(loginSuccess(response.data.result));
          })
          .catch(error => alert(error));
      })
      .catch(error => {
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
      .catch(err => alert(err));
  } finally {
    dispatch(clearStore());
  }
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
      .catch(error => alert(error));
  } catch (error) {
    dispatch(loginError(error.message));
  }
};
