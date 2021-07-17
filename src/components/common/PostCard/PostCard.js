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
  useWindowDimensions,
} from 'react-native';
import styles from 'components/common/PostCard/styles';
import { Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import PostService from 'controllers/PostService';

import { getJwtToken, getUser } from 'selectors/UserSelectors';
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
import Badge from '../Badge';
import { createThumbnail } from 'react-native-create-thumbnail';

function PostCard(props) {
  const navigate = useNavigation();
  const post = props.post;
  const userId = props.userId;
  const [isVote, setIsVote] = useState(false);
  const navigation = useNavigation();
  const [author, setAuthor] = useState();
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height;
  const jwtToken = useSelector(getJwtToken);
  const [isUp, setIsUp] = useState(false);
  const [isDown, setIsDown] = useState(false);
  const [thumb, setThumb] = useState(
    'https://firebasestorage.googleapis.com/v0/b/costudy-c5390.appspot.com/o/video_thumb.jpg?alt=media&token=45c63095-56af-4ee7-be2b-8b8a4b327145'
  );
  // like, comment
  const [upvote, setUpvote] = useState(post.upvote);
  const [downvote, setDownvote] = useState(post.downvote);
  const [comment, setComment] = useState(post.comments_count);
  const [saved, setSaved] = useState(post.is_save_by_current);
  const [vote, setVote] = useState(post.vote);
  const onUpvoteCallback = useCallback(value => setUpvote(value));
  const onDownvoteCallback = useCallback(value => setDownvote(value));
  const onCommentCallback = useCallback(value => setComment(value));
  const onVoteCallback = useCallback(value => setVote(value));
  const onSaveCallBack = useCallback(value => setSaved(value));
  useEffect(() => {
    setComment(post.comments_count);
    setUpvote(post.upvote);
    setDownvote(post.downvote);
    setVote(post.vote);
    setSaved(post.is_save_by_current);
  }, [
    post.comments_count,
    post.vote,
    post.upvote,
    post.downvote,
    post.is_save_by_current,
  ]);

  useEffect(() => {
    if (
      post.image_contents.length > 0 &&
      post.image_contents[0].media_type == 1
    )
      createThumbnail({
        url: post.image_contents[0].image_hash,
        timeStamp: 1000,
      })
        .then(response => {
          setThumb(response.path);
        })
        .catch(err => console.log({ err }));
    const fetchData = async () => {};
    fetchData();
  }, [post.image_contents]);
  const GoToPost = () => {
    PostService.getPostById(jwtToken, post.oid)
      .then(res => {
        if (res.data.code == 404) {
          props.onNotExist(post.oid);
          ToastAndroid.show('Bài đăng không tồn tại.', 1000);
        } else {
          post.saved = res.data.result.is_save_by_current;
          navigation.navigate(navigationConstants.post, {
            post: post,
            vote: vote,
            upvote: upvote,
            commentCount: comment,
            downvote: downvote,
            onUpvote: onUpvoteCallback,
            onDownvote: onDownvoteCallback,
            onComment: onCommentCallback,
            onVote: onVoteCallback,
            onSave: onSaveCallBack,
          });
        }
      })
      .catch(err => console.log(err));
  };

  const onUpvote = async () => {
    if (vote == 1) {
      ToastAndroid.show('Bạn đã upvote cho bài đăng này.', 1000);
      return;
    } else if (vote == 0) {
      setVote(1);
      setUpvote(upvote + 1);
    } else {
      setVote(1);
      setUpvote(upvote + 1);
      setDownvote(downvote - 1);
    }
    await PostService.upvote(jwtToken, post.oid).then(response =>
      ToastAndroid.show('Đã upvote', ToastAndroid.SHORT)
    );
  };
  const onDownvote = async () => {
    if (vote == -1) {
      ToastAndroid.show('Bạn đã downvote cho bài đăng này.', 1000);
      return;
    } else if (vote == 0) {
      setVote(-1);
      setDownvote(downvote + 1);
    } else {
      setVote(-1);
      setDownvote(downvote + 1);
      setUpvote(upvote - 1);
    }
    await PostService.downvote(jwtToken, post.oid).then(response =>
      ToastAndroid.show('Đã downvote', ToastAndroid.SHORT)
    );
  };
  const GoToProfile = () => {
    navigation.push(navigationConstants.profile, { id: post.author_id });
  };

  return (
    <Card containerStyle={styles.container}>
      <TouchableHighlight
        onPress={() => GoToPost()}
        underlayColor={touch_color}
        style={styles.card}
      >
        <View>
          <View style={{ ...styles.header, width: deviceWidth - 34 }}>
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
                <View style={styles.containerHeader}>
                  <TouchableOpacity onPress={() => GoToProfile()}>
                    <Text style={styles.txtAuthor}>{post.author_name}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.rowFlexStart}>
                  <View
                    style={{
                      marginRight: 4,
                      paddingHorizontal: 4,
                      paddingVertical: 2,
                      borderRadius: 4,
                      backgroundColor:
                        post.post_type == 0 ? main_color : main_2nd_color,
                    }}
                  >
                    <Text style={{ fontSize: 10, color: '#fff' }}>
                      {post.post_type_name}
                    </Text>
                  </View>

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

            <View style={{ marginRight: -8 }}>
              <TouchableOpacity
                activeOpacity={1}
                underlayColor={touch_color}
                style={styles.btn3Dot}
                onPress={() => {
                  props.onModal(true, post.oid, saved);
                }}
              >
                <View style={styles.btnOption}>
                  <FontAwesome name={'ellipsis-v'} size={24} color="#c4c4c4" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <View style={styles.rowFlexStart}>
              {/* <FontAwesome
                style={styles.iconTitle}
                name={'angle-double-right'}
                size={20}
                color={main_color}
              /> */}
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
            <View>
              {post.image_contents[0].media_type == 0 ||
              post.image_contents[0].media_type == null ? (
                <TouchableOpacity
                  onPress={() =>
                    props.onViewImage(true, post.image_contents[0].image_hash)
                  }
                >
                  <Image
                    style={styles.imgContent}
                    source={{
                      uri: post.image_contents[0].image_hash,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(navigationConstants.videoPlayer, {
                      video: post.image_contents[0].image_hash,
                    })
                  }
                >
                  <Image
                    style={styles.imgContent}
                    source={{
                      uri: thumb,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(navigationConstants.videoPlayer, {
                        video: post.image_contents[0].image_hash,
                      })
                    }
                    style={{
                      position: 'absolute',
                      alignSelf: 'center',
                      top: 90,
                    }}
                  >
                    <FontAwesome5 name={'play'} size={30} color={'#fff'} />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          {post.field ? (
            <View style={styles.containerTag}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {post.field.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate(navigationConstants.search, {
                        fieldId: item.field_id,
                      });
                    }}
                    key={index}
                  >
                    <Badge
                      item={{
                        name: item.level_name,
                        description: item.field_name,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ) : null}
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
            <FontAwesome5
              name={'comment-alt'}
              size={22}
              color={main_2nd_color}
            />
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
