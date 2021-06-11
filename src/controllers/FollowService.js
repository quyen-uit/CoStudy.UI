import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class FollowService {
  // static async getFollowerByUserId(jwtToken, params) {
  //   return await getAPI(jwtToken).get(
  //     api +
  //       'User/follower?UserId=' +
  //       params.id +
  //       `&Skip=${params.skip}&Count=${params.count}`
  //   );
  // }
  static async getFollowerByUserId(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'User/get-follower', {
      skip: params.skip,
      count: params.count,
      user_id: params.id,
      keyword: typeof params.keyword == 'undefined' ? '' : params.keyword,
    });
  }
  // static async getFollowingByUserId(jwtToken, params){
  //   return await getAPI(  jwtToken)
  //   .get(
  //     api + 'User/following?UserId=' +  params.id + `&Skip=${params.skip}&Count=${params.count}`
  //   )
  // }
  static async getFollowingByUserId(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'User/get-following', {
      skip: params.skip,
      count: params.count,
      user_id: params.id,
      keyword: typeof params.keyword == 'undefined' ? '' : params.keyword,
    });
  }
  static async follow(jwtToken, id) {
    return await getAPI(jwtToken).post(api + 'User/following', {
      followers: [id],
    });
  }

  static async unfollow(jwtToken, params) {
    return await getAPI(jwtToken).post(
      api + 'User/following/remove?followingId=' + params.from_id,
      {
        followingId: params.from_id,
      }
    );
  }

  static async unfollower(jwtToken, oid) {
    return await getAPI(jwtToken).post(
      api + 'User/following/remove?followingId=' + oid,
      {
        followingId: oid,
      }
    );
  }
}

export default FollowService;
