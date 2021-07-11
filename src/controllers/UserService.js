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
  static async getUserNearBy(jwtToken, params) {
    return await getAPI(jwtToken).get(
      api + `User/near-by?Skip=${params.skip}&Count=${params.count}`
    );
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
  static async updateInfo(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'User/additionalinfos', [
      { information_name: 'school', information_value: params.school },
      { information_name: 'subject', information_value: params.subject },
    ]);
  }
  static async getSearchHistory(jwtToken) {
    return await getAPI(jwtToken).get(
      api + `User/history?Skip=0&Count=10`
    );
  }
  static async updateLocation(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'User/update-address', params);
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
  static async getRanking(jwtToken, params) {
    return await getAPI(jwtToken).get(
      api +
        `Level/leader-board?FieldId=${params.fieldId}&Skip=${params.skip}&Count=${params.count}`
    );
  }
  static async getNewToken(jwtToken, refresh_token) {
    return await getAPI(jwtToken).post(
      api + 'Accounts/refresh-token?refreshToken=' + refresh_token
    );
  }

  static async addCallId(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'User/call-id', {
      user_id: params.userId,
      call_id: params.callId,
    });
  }
  static async filterUser(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'User/user/filter', {
      skip: params.skip,
      count: params.count,
      keyword: params.search,

      filter_type: params.sortObject, //
      order_type: params.sortType, // 0 asc, 1 desc
      field_filter: params.fields,
    });
  }
}

export default UserService;
