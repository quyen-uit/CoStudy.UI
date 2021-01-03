import React, { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  ScrollView,
  ToastAndroid,
  Pressable,
} from 'react-native';
import styles from 'components/common/PostCard/styles';
import { Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import PostOptionModal from 'components/modal/PostOptionModal/PostOptionModal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getUser } from 'selectors/UserSelectors';
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import {
  active_color,
  main_2nd_color,
  main_color,
  touch_color,
  btn_not_selected,
  btn_selected,
} from '../../../constants/colorCommon';
import moment from 'moment';

import { useState } from 'react';
import { func } from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { api } from 'constants/route';
import { RotationGestureHandler } from 'react-native-gesture-handler';
function PostCard(props) {
  const post = props.post;
  const userId = props.userId;
  const [isVote, setIsVote] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [author, setAuthor] = useState();
   
  const curUser = useSelector(getUser);
  const [isUp, setIsUp] = useState(false);
  const [isDown, setIsDown] = useState(false);

  // like, comment
  const [upvote, setUpvote] = useState(post.upvote);
  const [downvote, setDownvote] = useState(post.downvote);
  const [comment, setComment] = useState(post.comments_countd);
  
  const [vote, setVote] = useState(post.vote);
  const onUpvoteCallback = useCallback((value)=>setUpvote(value));
  const onDownvoteCallback = useCallback((value) => setDownvote(value));
  const onCommentCallback = useCallback((value)=> setComment(value));
  const onVoteCallback = useCallback((value)=> setVote(value));

   const config = {
     
    headers: { Authorization: `Bearer ${curUser.jwtToken}` },
  };
  useEffect(() => {
    const fetchData = async () => {};
    fetchData();
  }, []);
  const GoToPost = () => {

    navigation.navigate(navigationConstants.post, {
      post: post,
      author: author,
      vote: vote,
      upvote: upvote,
      commentCount: comment,
      downvote: downvote,
      onUpvote: onUpvoteCallback,
      onDownvote: onDownvoteCallback,
      onComment: onCommentCallback,
      onVote: onVoteCallback
    });
  };

  const onUpvote = async () => {
    if (vote == 1) {
      ToastAndroid.show('Bạn đã upvote cho bài viết này.',1000)
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
    await axios
      .post(api + 'Post/post/upvote/' + post.oid, { id: post.oid }, config)
      .then(response => ToastAndroid.show('Đã upvote', ToastAndroid.SHORT));
  };
  const onDownvote = async () => {
    if (vote == -1) {
      ToastAndroid.show('Bạn đã downvote cho bài viết này.', 1000)
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
    await axios
      .post(api + 'Post/post/downvote/' + post.oid, { id: post.oid }, config)
      .then(response => ToastAndroid.show('Đã downvote', ToastAndroid.SHORT));
  };
  const GoToProfile = () => {
    navigation.push(navigationConstants.profile, {id: post.author_id});
  };
  return (
    <Card containerStyle={styles.container}>
      <TouchableHighlight
        onPress={() => GoToPost()}
        underlayColor={touch_color}
        style={styles.card}
      >
        <View>
          <View style={styles.header}>
            <View style={styles.headerAvatar}>
              <TouchableOpacity onPress={() => GoToProfile()}>
                <Image
                  style={styles.imgAvatar}
                  source={{
                    uri: post.author_avatar,
                  }}
                />
              </TouchableOpacity>
              <View>
                <TouchableOpacity>
                  <Text style={styles.txtAuthor}>{post.author_name}</Text>
                </TouchableOpacity>
                <View style={styles.rowFlexStart}>
                  <FontAwesome name={'circle'} size={8} color={active_color} />
                  <Text style={styles.txtCreateDate}>
                    {moment(new Date()).diff(
                      moment(post.created_date),
                      'minutes'
                    ) < 60
                      ? moment(new Date()).diff(
                          moment(post.created_date),
                          'minutes'
                        ) + ' phút trước'
                      : moment(new Date()).diff(
                          moment(post.created_date),
                          'hours'
                        ) < 24
                      ? moment(new Date()).diff(
                          moment(post.created_date),
                          'hours'
                        ) + ' giờ trước'
                      : moment(post.created_date).format('hh:mm DD-MM-YYYY')}
                  </Text>
                </View>
              </View>
            </View>

            <View>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={touch_color}
                style={styles.btn3Dot}
                onPress={() => setModalVisible(true)}
              >
                <View style={styles.btnOption}>
                  <FontAwesome name={'ellipsis-v'} size={24} color="#c4c4c4" />
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View>
            <View style={styles.rowFlexStart}>
              <FontAwesome
                style={styles.iconTitle}
                name={'angle-double-right'}
                size={20}
                color={main_color}
              />
              <Text style={styles.txtTitle}>{post.title}</Text>
            </View>
            <Text style={styles.txtContent} numberOfLines={3}>
              {}
              {post.string_contents[0].content.length < 80
                ? `${post.string_contents[0].content}`
                : `${post.string_contents[0].content.substring(0, 200)}...`}
            </Text>
          </View>

          {post.image_contents.length > 0 ? (
            <TouchableOpacity onPress={()=>props.onViewImage(true,post.image_contents[0].image_hash)}>
            <Image
              style={styles.imgContent}
              source={{
                uri: post.image_contents[0].image_hash,
              }}
            />
            </TouchableOpacity>
          ) : null}

          <View style={styles.containerTag}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {post.fields.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => alert('tag screen')}
                >
                  <View style={styles.btnTag}>
                    <Text style={styles.txtTag}>{item.value}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </TouchableHighlight>
      <View style={styles.footer}>
        <View style={styles.flex1}>
          <Pressable
            style={({ pressed }) => [
              { backgroundColor: pressed ? touch_color : '#fff' },
              styles.btnVote,
            ]}
            onPress={() => onDownvote()}
          >
            <Text style={styles.txtVoteNumber}>{downvote}</Text>
            <FontAwesome5
              name={'thumbs-down'}
              size={24}
              color={vote == -1 ? btn_selected : btn_not_selected}
            />
          </Pressable>
        </View>

        <View style={styles.flex1}>
          <Pressable
            onPress={() => GoToPost()}
            style={({ pressed }) => [
              { backgroundColor: pressed ? touch_color : '#fff' },
              styles.btnVote,
            ]}
          >
            <Text style={styles.txtVoteNumber}>{comment}</Text>
            <FontAwesome5 name={'comment-alt'} size={22} color={main_2nd_color} />
          </Pressable>
        </View>
        <View style={styles.flex1}>
          <Pressable
            style={({ pressed }) => [
              { backgroundColor: pressed ? touch_color : '#fff' },
              styles.btnVote,
            ]}
            onPress={() => onUpvote()}
          >
            <Text style={styles.txtVoteNumber}>{upvote}</Text>
            <FontAwesome5
              name={'thumbs-up'}
              size={24}
              color={vote == 1 ? btn_selected : btn_not_selected}
            />
          </Pressable>
        </View>
      </View>
      <PostOptionModal
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
        saved={post.saved}
        id={post.oid}
      />
    </Card>
  );
}

export default PostCard;

// {isVote ? (
//   <View style={styles.containerPopupVote}>
//     <FontAwesome5
//       style={styles.btnVoteInPopup}
//       name={'thumbs-up'}
//       size={24}
//       color={main_color}
//     />
//     <FontAwesome5
//       style={styles.btnVoteInPopup}
//       name={'thumbs-down'}
//       size={24}
//       color={main_2nd_color}
//     />
//   </View>
// ) : null}
