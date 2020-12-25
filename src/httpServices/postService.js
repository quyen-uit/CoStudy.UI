import axios from 'axios';
import { api } from 'constants/route';
 


const getListByUserId = async (user_id,config) => {
  return axios.get(
    api + 'Post/get/user/' + user_id,
    config
  );
};

export default { getListByUserId };
