import axios from 'axios';
import { api } from 'constants/route';
 
 
const getCurrent = async (config) => {
  console.log(config)
  return await axios.get(api + 'User/current', config);
};
const updateAvatar = async (url,config) => {
  return await axios.post(
    api + 'User/avatar/update',
    { discription: '', avatar_hash: url },
    config
  );
};
export default { getCurrent,updateAvatar };
