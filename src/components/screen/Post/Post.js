import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Pressable,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  Keyboard,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from 'components/screen/Post/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { color } from 'react-native-reanimated';
import navigationConstants from 'constants/navigation';

import {
  main_2nd_color,
  main_color,
  touch_color,
  active_color,
  btn_not_selected,
  btn_selected,
  background_gray_color,
} from 'constants/colorCommon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Card } from 'react-native-elements';
import CommentCard from 'components/common/CommentCard';
import { useRoute } from '@react-navigation/native';
import { getBasicInfo, getJwtToken } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import { api } from 'constants/route';
import ImageView from 'react-native-image-viewing';
import { ImageComponent } from 'react-native';
import CommentService from 'controllers/CommentService';
import PostService from 'controllers/PostService';
import CommentOptionModal from 'components/modal/CommentOptionModal/CommentOptionModal';
import { update } from 'actions/UserActions';
import Badge from 'components/common/Badge';
import PostOptionModal from 'components/modal/PostOptionModal/PostOptionModal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function Post(props) {
  const navigation = useNavigation();
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);

  const [refreshing, setRefreshing] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const route = useRoute();
  const [post, setPost] = useState(route.params.post);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [upvote, setUpvote] = useState(route.params.upvote);
  const [downvote, setDownvote] = useState(route.params.downvote);
  const [commentCount, setCommentCount] = useState(route.params.commentCount);
  const [vote, setVote] = useState(route.params.vote);
  const [saved, setSaved] = useState(route.params.post.saved);
  const [isSaving, setIsSaving] = useState(false);
  //comment
  const [chosing, setChosing] = useState(false);

  const [imgComment, setImgComment] = useState('');
  const [comment, setComment] = useState('');
  const [isEnd, setIsEnd] = useState(false);
  const [skip, setSkip] = useState(0);
  const [sending, setSending] = useState(false);
  const [stop, setStop] = useState(false);
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ margin: 16 }}>
          <TouchableOpacity onPress={() => setPostModalVisible(true)}>
            <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  const onNotExist = React.useCallback(id => {
    setComments(comments.filter(i => i.oid != id));
    if (typeof route.params.onComment == 'function')
      route.params.onComment(commentCount - 1);
    setCommentCount(commentCount - 1);
  });
  const onDeleteCallback = React.useCallback(value => {
    // setVisibleDelete(true);
    CommentService.deleteComment(jwtToken, idModal)
      .then(res => {
        ToastAndroid.show('Xóa bình luận thành công', 1000);
        setComments(comments.filter(i => i.oid != idModal));
        if (typeof route.params.onComment == 'function')
          route.params.onComment(commentCount - 1);
        setCommentCount(commentCount - 1);
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.show('Bình luận chưa được xóa', 1000);
      });
    setModalVisible(false);
  });

  const resetComment = () => {
    setComment('');
    setImgComment('');
    setIsEdit(false);
  };
  const renderItem = ({ item }) => {
    return (
      <View style={{ opacity: item.opacity }}>
        <CommentCard
          comment={item}
          isInPost={true}
          onViewImage={onViewImage}
          onCommentModal={onCommentModal}
          onNotExist={onNotExist}
        />
      </View>
    );
  };
  ///image view
  const [imgView, setImgView] = useState();
  const [visible, setIsVisible] = useState(false);

  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [idModal, setIdModal] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [postModalVisible, setPostModalVisible] = useState(false);
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [bodyAlert, setBodyAlert] = useState('');
  const [violenceWords, setViolenceWords] = useState([]);
  const [allowUp, setAllowUp] = useState(false);
  const [offset, setOffset] = useState(0);
  const showAlert = (title, body) => {
    setBodyAlert(body);
    setVisibleAlert(true);
  };

  const onPostVisibleCallBack = React.useCallback(value => {
    setPostModalVisible(value);
  });
  const onDelete = async () => {
    await PostService.deletePost(jwtToken, post.oid)
      .then(res => {
        ToastAndroid.show('Xóa bài đăng thành công', 1000);
        navigation.goBack();
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.show('bài đăng chưa được xóa', 1000);
      });
  };

  const onDeletePostCallback = React.useCallback(async value => {
    // setVisibleDelete(true);
    await onDelete();
    setPostModalVisible(false);
    //setTmp(value);
    //setIdModal(value);
  });
  const onSaveCallBack = useCallback(value => {
    setSaved(value);
  });
  const onCommentModal = useCallback((value, id) => {
    setModalVisible(value);
    setIdModal(id);
  });
  const onVisibleCallBack = useCallback(value => {
    setModalVisible(value);
  });
  const onEditCallBack = useCallback((isEdit, id) => {
    setIsEdit(isEdit);

    let cmt = comments.filter(x => x.oid == id);

    setComment(cmt[0].content);
    if (cmt[0].image != '' && cmt[0].image != null)
      setImgComment({ path: cmt[0].image, isEdit: false });
    else setImgComment('');
  });
  const onViewImage = useCallback((value, uri) => {
    setIsVisible(true);
    setImgView(uri);
  });

  useEffect(() => {
    if (
      typeof route.params.onUpvote == 'function' &&
      typeof route.params.onVote == 'function'
    ) {
      route.params.onUpvote(upvote);
      route.params.onVote(vote);
    }
  }, [upvote]);

  useEffect(() => {
    if (
      typeof route.params.onDownvote == 'function' &&
      typeof route.params.onVote == 'function'
    ) {
      route.params.onDownvote(downvote);
      route.params.onVote(vote);
    }
  }, [downvote]);

  useEffect(() => {
    setIsLoading(true);
    setStop(false);
    if (refreshing) setRefreshing(false);
    let isOut = false;
    const fetchData = async () => {
      await PostService.getViolenceWord(jwtToken)
        .then(res => setViolenceWords(res.data.result))
        .catch(err => console.log(err));
      await CommentService.getCommentByPostId(jwtToken, {
        oid: post.oid,
        skip: 0,
        count: 5,
      })
        .then(response => {
          if (!isOut) {
            setIsLoading(false);
            response.data.result.forEach(i => {
              i.opacity = 1;
              if (i.is_vote_by_current) i.vote = 1;
              else if (i.is_downvote_by_current) i.vote = -1;
              else i.vote = 0;
            });
            setComments(response.data.result);
            setSkip(5);
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isOut = true;
    };
  }, [refreshing]);

  const fetchMore = async () => {
    if (stop) {
      setIsEnd(false);
      return;
    }
    await CommentService.getCommentByPostId(jwtToken, {
      oid: post.oid,
      skip: skip,
      count: 5,
    })
      .then(response => {
        if (response.data.result.length > 0) {
          setSkip(skip + 5);
          response.data.result.forEach(i => {
            i.opacity = 1;
            if (i.is_vote_by_current) i.vote = 1;
            else if (i.is_downvote_by_current) i.vote = -1;
            else i.vote = 0;
          });
          setComments(comments.concat(response.data.result));
        } else {
          setStop(true);
          setIsEnd(false);
        }
      })
      .catch(error => console.log(error));
  };
  const onSaved = async () => {
    setIsSaving(true);
    // if (saved) {
    await PostService.savePost(jwtToken, post.oid)
      .then(response => {
        if (response.data.result.is_save) {
          if (typeof route.params.onSave == 'function')
            route.params.onSave(true);
          ToastAndroid.show('Đã lưu thành công', ToastAndroid.SHORT);
          setIsSaving(false);
          setSaved(true);
        } else {
          if (typeof route.params.onSave == 'function')
            route.params.onSave(false);
          setSaved(false);
          setIsSaving(false);
          ToastAndroid.show('Đã hủy lưu thành công', ToastAndroid.SHORT);
        }
      })
      .catch(err => {
        ToastAndroid.show('Có lỗi xảy ra..', ToastAndroid.SHORT);
        setIsSaving(false);
      });
    // } else {
    //   await PostService.savePost(jwtToken, post.oid)
    //     .then(response => {
    //       ToastAndroid.show('Đã lưu thành công', ToastAndroid.SHORT);
    //       setIsSaving(false);
    //       setSaved(true);
    //     })
    //     .catch(err => {
    //       ToastAndroid.show('Có lỗi xảy ra..', ToastAndroid.SHORT);
    //       setIsSaving(false);
    //     });
    // }
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
    await PostService.upvote(post.oid).then(
      response => ToastAndroid.show('Đã upvote', ToastAndroid.SHORT),
      1000
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
    await PostService.downvote(post.oid).then(
      response => ToastAndroid.show('Đã downvote', ToastAndroid.SHORT),
      1000
    );
  };
  const pickImage = () => {
    ImagePicker.openPicker({
      width: 800,
      height: 1100,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        image.isEdit = true;
        setImgComment(image);
      }
    });
  };
  const cameraImage = () => {
    ImagePicker.openCamera({
      width: 800,
      height: 1100,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        image.isEdit = true;
        setImgComment(image);
      }
    });
  };

  const updateComment = async () => {
    let image = '';
    let img = '';
    comments.forEach(x => {
      if (idModal == x.oid) {
        x.opacity = 0.5;
        x.content = comment;
        x.image = imgComment.path;
      }
    });
    setSending(true);
    ToastAndroid.show('Đang cập nhật bình luận ...', ToastAndroid.SHORT);
    if (imgComment.isEdit) {
      if (imgComment) {
        image = imgComment;
        const uri = image.path;
        const filename = uuidv4();
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
          .ref('comment/' + post.oid + '/' + filename)
          .putFile(uploadUri);
        // set progress state
        task.on('state_changed', snapshot => {
          console.log('uploading avatar..');
        });
        try {
          await task.then(async response => {
            await storage()
              .ref(response.metadata.fullPath)
              .getDownloadURL()
              .then(async url => {
                img = url;
              });
          });
        } catch (e) {
          console.error(e);
        }
      }
    } else img = imgComment.path;
    await CommentService.updateComment(jwtToken, {
      comment: comment,
      img: img,
      oid: idModal,
    })
      .then(response => {
        comments.forEach(x => {
          x.opacity = 1;
        });

        setImgComment('');
        setComment('');
        setIsEdit(false);

        setSending(false);

        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Bình luận đã được sửa',
          visibilityTime: 2000,
        });
      })
      .catch(error => {
        setSending(false);
        console.log(error);
      });
  };
  const postComment = async () => {
    Keyboard.dismiss();
    let img = '';
    let image = '';
    if (comment.trim() == '') {
      showAlert('Thông báo', 'Bạn chưa nhập bình luận..');
      return;
    }
    if (violenceWords.length > 0) {
      if (violenceWords.filter(i => comment.includes(i.value)).length > 0) {
        showAlert('Thiếu thông tin', 'Bình luận chứa từ ngữ không phù hợp.');
        setIsLoading(false);
        return;
      }
    }
    flatList.current.scrollToOffset({ animated: true, offset: 0 });

    if (isEdit) {
      updateComment();
      return;
    }
    const tmp = {
      author_avatar: userInfo.avatar,
      author_name: userInfo.first_name + userInfo.last_name,
      content: comment.trim(),
      created_date: new Date(),
      downvote_count: 0,
      id: '',
      image: imgComment.path,
      oid: '',
      post_id: post.oid,
      replies: [],
      replies_count: 0,
      status: 0,
      upvote_count: 0,
      opacity: 0.5,
      vote: 0,
      author_field: null,
    };
    // setComments(comments.concat(tmp));
    setComments([tmp, ...comments]);
    setSending(true);
    ToastAndroid.show('Đang tải bình luận lên...', ToastAndroid.SHORT);
    if (imgComment) {
      image = imgComment;
      const uri = image.path;
      const filename = uuidv4();
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const task = storage()
        .ref('comment/' + post.oid + '/' + filename)
        .putFile(uploadUri);
      // set progress state
      task.on('state_changed', snapshot => {
        console.log('uploading avatar..');
      });
      try {
        await task.then(async response => {
          await storage()
            .ref(response.metadata.fullPath)
            .getDownloadURL()
            .then(async url => {
              img = url;
            });
        });
      } catch (e) {
        console.error(e);
      }
    }

    await CommentService.createComment(jwtToken, {
      comment: comment.trim(),
      img: img,
      oid: post.oid,
    })
      .then(response => {
        setImgComment('');
        setComment('');
        response.data.result.opacity = 1;
        response.data.result.vote = 0;
        // setComments(comments.concat(response.data.result));
        setComments([response.data.result, ...comments]);
        setSending(false);
        if (typeof route.params.onComment == 'function')
          route.params.onComment(commentCount + 1);
        setCommentCount(commentCount + 1);

        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Bình luận đã được đăng',
          visibilityTime: 2000,
        });
      })
      .catch(error => {
        setSending(false);
        console.log(error);
      });
  };
  const flatList = React.useRef(null);
  const goToTop = () => {
    setAllowUp(false);
    setOffset(10000);
    flatList.current.scrollToOffset({ animated: true, offset: 0 });
  };
  return (
    <View style={styles.largeContainer}>
      <SafeAreaView>
        <FlatList
          ref={flatList}
          onScroll={e => {
            if (
              e.nativeEvent.contentOffset.y > 500 &&
              e.nativeEvent.contentOffset.y > offset
            ) {
              setAllowUp(true);
            } else setAllowUp(false);
            setOffset(e.nativeEvent.contentOffset.y);
          }}
          extraData={comments}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 50 }}
          data={comments}
          onEndReached={async () => {
            if (comments.length > 4) {
              setIsEnd(true);

              await fetchMore();
            }
          }}
          onEndReachedThreshold={0.5}
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => item.oid}
          ListHeaderComponent={() => (
            <Card containerStyle={styles.container}>
              <View>
                <View style={styles.header}>
                  <View style={styles.headerAvatar}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.push(navigationConstants.profile, {
                          id: post.author_id,
                        })
                      }
                    >
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
                        <FontAwesome
                          name={'circle'}
                          size={8}
                          color={active_color}
                        />
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
                            : moment(post.created_date).format(
                                'hh:mm DD-MM-YYYY'
                              )}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View>
                    <TouchableHighlight
                      activeOpacity={1}
                      underlayColor={touch_color}
                      style={styles.btnBookmark}
                      onPress={() => {
                        if (isSaving == false) onSaved();
                        else
                          ToastAndroid.show('Đang xử lý..', ToastAndroid.SHORT);
                      }}
                    >
                      <View style={styles.btnOption}>
                        <FontAwesome
                          name={'bookmark'}
                          size={32}
                          color={saved ? main_color : '#ccc'}
                        />
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}
                  >
                    {/* <FontAwesome
                      style={styles.iconTitle}
                      name={'angle-double-right'}
                      size={20}
                      color={main_color}
                    /> */}
                    <Text style={styles.txtTitle}>{post.title}</Text>
                  </View>
                  <Text style={styles.txtContent}>
                    {post.string_contents[0].content}
                  </Text>
                </View>

                <View>
                  {post.image_contents
                    ? post.image_contents.map((item, index) => {
                        return (
                          <View
                            style={{
                              marginHorizontal: 16,
                              borderBottomColor: main_color,
                              borderBottomWidth: 0.5,
                            }}
                            key={index}
                          >
                            <TouchableOpacity
                              onPress={() => onViewImage(true, item.image_hash)}
                            >
                              <Image
                                style={{
                                  width: '100%',
                                  height: 400,
                                  alignSelf: 'center',
                                  marginVertical: 8,
                                }}
                                source={{ uri: item.image_hash }}
                              />
                            </TouchableOpacity>

                            <Text style={styles.txtDes}>
                              {item.discription}
                            </Text>
                          </View>
                        );
                      })
                    : null}
                </View>

                <View style={styles.containerTag}>
                  {post.field
                    ? post.field.map((item, index) => (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            navigation.navigate(navigationConstants.search, {
                              fieldId: item.field_id,
                            });
                          }}
                        >
                          <Badge
                            item={{
                              name: item.level_name,
                              description: item.field_name,
                            }}
                          />
                        </TouchableOpacity>
                      ))
                    : null}
                </View>

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
                      style={({ pressed }) => [
                        { backgroundColor: pressed ? touch_color : '#fff' },
                        styles.btnVote,
                      ]}
                    >
                      <Text style={styles.txtVoteNumber}>{commentCount}</Text>
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
              </View>
            </Card>
          )}
          refreshControl={
            <RefreshControl
              colors={[main_color]}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
              }}
            />
          }
          ListFooterComponent={() =>
            stop ? (
              <Text
                style={{
                  alignSelf: 'center',
                  color: '#4f4f4f',
                  marginBottom: 8,
                }}
              >
                Không còn bình luận.
              </Text>
            ) : isEnd ? (
              <View style={{ marginVertical: 12 }}>
                <ActivityIndicator size={'large'} color={main_color} />
              </View>
            ) : (
              <View style={{ margin: 4 }}></View>
            )
          }
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
            <ActivityIndicator size="large" color={main_color} />
          </View>
        ) : null}
      </SafeAreaView>

      {/* {imgComment != '' ? (
        <View style={{ position: 'absolute', right: 0, bottom: 60 }}>
          <Image
            style={{
              height: 100,
              width: 80,
              alignSelf: 'flex-end',
              margin: 4,
              marginRight: 16,
            }}
            source={{ uri: imgComment.path }}
          />
          <TouchableOpacity
            onPress={() => {
              setImgComment('');
            }}
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              borderRadius: 30,
              right: 10,
              backgroundColor: '#ccc',
            }}
          >
            <FontAwesome5 name={'times-circle'} size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
      ) : null} */}
      <View style={styles.containerInput}>
        {showOption ? (
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
            <TouchableOpacity
              style={styles.btnInputOption}
              onPress={() => setChosing(true)}
            >
              <FontAwesome5 name={'images'} size={24} color={main_color} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={{marginHorizontal: 16}}
            onPress={() => setShowOption(true)}
          >
            <FontAwesome5 name={'angle-right'} size={24} color={main_color} />
          </TouchableOpacity>
        )}
        {/* {imgComment != '' ? (
          <View>
            <Image
              style={{
                height: 100,
                width: 80,
                alignSelf: 'flex-end',
                margin: 4,
                marginRight: 16,
              }}
              source={{ uri: imgComment.path }}
            />
            <TouchableOpacity
              onPress={() => {
                setImgComment('');
              }}
              style={{
                position: 'absolute',
                alignSelf: 'flex-end',
                borderRadius: 30,
                right: 10,
                backgroundColor: '#ccc',
              }}
            >
              <FontAwesome5 name={'times-circle'} size={20} color={'#fff'} />
            </TouchableOpacity>
          </View>
        ) : null}
        <TextInput
          multiline={true}
          style={styles.input}
          onTouchEnd={() => setShowOption(false)}
          onChangeText={text => setComment(text)}
          placeholder="Nhập j đi ..."
          value={comment}
        /> */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            {imgComment != '' && imgComment != null ? (
              <View>
                <Image
                  style={{
                    height: 100,
                    width: 80,
                    alignSelf: 'flex-end',
                    margin: 4,
                    marginRight: 16,
                  }}
                  source={{ uri: imgComment.path }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setImgComment('');
                  }}
                  style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    borderRadius: 30,
                    right: 10,
                    backgroundColor: '#ccc',
                  }}
                >
                  <FontAwesome5
                    name={'times-circle'}
                    size={20}
                    color={'#fff'}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
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
          </View>
          <TextInput
            multiline={true}
            style={styles.input}
            onTouchEnd={() => setShowOption(false)}
            onChangeText={text => setComment(text)}
            placeholder="Nhập bình luận ..."
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

      {chosing ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#ccc',
            height: deviceHeight,
            width: deviceWidth,
            opacity: 0.9,
          }}
        >
          <TouchableOpacity
            style={{ height: deviceHeight, width: deviceWidth }}
            onPress={() => setChosing(false)}
          >
            <View
              style={{
                marginTop: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 30, fontWeight: 'bold', color: main_color }}
              >
                Bạn muốn chọn ảnh từ
              </Text>
              <TouchableOpacity
                onPress={() => {
                  pickImage();
                  setChosing(false);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: main_2nd_color,
                    padding: 12,
                    borderRadius: 20,
                    paddingHorizontal: 32,
                    marginVertical: 40,
                  }}
                >
                  <Image
                    source={require('../../../assets/gallary.png')}
                    style={{ width: 48, height: 48 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginLeft: 20,
                      color: '#fff',
                    }}
                  >
                    Thư viện
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  cameraImage();
                  setChosing(false);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: main_2nd_color,
                    padding: 12,
                    borderRadius: 20,
                    paddingHorizontal: 32,
                  }}
                >
                  <Image
                    source={require('../../../assets/camera.png')}
                    style={{ width: 48, height: 48 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginLeft: 20,
                      color: '#fff',
                    }}
                  >
                    Máy ảnh
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
      {allowUp ? (
        <TouchableOpacity
          onPress={() => goToTop()}
          style={{ position: 'absolute', bottom: 80, right: 32 }}
        >
          <Icon name={'chevron-circle-up'} size={32} color={main_color} />
        </TouchableOpacity>
      ) : null}
      <ImageView
        images={[{ uri: imgView }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
      <PostOptionModal
        visible={postModalVisible}
        id={post.oid}
        onVisible={onPostVisibleCallBack}
        saved={saved}
        onSaveInPost={onSaveCallBack}
        onDelete={onDeletePostCallback}
      />
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
        id={idModal}
        onVisible={onVisibleCallBack}
        onEdit={onEditCallBack}
        onDelete={onDeleteCallback}
        onNotExist={onNotExist}
      />
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
    </View>
  );
}

export default Post;
