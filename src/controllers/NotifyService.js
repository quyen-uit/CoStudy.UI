import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class NotifyService {
    // static async getCurrentUser(jwtToken) {
    //   return new Promise((resolve, reject) => {
    //     await getAPI(curUser.jwtToken)
    //     .get(api + 'User/current').then(resUser => {
    //       resolve(resUser);
    //     })
    //     .catch(err => reject(err));
    //   });
    // }

    static async getAllNotify(jwtToken) {
      return await getAPI(jwtToken)
      .get(api + 'Noftication/current')
    }
 

  }
  
  export default NotifyService;
  