import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class CommentService {
  static async getCommentByPostId(jwtToken, params) {
    return await getAPI(jwtToken).get(
      api +
        'Comment/get/post?PostId=' +
        params.oid +
        `&Skip=${params.skip}&Count=${params.count}&Filter=${0}&ArrangeType=${1}`,
      {
        PostId: params.oid,
        Skip: params.skip,
        Count: params.count,
        Filter: 0,
        ArrangeType: 1
      }
    );
  }
  static async getCommentById(jwtToken, id) {
    return await getAPI(jwtToken).get(api + `Comment/commment/` + id);
  }
  static async getReplyById(jwtToken, id) {
    return await getAPI(jwtToken).get(api + `Comment/reply-comment/` + id);
  }

  static async getAllReply(jwtToken, params) {
    return await getAPI(jwtToken).get(
      api +
        'Comment/get/replies/' +
        params.oid +
        `?skip=${params.skip}&count=${params.count}`,
      {
        skip: params.skip,
        count: params.count,
      }
    );
  }

  static async upVoteComment(jwtToken, oid) {
    return await getAPI(jwtToken).post(api + 'Comment/upvote-comment/' + oid);
  }

  static async downVoteComment(jwtToken, oid) {
    return await getAPI(jwtToken).post(api + 'Comment/downvote-comment/' + oid);
  }
  static async upVoteReply(jwtToken, oid) {
    return await getAPI(jwtToken).post(api + 'Comment/upvote-reply/' + oid);
  }

  static async downVoteReply(jwtToken, oid) {
    return await getAPI(jwtToken).post(api + 'Comment/downvote-reply/' + oid);
  }
  static async createComment(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'Comment/add', {
      content: params.comment,
      image_hash: params.img,
      post_id: params.oid,
    });
  }
  static async updateComment(jwtToken, params) {
    return await getAPI(jwtToken).put(api + 'Comment/comment/update', {
      content: params.comment,
      image_hash: params.img,
      id: params.oid,
    });
  }
  static async createReply(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'Comment/reply', {
      content: params.comment,
      parent_id: params.oid,
    });
  }
  static async deleteComment(jwtToken, oid) {
    return await getAPI(jwtToken).put(api + 'Comment/modified-comment-status', {
      comment_id: oid,
      status: 4
    });
  }
  static async updateReply(jwtToken, params) {
    return await getAPI(jwtToken).put(api + 'Comment/reply/update', {
      id: params.replyId,
      content: params.content,
    });
  }
}

export default CommentService;
