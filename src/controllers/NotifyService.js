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
    return await getAPI(jwtToken).get(api + 'Noftication/current', {
      skip: skip ? skip : 0,
      count: count ? count : 100,
    });
  }
}

export default NotifyService;
