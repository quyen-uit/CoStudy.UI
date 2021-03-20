import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class PostService {
    // static async getCurrentUser(jwtToken) {
    //   return new Promise((resolve, reject) => {
    //     await getAPI(curUser.jwtToken)
    //     .get(api + 'User/current').then(resUser => {
    //       resolve(resUser);
    //     })
    //     .catch(err => reject(err));
    //   });
    // }

    static async getTimeline(jwtToken, skip, count) {
      // return await getAPI(jwtToken).post(api + `Post/timeline/skip/${skip}/count/${count}`);
      return await getAPI(jwtToken).post(api + `Post/timeline`, { skip: skip, count: count});
    }

    static async getSavedPost(jwtToken, params) {
      return await getAPI(jwtToken)
      .get(api + `Post/save?skip=${params.skip}&count=${params.count}`)
    }

    static async getPostByUserId(jwtToken, params){
      return getAPI(jwtToken)
            .post(
              api +'Post/user',
              {
                skip: params.skip,
                count: params.count,
                user_id: params.oid
              }
            )
    }

    static async savePost(jwtToken, oid){
      return await getAPI(jwtToken)
      .post(api + 'Post/save/' +  oid, { id:  oid })
    }

    static async upvote(jwtToken, oid){
      return await getAPI(jwtToken)
      .post(api + 'Post/upvote/' + oid, { id: oid })
    }

    static async downvote(jwtToken, oid){
      return await getAPI(jwtToken)
      .post(api + 'Post/downvote/' + oid, { id: oid })
    }
    static async createPost(jwtToken, post) {
      console.log(post);
      return await getAPI(jwtToken)
      .post(api + 'Post', {
        title: post.title,
        string_contents: [
          { content_type: 0, content: post.content },
        ],
        image_contents: post.list,
        fields: post.fields,
      })
    }

    static async filterPost(jwtToken, params){
      return await getAPI(jwtToken)
      .post(api + `Post/filter`, {
        skip: params.skip,
        count: params.count,
        keyword: params.search,
      })
    }

  }
  
  export default PostService;
  