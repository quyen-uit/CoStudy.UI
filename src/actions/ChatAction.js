 import axios from 'axios';
import { api } from '../constants/route';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

export const actionTypes = {
  CLEAR_STORE: 'CLEAR_STORE',
  INCREASE_CHAT: 'INCREASE_CHAT',
  DECREASE_CHAT: 'DECREASE_CHAT',
  SET_CHAT: 'SET_CHAT'
 };
 
export const increaseChat = () => ({
  type: actionTypes.INCREASE_CHAT,
  payload: null,
});

export const decreaseChat = () => ({
  type: actionTypes.DECREASE_CHAT,
  payload: null,
});

export const setChat = (value) => ({
  type: actionTypes.SET_CHAT,
  payload: value,
});