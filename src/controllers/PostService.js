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

  static async getPostById(jwtToken, id) {
    return await getAPI(jwtToken).get(api + `Post/` + id);
  }
  // static async getTimeline(jwtToken, skip, count) {
  //   // return await getAPI(jwtToken).post(api + `Post/timeline/skip/${skip}/count/${count}`);
  //   return await getAPI(jwtToken).post(api + `Post/timeline`, {
  //     skip: skip,
  //     count: count,
  //   });
  // }
  static async getTimeline(jwtToken, skip, count) {
    // return await getAPI(jwtToken).post(api + `Post/timeline/skip/${skip}/count/${count}`);
    return await getAPI(jwtToken).post(api + `Post/news-feed`, {
      skip: skip,
      count: count,
      from_date: '2020-06-11T12:57:49.993Z' ,
      to_date: '2025-06-11T12:57:49.993Z'
    });
  }
  static async getSavedPost(jwtToken, params) {
    return await getAPI(jwtToken).get(
      api + `Post/save?skip=${params.skip}&count=${params.count}`
    );
  }

  static async getPostByUserId(jwtToken, params) {
    return getAPI(jwtToken).post(api + 'Post/user', {
      skip: params.skip,
      count: params.count,
      user_id: params.oid,
    });
  }

  static async savePost(jwtToken, oid) {
    return await getAPI(jwtToken).post(api + 'Post/save/' + oid);
  }

  static async upvote(jwtToken, oid) {
    return await getAPI(jwtToken).post(api + 'Post/upvote/' + oid, { id: oid });
  }

  static async downvote(jwtToken, oid) {
    return await getAPI(jwtToken).post(api + 'Post/downvote/' + oid, {
      id: oid,
    });
  }
  static async createPost(jwtToken, post) {
    return await getAPI(jwtToken).post(api + 'Post', {
      title: post.title,
      string_contents: [{ content_type: 0, content: post.content }],
      image_contents: post.list,
      fields: post.fields,
    });
  }

  static async updatePost(jwtToken, post) {
    return await getAPI(jwtToken).put(api + 'Post/update', {
      post_id: post.oid,
      title: post.title,
      string_contents: [{ content_type: 0, content: post.content }],
      image_contents: post.list,
      fields: { field: post.fields },
    });
  }

  static async filterPost(jwtToken, params) {
     

    return await getAPI(jwtToken).post(api + `Post/filter`, {
      skip: params.skip,
      count: params.count,
      content_filter: params.search,
      from_date: params.startDate,
      to_date: params.endDate,
      sort_object: params.sortObject, //
      sort_type: params.sortType, // 0 asc, 1 desc
      level_filter: {
        filter_items: params.fields,
      },
    });
  }
}

export default PostService;
