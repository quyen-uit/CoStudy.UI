import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import styles from 'components/common/NotifyCard/styles';
import { Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  active_color,
  main_color,
  touch_color,
} from '../../../constants/colorCommon';
import NotifyOptionModal from 'components/modal/NotifyOptionModal/NotifyOptionModal';
import { useSelector } from 'react-redux';
import moment from 'moment';

import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';
import NotifyService from 'controllers/NotifyService';
import { getJwtToken } from 'selectors/UserSelectors';
import { Alert } from 'react-native';
import { ToastAndroid } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import navigationConstants from 'constants/navigation';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';
import CommentService from 'controllers/CommentService';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function NotifyCard(props) {
  const notify = props.notify;
  const jwtToken = useSelector(getJwtToken);
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isRead, setisRead] = useState(props.notify.is_read);
  const navigation = useNavigation();
  React.useEffect(() => {
    setisRead(notify.is_read);
  }, [notify.oid]);
  const read = async () => {
    goTo();
    await NotifyService.readNotify(jwtToken, notify.oid).then(res => {
      setisRead(true);
      props.onLoading(false);

      //ToastAndroid.show('Đã đọc.', ToastAndroid.SHORT);
    });
  };
  const onDeleteCB = React.useCallback(() => {
    setVisible(true);
    setModalVisible(false);
  });
  const goTo = async () => {
    if (notify.notification_type == 0)
      await UserService.getCurrentUser(jwtToken)
        .then(async response => {
          await PostService.getPostById(jwtToken, notify.object_id)
            .then(res => {
              if (res.data.code == 404) {
                //props.onNotExist(post.oid);
                props.onLoading(false);
                ToastAndroid.show('Bài đăng không tồn tại.', 1000);
                return;
              }
              let item = res.data.result;
              // response.data.result.post_saved.forEach(i => {
              //   if (i == item.oid) {
              //     item.saved = true;
              //   } else item.saved = false;
              // });
              item.saved = item.is_save_by_current;
              // set vote
              item.vote = 0;
              if (item.is_downvote_by_current) item.vote = -1;
              else if (item.is_vote_by_current) item.vote = 1;
              props.onLoading(false);
              navigation.navigate(navigationConstants.post, {
                post: item,
                vote: item.vote,
                upvote: item.upvote,
                commentCount: item.comments_count,
                downvote: item.downvote,
                //saved: item.is_save_by_current
                // onUpvote: onUpvoteCallback,
                // onDownvote: onDownvoteCallback,
                // onComment: onCommentCallback,
                // onVote: onVoteCallback,
              });
            })
            .catch(error => console.log(error));
        })
        .catch(error => {
          props.onLoading(false);
          console.log(error);
        });
    else if (notify.notification_type == 1) {
      await CommentService.getCommentById(jwtToken, notify.object_id)
        .then(res => {
          if (res.data.code == 404) {
            // props.onNotExist(post.oid);
            props.onLoading(false);
            ToastAndroid.show('Bình luận không tồn tại.', 1000);
            return;
          }
          i = res.data.result;
          if (i.is_vote_by_current) i.vote = 1;
          else if (i.is_downvote_by_current) i.vote = -1;
          else i.vote = 0;
          props.onLoading(false);

          navigation.navigate(navigationConstants.comment, {
            comment: i,
            upvote: i.upvote,
            downvote: i.downvote,
            replies: i.comment_count,
            vote: i.vote,
            fromNotify: true,
          });
        })
        .catch(error => {
          props.onLoading(false);
          console.log(error);
        });
    } else if (notify.notification_type == 2) {
      await CommentService.getReplyById(jwtToken, notify.object_id).then(
        async reply => {
          if (reply.data.code == 404) {
            //props.onNotExist(post.oid);
            props.onLoading(false);
            ToastAndroid.show('Phản hồi không tồn tại.', 1000);
            return;
          }
          if (reply.data.result.parent_id.is_vote_by_current)
            reply.data.result.parent_id.vote = 1;
          else if (reply.data.result.parent_id.is_downvote_by_current)
            reply.data.result.parent_id.vote = -1;
          else reply.data.result.parent_id.vote = 0;
          await CommentService.getCommentById(
            jwtToken,
            reply.data.result.parent_id
          )
            .then(res => {
              if (res.data.code == 404) {
                //props.onNotExist(post.oid);
                props.onLoading(false);
                ToastAndroid.show('Bình luận không tồn tại.', 1000);
                return;
              }
              i = res.data.result;
              if (i.is_vote_by_current) i.vote = 1;
              else if (i.is_downvote_by_current) i.vote = -1;
              else i.vote = 0;
              props.onLoading(false);

              navigation.navigate(navigationConstants.comment, {
                comment: i,
                upvote: i.upvote,
                downvote: i.downvote,
                replies: i.comment_count,
                vote: i.vote,
                fromNotify: true,
                reply: reply.data.result,
              });
            })
            .catch(error => {
              props.onLoading(false);
              console.log(error);
            });
        }
      );
    } else if (notify.notification_type == 3)  {
      props.onLoading(false);
      navigation.push(navigationConstants.profile, { id: notify.object_id });
    }
  };
  return (
    <Card containerStyle={styles.container}>
      <TouchableHighlight
        style={styles.btnCard}
        onPress={async () => await read()}
        onLongPress={() => {
          setModalVisible(true);
        }}
        underlayColor={touch_color}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: 8,
            borderRadius: 8,
            backgroundColor: !isRead ? '#e3e3e3' : '#fff',
            opacity: !isRead ? 0.8 : 1,
          }}
        >
          <View style={styles.headerAvatar}>
            <TouchableOpacity>
              <Image
                style={styles.imgAvatar}
                source={{ uri: notify.author_avatar }}
              />
            </TouchableOpacity>
            <View style={{ flexShrink: 1, marginLeft: 64 }}>
              {notify.object_thumbnail != '' && notify.object_thumbnail ? (
                <Text numberOfLines={3}>
                  {notify.content}
                  {notify.notification_type == 0
                    ? 'Bài đăng của bạn'
                    : notify.notification_type == 1
                    ? 'Bình luận của bạn:'
                    : notify.notification_type == 2
                    ? 'Phản hồi của bạn:'
                    : ''}{' '}
                  "
                  {notify.object_thumbnail.length < 80
                    ? `${notify.object_thumbnail}`
                    : `${notify.object_thumbnail.substring(0, 200)}...`}
                  "
                </Text>
              ) : (
                <Text numberOfLines={3}>{notify.content}</Text>
              )}

              <Text style={styles.txtCreateDate}>
                {moment(new Date()).diff(
                  moment(notify.created_date),
                  'minutes'
                ) < 60
                  ? moment(new Date()).diff(
                      moment(notify.created_date),
                      'minutes'
                    ) + ' phút trước'
                  : moment(new Date()).diff(
                      moment(notify.created_date),
                      'hours'
                    ) < 24
                  ? moment(new Date()).diff(
                      moment(notify.created_date),
                      'hours'
                    ) + ' giờ trước'
                  : moment(notify.created_date).format('hh:mm DD-MM-YYYY')}
              </Text>
            </View>
          </View>

          <View style={styles.btnCancel}>
            <TouchableOpacity onPress={() => setVisible(true)}>
              <FontAwesome name={'times'} size={16} color={active_color} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
      <NotifyOptionModal
        visible={modalVisible}
        onSwipeOut={event => {
          setModalVisible(false);
        }}
        onHardwareBackPress={() => {
          setModalVisible(false);
          return true;
        }}
        onTouchOutside={() => {
          setModalVisible(false);
        }}
        onDelete={onDeleteCB}
      />
      <Modal
        visible={visible}
        width={deviceWidth - 56}
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ fontSize: 14, color: main_color }}
              text="Hủy"
              onPress={() => {
                setVisible(false);
              }}
            />
            <ModalButton
              textStyle={{ fontSize: 14, color: 'red' }}
              text="Xóa"
              onPress={() => {
                setVisible(false);
                props.onDelete(notify.oid);
              }}
            />
          </ModalFooter>
        }
      >
        <ModalContent>
          <View>
            <Text style={{ fontSize: 16, alignSelf: 'center' }}>
              Bạn muốn xóa thông báo này?
            </Text>
          </View>
        </ModalContent>
      </Modal>
    </Card>
  );
}

export default NotifyCard;
