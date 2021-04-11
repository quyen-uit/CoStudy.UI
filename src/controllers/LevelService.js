import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class LevelService {
 
    static async getLevels(jwtToken, skip, count) {
      return await getAPI(jwtToken).get(api + `Level/level/all?Skip=${skip}&Count=${count}`);
    }
}
  
  export default LevelService;
  