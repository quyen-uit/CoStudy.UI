import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class CommentService {

  static async getCommentByPostId(jwtToken, params){
    return await getAPI(jwtToken)
    .get(api + 'Comment/get/post?PostId=' + params.oid + `&Skip=${params.skip}&Count=${params.count}`, {
      PostId: params.oid,
      Skip: params.skip,
      Count: params.count,
    })
  }

    static async getAllReply(jwtToken, params) {
      return await getAPI(jwtToken)
      .get(api + 'Comment/get/replies/' + params.oid + `?skip=${params.skip}&count=${params.count}`, {
        skip: params.skip,
        count: params.count,
      })
    }

    static async upVoteComment(jwtToken, oid){
      return await  getAPI(jwtToken)
      .post(api + 'Comment/upvote/' + oid)
    }

    static async downVoteComment(jwtToken, oid){
      return await  getAPI(jwtToken)
      .post(api + 'Comment/downvote/' + oid)
    }

    static async createReply(jwtToken, params){
      return await getAPI(jwtToken)
      .post(api + 'Comment/reply', {
        content: params.comment,
        parent_id: params.oid,
      })
    }
    static async createComment(jwtToken, params) {
      return await getAPI(jwtToken)
      .post(api + 'Comment/add', {
        content: params.comment,
        image_hash: params.img,
        post_id:  params.oid,
      })
    }
    static async updateComment(jwtToken, params) {
      return await getAPI(jwtToken)
      .put(api + 'Comment/comment/update', {
        content: params.comment,
        image_hash: params.img,
        id:  params.oid,
      })
    }
  }
  
  export default CommentService;
  