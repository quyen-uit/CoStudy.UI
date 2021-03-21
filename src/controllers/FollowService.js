import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class FollowService {
    // static async getCurrentUser(jwtToken) {
    //   return new Promise((resolve, reject) => {
    //     await getAPI(curUser.jwtToken)
    //     .get(api + 'User/current').then(resUser => {
    //       resolve(resUser);
    //     })
    //     .catch(err => reject(err));
    //   });
    // }

    static async getFollowerByUserId(jwtToken, params) {
      return await getAPI(jwtToken)
      .get(
        api + 'User/follower?UserId=' +  params.id + `&Skip=${params.skip}&Count=${params.count}`
      );
    }
 
    static async getFollowingByUserId(jwtToken, params){
      return await getAPI(  jwtToken)
      .get(
        api + 'User/following?UserId=' +  params.id + `&Skip=${params.skip}&Count=${params.count}`
      )
    }

    static async follow(jwtToken, id) {
      return await getAPI(  jwtToken)
      .post(api + 'User/following', { followers: [id] })
    }

    static async unfollow(jwtToken, params) {
      return await getAPI(  jwtToken)
        .post(api + 'User/following/remove?followingId=' + params.from_id, {
          followingId: params.from_id,
        })
    }

    static async unfollower(jwtToken, oid){
      return await getAPI(jwtToken)
      .post(api + 'User/following/remove?followingId=' + oid, {
        followingId: oid,
      })
    }
    
  }
  
  export default FollowService;
  