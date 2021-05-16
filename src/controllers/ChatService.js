import { getAPI } from '../apis/instance';
import { api } from 'constants/route';

class ChatService {
  // static async getCurrentUser(jwtToken) {
  //   return new Promise((resolve, reject) => {
  //     await getAPI(curUser.jwtToken)
  //     .get(api + 'User/current').then(resUser => {
  //       resolve(resUser);
  //     })
  //     .catch(err => reject(err));
  //   });
  // }

  static async deleteConversation(jwtToken, id) {
    return await getAPI(jwtToken).delete(api + 'Message/conversation/' + id);
  }

  static async getCurrentConversation(jwtToken) {
    return await getAPI(jwtToken).get(api + 'conversation/current');
  }

  static async deleteMessageById(jwtToken, id) {
    return await getAPI(jwtToken).delete(api + 'Message/message/' + id);
  }

  static async createMessage(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'Message/message/add', {
      conversation_id: params.conversation_id,
      content: [params.message],
      message_type: 0
    });
  }

  static async createImageMessage(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'Message/message/add', {
      conversation_id: params.conversation_id,
      image: [
        {
          image_url: params.url,
          image_hash: params.url,
        },
      ],
      message_type: 1
    });
  }
  static async createPostMessage(jwtToken, params) {
    return await getAPI(jwtToken).post(api + 'Message/message/add', {
      conversation_id: params.conversation_id,
      post_id: params.post_id,
      message_type: 3
    });
  }
  static async getAllMessage(jwtToken, params) {
    return await getAPI(jwtToken).get(
      api +
        'Message/message/get/conversation?ConversationId=' +
        params.conversation_id +
        '&Skip=' +
        params.skip +
        '&Count=' +
        params.count
    );
  }

  static async createConversation(jwtToken, oid) {
    return await getAPI(jwtToken).post(api + 'Conversation', {
      participants: [{ member_id: oid }],
      name: '',
    });
  }
}

export default ChatService;
