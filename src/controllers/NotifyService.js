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

  static async getAllNotify(jwtToken, skip, count) {
    return await getAPI(jwtToken).get(api + 'Noftication/current');
  }
  static async deleteById(jwtToken,id){
    return await getAPI(jwtToken).delete(api + 'Noftication/' + id);
  }
  // ???
  static async readNotify(jwtToken,id){
    return await getAPI(jwtToken).put(api + 'Noftication/read?id=' + id);
  }
}

export default NotifyService;
