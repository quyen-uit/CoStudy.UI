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
import { getUser } from 'selectors/UserSelectors';
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
import CommentOptionModal from 'components/modal/CommentOptionModal/CommentOptionModal';
import { getAPI } from '../../../apis/instance';

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
function ChildComment(props) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.containerComment}>
      <TouchableOpacity onPress={() => alert('avatar is clicked')}>
        <Image
          style={styles.imgChildAvatar}
          source={require('../../../assets/avatar.jpeg')}
        />
      </TouchableOpacity>
      <TouchableHighlight
        style={styles.btnChildComment}
        underlayColor={touch_color}
        onPress={() => alert('click')}
        onLongPress={() => setModalVisible(true)}
      >
        <View>
          <Text style={styles.txtChildAuthor}>{comment.author}</Text>
          <Text style={styles.txtChildContent}>{comment.content}</Text>
          <View style={styles.footer}>
            <View style={styles.containerCreatedTime}>
              <FontAwesome name={'circle'} size={6} color={active_color} />
              <Text style={styles.txtChildCreateDate}>
                {comment.createdDate}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.rowFlexStart}>
                <Text style={styles.txtChildVoteNumber}>10</Text>
                <TouchableOpacity>
                  <FontAwesome5
                    name={'thumbs-up'}
                    size={14}
                    color={main_color}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rowFlexStart}>
                <Text style={styles.txtChildVoteNumber}>11</Text>
                <TouchableOpacity>
                  <FontAwesome5 name={'comment'} size={14} color={main_color} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
      <CommentOptionModal
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
      />
    </View>
  );
}

function CommentCard(props) {
  const curUser = useSelector(getUser);

  const post = tmpComment;
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [isVote, setIsVote] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const comment = props.comment;
  const isInPost = props.isInPost;
  const [modalVisible, setModalVisible] = useState(false);
  // like, comment
  const [upvote, setUpvote] = useState(comment.upvote_count);
  const [downvote, setDownvote] = useState(comment.downvote_count);
  const [comment_count, setCommentCount] = useState(comment.replies_count);

  //const [vote, setVote] = useState(props.vote);
  const onUpvoteCallback = useCallback(value => setUpvote(value));
  const onDownvoteCallback = useCallback(value => setDownvote(value));
  const onCommentCallback = useCallback(value => setCommentCount(value));
  //const onVoteCallback = useCallback((value)=> setVote(value));

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
      });
    }
  };
  console.log(comment);
  const GoToProfile = () => {
    navigation.push(navigationConstants.profile, { id: comment.author_id });
  };

  const onUpvote = async () => {
    setUpvote(upvote + 1);
    setDownvote(downvote - 1);
    await getAPI(curUser.jwtToken)
      .post(api + 'Comment/upvote/' + comment.oid)
      .then(response => ToastAndroid.show('Đã upvote', ToastAndroid.SHORT))
      .catch(err => alert(err));
  };
  const onDownvote = async () => {
    setUpvote(upvote - 1);
    setDownvote(downvote + 1);
    await getAPI(curUser.jwtToken)
      .post(api + 'Comment/downvote/' + comment.oid)
      .then(response => ToastAndroid.show('Đã downvote', ToastAndroid.SHORT))
      .catch(err => alert(err));
  };

  return (
    <View>
      <View style={styles.containerComment}>
        <TouchableOpacity onPress={() => GoToProfile()}>
          <Image
            style={styles.imgAvatar}
            source={{ uri: comment.author_avatar }}
          />
        </TouchableOpacity>
        <View style={styles.shrink1}>
          <TouchableHighlight
            style={styles.btnBigComment}
            underlayColor={touch_color}
            onPress={() => GoToComment()}
            onLongPress={() => setModalVisible(true)}
          >
            <View>
              <Text style={styles.txtAuthor}>{comment.author_name}</Text>
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
                        color={main_color}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowFlexStart}>
                    <Text style={styles.txtVoteNumber}>{downvote}</Text>
                    <TouchableOpacity onPress={() => onDownvote()}>
                      <FontAwesome5
                        name={'thumbs-down'}
                        size={18}
                        color={main_color}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowFlexStart}>
                    <Text style={styles.txtVoteNumber}>{upvote}</Text>
                    <TouchableOpacity onPress={() => onUpvote()}>
                      <FontAwesome5
                        name={'thumbs-up'}
                        size={18}
                        color={main_color}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
          {comment.image != '' ? (
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
      <CommentOptionModal
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
      />
    </View>
  );
}

export default CommentCard;

// {isInPost ? <ChildComment /> : null}
