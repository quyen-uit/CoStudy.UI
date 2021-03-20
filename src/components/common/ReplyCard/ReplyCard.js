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
import styles from 'components/common/ReplyCard/styles';
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


function ReplyCard(props) {
  const curUser = useSelector(getUser);

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

  const [vote, setVote] = useState(comment.vote);
  const onUpvoteCallback = useCallback(value => setUpvote(value));
  const onDownvoteCallback = useCallback(value => setDownvote(value));
  const onCommentCallback = useCallback(value => setCommentCount(value));
  const onVoteCallback = useCallback((value)=> setVote(value));

  const GoToComment = () => {
    
  };
  const GoToProfile = () => {
    navigation.push(navigationConstants.profile, { id: comment.author_id });
  };

  const onUpvote = async () => {
    if (vote == 1) {
      ToastAndroid.show('Bạn đã upvote cho bình luận này.',1000)
      return;
    } else if (vote == 0) {
      setVote(1);
      setUpvote(upvote + 1);
    } else 
    {
      setVote(1);
      setUpvote(upvote + 1);
      setDownvote(downvote - 1);
    }
    await getAPI(curUser.jwtToken)
      .post(api + 'Comment/upvote/' + comment.oid)
      .then(response => ToastAndroid.show('Đã upvote', ToastAndroid.SHORT))
      .catch(err => console.log(err));
  };
  const onDownvote = async () => {
    if (vote == -1) {
      ToastAndroid.show('Bạn đã downvote cho bình luận này.', 1000)
      return;
    } else if (vote == 0) {
      setVote(-1);
      setDownvote(downvote + 1);
    } else 
    {
      setVote(-1);
      setDownvote(downvote + 1);
      setUpvote(upvote - 1);
    }
    await getAPI(curUser.jwtToken)
      .post(api + 'Comment/downvote/' + comment.oid)
      .then(response => ToastAndroid.show('Đã downvote', ToastAndroid.SHORT))
      .catch(err => console.log(err));
  };
  return (
    <View>
      <View style={styles.containerComment}>
        <TouchableOpacity onPress={() => GoToProfile()}>
          <Image
            style={styles.imgAvatar}
            source={{ uri: comment.authorAvatar }}
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
              <Text style={styles.txtAuthor}>{comment.authorName}</Text>
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
          </TouchableHighlight>
          
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

export default ReplyCard;

// {isInPost ? <ChildComment /> : null}
