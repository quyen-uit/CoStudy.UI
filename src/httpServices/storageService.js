import axios from 'axios';
import { api } from 'constants/route';
import storage from '@react-native-firebase/storage';

const getUrl = async (path) =>{
    return  await storage()
    .ref(path)
    .getDownloadURL();
}

export default { getUrl };
