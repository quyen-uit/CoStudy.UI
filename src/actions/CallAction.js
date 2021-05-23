 import axios from 'axios';
import { api } from '../constants/route';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const actionTypes = {
  CLEAR_STORE: 'CLEAR_STORE',
 
  SET_REMOTE_STREAM: 'SET_REMOTE_STREAM'
 };
 
export const setRemoteStream = (stream) => ({
  type: actionTypes.SET_REMOTE_STREAM,
  payload: stream,
});

const clearStore = () => ({
  type: actionTypes.CLEAR_STORE,
  payload: null,
});