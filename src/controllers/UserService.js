import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class UserService {
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
    return await getAPI(jwtToken).get(api + 'User/field/all');
  }
  static async getFieldByUserId(jwtToken, userId) {
    return await getAPI(jwtToken).get(api + 'Level/user/all/' + userId);
  }
  static async getUserById(jwtToken, id) {
    return await getAPI(jwtToken).get(api + 'User/get/' + id);
  }

  static async updateUser(jwtToken, params) {
    return await getAPI(jwtToken).put(api + 'User/update', params);
  }

  // static async updateFieldOfUser(jwtToken, params){
  //   return await getAPI(jwtToken)
  //         .put(api + 'User/field', { field_value: params.fields })
  // }
  static async updateFieldOfUser(jwtToken, user_id, fields) {
    return await getAPI(jwtToken).post(api + 'Level/user/field/add', {
      user_id: user_id,
      field_id: fields,
    });
  }
  static async updateAvatar(jwtToken, url) {
    return await getAPI(jwtToken).post(api + 'User/avatar/update', {
      discription: '',
      avatar_hash: url,
    });
  }

  static async getUser(jwtToken, url) {
    return await getAPI(jwtToken).get(api + url);
  }
 
  static async filterUser(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'User/user/filter', {
      keyword: params.search,
      skip: params.skip,
      count: params.count,
    });
  }
}

export default UserService;
