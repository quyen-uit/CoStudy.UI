import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ToastAndroid,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from 'components/common/CommentCard/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { color } from 'react-native-reanimated';
import moment from 'moment';
import { api } from '../../../constants/route';
import { getJwtToken, getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import {
  main_2nd_color,
  main_color,
  touch_color,
  active_color,
  background_gray_color,
} from 'constants/colorCommon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Card } from 'react-native-elements';
import navigationConstants from 'constants/navigation';
import CommentService from 'controllers/CommentService';
import Badge from 'components/common/Badge';
import { set } from 'react-native-connectycube/lib/cubeConfig';

const tmpComment = {
  id: '1',
  title: 'Đây là title 1',
  author: 'Nguyễn Văn Nam',
  content:
    'Bọn mình sẽ sử dụng Python, Jupiter Notebook và Google Collab để phân tích, hiển thị dữ liệu, vẽ biểu đồ các kiểu con đà điểu và bình luận nhé. Bọn mình sẽ sử dụng Python, Jupiter Notebook và Google Collab để phân tích, hiển thị dữ liệu, vẽ biểu đồ các kiểu con đà điểu và bình luận nhé',
  createdDate: '10 phut truoc',
};

const comment = {
  author: 'Võ Thanh Tâm',
  content: 'Đây là child content Đây là child content Đây là child content',
  createdDate: '10 phut truoc',
  amountVote: 10,
  amountComment: 20,
};

function CommentCard(props) {
  const jwtToken = useSelector(getJwtToken);

  const navigation = useNavigation();
  const comment = props.comment;
  const isInPost = props.isInPost;

  // like, comment
  const [upvote, setUpvote] = useState(comment.upvote_count);
  const [downvote, setDownvote] = useState(comment.downvote_count);
  const [comment_count, setCommentCount] = useState(comment.replies_count);

  const [vote, setVote] = useState(comment.vote);
  const onUpvoteCallback = useCallback(value => setUpvote(value));
  const onDownvoteCallback = useCallback(value => setDownvote(value));
  const onCommentCallback = useCallback(value => setCommentCount(value));
  const onVoteCallback = useCallback(value => setVote(value));
  React.useEffect(() => {
    setUpvote(comment.upvote_count);
    setDownvote(comment.downvote_count);
    setCommentCount(comment.replies_count);
    setVote(comment.vote);
  },[comment]);
  const GoToComment = () => {
    if (isInPost) {
      navigation.navigate(navigationConstants.comment, {
        comment: comment,
        onUpvote: onUpvoteCallback,
        onDownvote: onDownvoteCallback,
        onComment: onCommentCallback,
        upvote: upvote,
        downvote: downvote,
        replies: comment_count,
        vote: vote,
        onVote: onVoteCallback,
      });
    }
  };
  const GoToProfile = () => {
    navigation.push(navigationConstants.profile, { id: comment.author_id });
  };

  const onUpvote = async () => {
    if (vote == 1) {
      ToastAndroid.show('Bạn đã upvote cho bình luận này.', 1000);
      return;
    } else if (vote == 0) {
      setVote(1);
      setUpvote(upvote + 1);
    } else {
      setVote(1);
      setUpvote(upvote + 1);
      setDownvote(downvote - 1);
    }
    await CommentService.upVoteComment(jwtToken, comment.oid)
      .then(response => ToastAndroid.show('Đã upvote', ToastAndroid.SHORT))
      .catch(err => console.log(err));
  };
  const onDownvote = async () => {
    if (vote == -1) {
      ToastAndroid.show('Bạn đã downvote cho bình luận này.', 1000);
      return;
    } else if (vote == 0) {
      setVote(-1);
      setDownvote(downvote + 1);
    } else {
      setVote(-1);
      setDownvote(downvote + 1);
      setUpvote(upvote - 1);
    }
    await CommentService.downVoteComment(jwtToken, comment.oid)
      .then(response => ToastAndroid.show('Đã downvote', ToastAndroid.SHORT))
      .catch(err => console.log(err));
  };
  return (
    <View key={comment.oid} >
      <View style={styles.containerComment}>
        <TouchableOpacity onPress={() => GoToProfile()}>
          <Image
            style={styles.imgAvatar}
            source={{ uri: comment.author_avatar }}
          />
        </TouchableOpacity>
        <View style={styles.shrink1}>
          <TouchableOpacity
            delayLongPress={100}
            style={styles.btnBigComment}
            underlayColor={touch_color}
            onPress={() => GoToComment()}
            onLongPress={() => props.onCommentModal(true, comment.oid)}
          >
            <View>
              <View
                style={{
                  flexDirection: 'row',

                  marginRight: -10,
                }}
              >
                <Text style={styles.txtAuthor}>{comment.author_name} </Text>

                <View>
                  { comment.author_field != null ? (
                    <Badge
                      item={{
                        name: comment.author_field.level_name,
                        description: comment.author_field.field_name,
                        userBadge: true,
                      }}
                    />
                  ) : null}
                </View>
              </View>
              <Text style={styles.txtContent}>{comment.content}</Text>
              <View style={styles.footer}>
                <View style={styles.containerCreatedTime}>
                  <FontAwesome name={'circle'} size={8} color={active_color} />
                  <Text style={styles.txtCreateDate}>
                    {moment(new Date()).diff(
                      moment(comment.created_date),
                      'minutes'
                    ) < 60
                      ? moment(new Date()).diff(
                          moment(comment.created_date),
                          'minutes'
                        ) + ' phút trước'
                      : moment(new Date()).diff(
                          moment(comment.created_date),
                          'hours'
                        ) < 24
                      ? moment(new Date()).diff(
                          moment(comment.created_date),
                          'hours'
                        ) + ' giờ trước'
                      : moment(comment.created_date).format('hh:mm DD-MM-YYYY')}
                  </Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.rowFlexStart}>
                    <Text style={styles.txtVoteNumber}>{comment_count}</Text>
                    <TouchableOpacity>
                      <FontAwesome5
                        name={'comment'}
                        size={18}
                        color={main_2nd_color}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowFlexStart}>
                    <Text style={styles.txtVoteNumber}>{downvote}</Text>
                    <TouchableOpacity onPress={() => onDownvote()}>
                      <FontAwesome5
                        name={'thumbs-down'}
                        size={18}
                        color={vote == -1 ? main_color : '#ccc'}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowFlexStart}>
                    <Text style={styles.txtVoteNumber}>{upvote}</Text>
                    <TouchableOpacity onPress={() => onUpvote()}>
                      <FontAwesome5
                        name={'thumbs-up'}
                        size={18}
                        color={vote == 1 ? main_color : '#ccc'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
          {comment.image != '' && comment.image != null ? (
            <TouchableOpacity
              onPress={() => props.onViewImage(true, comment.image)}
            >
              <Image
                source={{ uri: comment.image }}
                style={{
                  marginLeft: 24,
                  width: 150,
                  height: 200,
                  alignSelf: 'flex-start',
                  margin: 4,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

export default React.memo(CommentCard);

// {isInPost ? <ChildComment /> : null}
