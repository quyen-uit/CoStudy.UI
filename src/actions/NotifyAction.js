import axios from 'axios';
import { api } from '../constants/route';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const actionTypes = {
  CLEAR_STORE: 'CLEAR_STORE',
  INCREASE_NOTIFY: 'INCREASE_NOTIFY',
  DECREASE_NOTIFY: 'DECREASE_NOTIFY',
  SET_NOTIFY: 'SET_NOTIFY',
};

export const increaseNotify = () => ({
  type: actionTypes.INCREASE_NOTIFY,
  payload: null,
});

export const decreaseNotify = () => ({
  type: actionTypes.DECREASE_NOTIFY,
  payload: null,
});

export const setNotify = value => ({
  type: actionTypes.SET_NOTIFY,
  payload: value,
});
