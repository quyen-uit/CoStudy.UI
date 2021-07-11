import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class CommentService {
    // static async getCurrentUser(jwtToken) {
    //   return new Promise((resolve, reject) => {
    //     await getAPI(curUser.jwtToken)
    //     .get(api + 'User/current').then(resUser => {
    //       resolve(resUser);
    //     })
    //     .catch(err => reject(err));
    //   });
    // }

    static async getCurrentUser(jwtToken) {
      return await getAPI(jwtToken).get(api + 'User/current');
    }

    static async getAllField(jwtToken) {
      return await getAPI(jwtToken).get(api + 'User/field/all')
    }

    
  }
  
  export default ReplyService;
  