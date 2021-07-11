import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class ReportService {
  static async getAllReason(jwtToken) {
    return await getAPI(jwtToken).get(api + `ReportReason?Skip=0&Count=10`);
  }
  static async reportPost(jwtToken, params) {
    return await getAPI(jwtToken).post(api + `Report/report-post`, {
      post_id: params.postId,
      reason: params.reasons,
      external_reason: params.content,
    });
  }
  static async reportReply(jwtToken, params) {
    return await getAPI(jwtToken).post(api + `Report/report-reply`, {
      reply_id: params.replyId,
      reason: params.reasons,
      external_reason: params.content,
    });
  }
  static async reportComment(jwtToken, params) {
    return await getAPI(jwtToken).post(api + `Report/report-comment`, {
      comment_id: params.commentId,
      reason: params.reasons,
      external_reason: params.content,
    });
  }

}

export default ReportService;
