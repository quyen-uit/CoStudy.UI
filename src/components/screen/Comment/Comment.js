import { useTheme, useRoute, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Keyboard,
  ToastAndroid,
  Pressable,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from 'components/screen/Comment/styles';

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
import ReplyCard from 'components/common/ReplyCard';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { getBasicInfo, getJwtToken, getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import navigationConstants from 'constants/navigation';
import CommentService from 'controllers/CommentService';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';
import ImageView from 'react-native-image-viewing';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function Comment(props) {
  const route = useRoute();
  const userInfo = useSelector(getBasicInfo);
  const jwtToken = useSelector(getJwtToken);

  const [showOption, setShowOption] = useState(true);
  const [data, setData] = useState(route.params.comment);
  const [isLoading, setIsLoading] = useState(false);
  const [replies, setReplies] = useState([]);
  const [replyId, setReplyId] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  //comment
  const [comment, setComment] = useState('');
  const [vote, setVote] = useState(route.params.vote);
  const [upvote, setUpvote] = useState(route.params.upvote);
  const [downvote, setDownvote] = useState(route.params.downvote);
  const [comment_count, setCommentCount] = useState(route.params.replies);
  const [sending, setSending] = useState(false);
  const navigation = useNavigation();
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [bodyAlert, setBodyAlert] = useState('');
    ///image view
    const [imgView, setImgView] = useState();
    const [visible, setIsVisible] = useState(false);
  const showAlert = (title, body) => {
    setBodyAlert(body);
    setVisibleAlert(true);
  };
  const onEditCallBack = useCallback((isEdit, id) => {
    setIsEdit(isEdit);
    setReplyId(id);
    let cmt = replies.filter(x => x.oid == id);
    setComment(cmt[0].content);
  });

  const resetComment = () => {
    setComment('');
    //setImgComment('');
    setIsEdit(false);
  };

  const onViewImage = useCallback((value, uri) => {
    setIsVisible(true);
    setImgView(uri);
  });

  useEffect(() => {
    if (typeof route.params?.onUpvote == 'function') {
      route.params?.onUpvote(upvote);
      route.params?.onVote(vote);
    }
  }, [upvote]);
  useEffect(() => {
    if (typeof route.params?.onUpvote == 'function') {
      route.params?.onDownvote(downvote);
      route.params?.onVote(vote);
    }
  }, [downvote]);
 
  const onNotExist = React.useCallback(id => {
    setReplies(replies.filter(i => i.oid != id));
    if (typeof route.params?.onComment == 'function')
    route.params?.onComment(comment_count - 1);
    setCommentCount(comment_count - 1);

  });
  const GoToProfile = () => {
    navigation.push(navigationConstants.profile, { id: data.author_id });
  };
  const renderItem = ({ item }) => {
    return (
      <View style={{ opacity: item.opacity }}>
        <ReplyCard
          comment={item}
          onEdit={onEditCallBack}
          onViewImage={onViewImage}
           onNotExist={onNotExist}
        />
      </View>
    );
  };
  useEffect(() => {
    setIsLoading(true);

    let isOut = false;
    const fetchData = async () => {
      await CommentService.getAllReply(jwtToken, {
        oid: data.oid,
        skip: 0,
        count: 20,
      })
        .then(async response => {
          if (!isOut) {
            console.log(route.params.reply);
            const a = response.data.result.map(async i => {
              i.opacity = 1;
              if (i.is_vote_by_current) i.vote = 1;
              else if (i.is_downvote_by_current) i.vote = -1;
              else i.vote = 0;
            });
            Promise.all(a).then(() => {
              setIsLoading(false);
              if (route.params?.reply) {
                response.data.result = response.data.result.filter(
                  i => i.oid != route.params.reply.oid
                );
                setReplies([route.params.reply, ...response.data.result]);
              } else setReplies(response.data.result);
            });
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isOut = true;
    };
  }, []);

  const fetchMore = async () => {
    return;
    // await getAPI(jwtToken)
    //   .get(api + 'Comment/get/' + post.oid + '/skip/' + skip + '/count/5')
    //   .then(response => {
    //     if (response.data.result.length > 0) {
    //       setSkip(skip + 5);
    //       response.data.result.forEach(i => (i.opacity = 1));

    //       setComments(comments.concat(response.data.result));
    //     }
    //     setIsEnd(false);
    //   })
    //   .catch(error => console.log(error));
  };

  const updateReply = async () => {
    Keyboard.dismiss();

    if (comment.trim() == '') {
      showAlert('Thông báo', 'Bạn chưa nhập bình luận..');
      return;
    }
    setSending(true);
    replies.forEach(x => {
      if (x.oid == replyId) {
        x.opacity = 0.5;
        x.content = comment;
      }
    });
    ToastAndroid.show('Đang trả lời..', ToastAndroid.SHORT);
    await CommentService.updateReply(jwtToken, {
      content: comment,
      replyId: replyId,
    })
      .then(response => {
        replies.forEach(x => {
          x.opacity = 1;
        });
        setComment('');
        setIsEdit(false);
        setSending(false);

        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Trả lời đã được sửa',
          visibilityTime: 2000,
        });
      })
      .catch(error => {
        setSending(false);
        console.log(error);
      });
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
    await CommentService.upVoteComment(jwtToken, data.oid)
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
    await CommentService.downVoteComment(jwtToken, data.oid)
      .then(response => ToastAndroid.show('Đã downvote', ToastAndroid.SHORT))
      .catch(err => console.log(err));
  };
  const postComment = async () => {
    if (isEdit) {
      await updateReply();
      return;
    }
    Keyboard.dismiss();

    if (comment.trim() == '') {
      showAlert('Thông báo', 'Bạn chưa nhập bình luận..');
      return;
    }
    flatList.current.scrollToOffset({ animated: true, offset: 0 });

    setSending(true);
    const tmp = {
      content: comment.trim(),
      author_id: userInfo.id,
      status: 0,
      created_date: new Date(),
      modified_date: new Date(),
      upvote_count: 0,
      downvote_count: 0,
      author_avatar: userInfo.avatar,
      author_name: userInfo.first_name + userInfo.last_name,
      vote: 0,
      opacity: 0.5,
      oid: '',
    };
    // setReplies(replies.concat(tmp));
    setReplies([tmp, ...replies]);

    ToastAndroid.show('Đang trả lời..', ToastAndroid.SHORT);
    await CommentService.createReply(jwtToken, {
      comment: comment.trim(),
      oid: data.oid,
    })
      .then(response => {
        setComment('');
        tmp.opacity = 1;
        tmp.oid = response.data.result.oid;
        // setReplies(replies.concat(tmp));
        setReplies([tmp, ...replies]);

        setSending(false);

        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Bình luận đã được đăng',
          visibilityTime: 2000,
        });
        if (typeof route.params?.onUpvote == 'function')
          route.params?.onComment(comment_count + 1);
        setCommentCount(comment_count + 1);
      })
      .catch(error => {
        setSending(false);
        console.log(error);
      });
  };
  const flatList = React.useRef(null);

  return (
    <View style={styles.largeContainer}>
      <SafeAreaView>
        <FlatList
          ref={flatList}
          showsVerticalScrollIndicator={false}
          extraData={replies}
          style={{ marginBottom: 54, paddingBottom: 12 }}
          data={replies}
          onEndReached={async () => {
            if (replies.length > 4) {
              // setIsEnd(true);
              await fetchMore();
            }
          }}
          onEndReachedThreshold={0.1}
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => item.oid}
          ListHeaderComponent={() => (
            <Card containerStyle={styles.container}>
              <View>
                <View style={styles.header}>
                  <View style={styles.headerAvatar}>
                    <TouchableOpacity onPress={() => GoToProfile()}>
                      <Image
                        style={styles.imgAvatar}
                        source={{ uri: data.author_avatar }}
                      />
                    </TouchableOpacity>
                    <View>
                      <TouchableOpacity>
                        <Text style={styles.txtAuthor}>{data.author_name}</Text>
                      </TouchableOpacity>
                      <View style={styles.rowFlexStart}>
                        <FontAwesome
                          name={'circle'}
                          size={8}
                          color={active_color}
                        />
                        <Text style={styles.txtCreateDate}>
                          {moment(new Date()).diff(
                            moment(data.modified_date),
                            'minutes'
                          ) < 60
                            ? moment(new Date()).diff(
                                moment(data.modified_date),
                                'minutes'
                              ) + ' phút trước'
                            : moment(new Date()).diff(
                                moment(data.modified_date),
                                'hours'
                              ) < 24
                            ? moment(new Date()).diff(
                                moment(data.modified_date),
                                'hours'
                              ) + ' giờ trước'
                            : moment(data.modified_date).format(
                                'hh:mm DD-MM-YYYY'
                              )}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {route.params?.fromNotify ? (
                    <TouchableOpacity
                      onPress={async () => {
                        await UserService.getCurrentUser(jwtToken)
                          .then(async response => {
                            setIsLoading(true);
                            await PostService.getPostById(
                              jwtToken,
                              data.post_id
                            )
                              .then(res => {
                                if (res.data.code == 404) {
                                  //props.onNotExist(post.oid);
                                  setIsLoading(false);
                                  ToastAndroid.show(
                                    'Bài đăng không tồn tại.',
                                    1000
                                  );
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
                                setIsLoading(false);
                                navigation.replace(navigationConstants.post, {
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
                          .catch(error => console.log(error));
                      }}
                    >
                      <Text
                        style={{
                          padding: 4,
                          backgroundColor: main_color,
                          fontSize: 16,
                          color: '#fff',
                          borderRadius: 8,
                        }}
                      >
                        Đi đến bài đăng
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View>
                  <View style={styles.rowFlexStart}>
                    <Text style={styles.txtContent}>{data.content}</Text>
                  </View>
                </View>

                {data.image ? (
                  <TouchableOpacity
                    onPress={() => onViewImage(true, data.image)}
                  >
                    <Image
                      style={{
                        width: '100%',
                        height: 400,
                        alignSelf: 'center',
                        marginVertical: 8,
                      }}
                      source={{ uri: data.image }}
                    />
                  </TouchableOpacity>
                ) : null}

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
                        color={vote == -1 ? main_color : '#ccc'}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.flex1}>
                    <Pressable
                      style={({ pressed }) => [
                        { backgroundColor: pressed ? touch_color : '#fff' },
                        styles.btnVote,
                      ]}
                    >
                      <Text style={styles.txtVoteNumber}>{comment_count}</Text>
                      <FontAwesome5
                        name={'comment-alt'}
                        size={24}
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
                        color={vote == 1 ? main_color : '#ccc'}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Card>
          )}
          // ListFooterComponent={() =>
          //   isEnd ? (
          //     <View style={{ marginVertical: 12 }}>
          //       <ActivityIndicator size={'large'} color={main_color} />
          //     </View>
          //   ) : (
          //     <View style={{ margin: 4 }}></View>
          //   )
          // }
        />
        {isLoading ? (
          <View
            style={{
              position: 'absolute',
              justifyContent: 'center',
              backgroundColor: '#cccccc',
              opacity: 0.5,
              width: deviceWidth,
              height: deviceHeight - 20,
            }}
          >
            <ActivityIndicator
              size="large"
              color={main_color}
              style={{ marginBottom: 100 }}
            />
          </View>
        ) : null}
      </SafeAreaView>
      <View style={styles.containerInput}>
        {false ? (
          <View style={styles.row}>
            <TouchableOpacity style={styles.btnInputOption}>
              <FontAwesome5 name={'plus-circle'} size={24} color={main_color} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnInputOption}>
              <FontAwesome5
                name={'square-root-alt'}
                size={24}
                color={main_color}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnInputOption}>
              <FontAwesome5 name={'images'} size={24} color={main_color} />
            </TouchableOpacity>
          </View>
        ) : (
          // <TouchableOpacity
          //   style={styles.btnInputOption}
          //   onPress={() => setShowOption(true)}
          // >
          //   <FontAwesome5 name={'angle-right'} size={24} color={main_color} />
          // </TouchableOpacity>
          <View style={{ marginLeft: 4 }}></View>
        )}
        <View style={{ flex: 1 }}>
          {isEdit ? (
            <View
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#b90000',
                padding: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
                marginBottom: 4,
              }}
            >
              <TouchableOpacity onPress={() => resetComment()}>
                <Text style={{ fontSize: 16, color: '#fff' }}>
                  Hủy sửa bình luận
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          <TextInput
            multiline={true}
            style={styles.input}
            onTouchEnd={() => setShowOption(false)}
            onChangeText={text => setComment(text)}
            placeholder="Nhập phản hồi"
            value={comment}
          />
        </View>
        {sending ? (
          <View style={styles.btnInputOption}>
            <FontAwesome5 name={'paper-plane'} size={24} color={'#ccc'} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.btnInputOption}
            onPress={() => postComment()}
          >
            <FontAwesome5 name={'paper-plane'} size={24} color={main_color} />
          </TouchableOpacity>
        )}
      </View>
      <Modal
        visible={visibleAlert}
        width={deviceWidth - 56}
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ fontSize: 14, color: main_color }}
              text="Hủy"
              onPress={() => setVisibleAlert(false)}
            />
          </ModalFooter>
        }
      >
        <ModalContent>
          <View>
            <Text style={{ fontSize: 16, alignSelf: 'center' }}>
              {bodyAlert}
            </Text>
          </View>
        </ModalContent>
      </Modal>
      <ImageView
        images={[{ uri: imgView }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
}

export default Comment;
