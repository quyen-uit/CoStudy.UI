import { useTheme, useRoute, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  ToastAndroid,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  TextInput,
  RefreshControl,
  Keyboard,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from 'components/screen/Conversation/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { color } from 'react-native-reanimated';
import {
  main_2nd_color,
  main_color,
  touch_color,
  active_color,
  background_gray_color,
} from 'constants/colorCommon';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Card } from 'react-native-elements';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { getUser, getBasicInfo, getJwtToken } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import ChatOptionModal from 'components/modal/ChatOptionModal/ChatOptionModal';
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';
import ImageView from 'react-native-image-viewing';

import ChatService from 'controllers/ChatService';
import navigationConstants from 'constants/navigation';
import PostService from 'controllers/PostService';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function RightMessage({ item, onViewImage, onDelete, onLoading }) {
  const [showTime, setShowTime] = useState(false);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const jwtToken = useSelector(getJwtToken);

  // const onUpvoteCallback = useCallback();
  // const onDownvoteCallback = useCallback();
  // const onCommentCallback = useCallback();
  // const onVoteCallback = useCallback();

  const onDelete1 = React.useCallback(value => {
    setVisible(true);
  });
  return (
    <TouchableOpacity
      //onLongPress={() => setModalVisible(true)}
      onPress={() => setShowTime(!showTime)}
    >
      <View style={styles.containerRightMessage}>
        <View
          style={[
            {
              alignSelf: 'flex-end',
              marginBottom: 4,
            },
            item.sending
              ? {
                  borderRadius: 8,
                  borderWidth: 1,
                  width: 10,
                  height: 10,
                  borderColor: '#000',
                }
              : {},
          ]}
        >
          {item.sending ? null : (
            <FontAwesome5 name={'check-circle'} size={12} color={main_color} />
          )}
        </View>

        <View>
          {item.message_type == 1 ? (
            <TouchableOpacity
              onPress={() => onViewImage(true, item.content[0].image_hash)}
            >
              <Image
                style={{ width: 200, height: 300, marginRight: 8 }}
                source={{ uri: item.content[0].image_hash }}
              />
            </TouchableOpacity>
          ) : item.message_type == 0 ? (
            <View style={styles.boxRightMessage}>
              <Text style={{ color: '#ffffff' }}>{item.content[0]}</Text>
            </View>
          ) : item.message_type == 3 ? (
            <TouchableOpacity
              onPress={() => {
                onLoading(true);
                PostService.getPostById(jwtToken, item.content.oid)
                  .then(res => {
                    onLoading(false);
                    if (res.data.code == 404) {
                      //props.onNotExist(post.oid);
                      ToastAndroid.show('Bài viết không tồn tại.', 1000);
                    } else {
                      res.data.result.saved =
                        res.data.result.is_save_by_current;
                      navigation.navigate(navigationConstants.post, {
                        post: res.data.result,
                        vote: res.data.result.is_vote_by_current
                          ? 1
                          : res.data.result.is_downvote_by_current
                          ? -1
                          : 0,
                        upvote: res.data.result.upvote,
                        commentCount: res.data.result.comments_count,
                        downvote: res.data.result.downvote,
                      });
                    }
                  })
                  .catch(err => console.log(err));
              }}
              style={styles.boxRightMessage}
            >
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={{ uri: item.content.author_avatar }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderWidth: 0.5,
                      marginRight: 8,
                    }}
                  />
                  <View style={{ width: deviceWidth - 150 }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}
                      numberOfLines={2}
                    >
                      {item.content.title}
                    </Text>
                    <Text style={{ color: '#ccc', fontSize: 12 }}>
                      {item.content.author_name}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ color: '#fff', marginHorizontal: 8 }}
                  numberOfLines={3}
                >
                  {item.content.string_contents[0].content.length < 80
                    ? `${item.content.string_contents[0].content}`
                    : `${item.content.string_contents[0].content.substring(
                        0,
                        200
                      )}...`}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {showTime ? (
        <View style={styles.timeRight}>
          <Text style={{ fontSize: 9, color: '#999' }}>
            {moment(new Date()).diff(moment(item.created_date), 'minutes') < 60
              ? moment(new Date()).diff(moment(item.created_date), 'minutes') +
                ' phút trước'
              : moment(new Date()).diff(moment(item.created_date), 'hours') < 24
              ? moment(new Date()).diff(moment(item.created_date), 'hours') +
                ' giờ trước'
              : moment(item.created_date).format('hh:mm DD-MM-YYYY')}
          </Text>
        </View>
      ) : null}
      <ChatOptionModal
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
        onDelete={onDelete1}
      />
      <Modal
        visible={visible}
        width={deviceWidth - 56}
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ fontSize: 14, color: main_color }}
              text="Hủy"
              onPress={() => setVisible(false)}
            />
            <ModalButton
              textStyle={{ fontSize: 14, color: 'red' }}
              text="Xóa"
              onPress={() => {
                onDelete(item.oid);
                setVisible(false);
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
    </TouchableOpacity>
  );
}
function LeftMessage({ item, onViewImage, avatar, onLoading }) {
  const [showTime, setShowTime] = useState(false);
  const navigation = useNavigation();
  const jwtToken = useSelector(getJwtToken);
  return (
    <TouchableOpacity onPress={() => setShowTime(!showTime)}>
      <View>
        <View style={styles.containerLeftMessage}>
          <View>
            <Image style={styles.imgAvatar} source={{ uri: avatar }} />
          </View>

          {item.message_type == 1 ? (
            <TouchableOpacity
              onPress={() => onViewImage(true, item.content[0].image_hash)}
            >
              <Image
                style={{
                  width: 200,
                  height: 300,
                  marginLeft: 8,
                  borderRadius: 8,
                  borderWidth: 0.5,
                  borderColor: main_color,
                }}
                source={{ uri: item.content[0].image_hash }}
              />
            </TouchableOpacity>
          ) : item.message_type == 0 ? (
            <View style={styles.shirk1}>
              <View style={styles.boxMessage}>
                <Text>{item.content[0]}</Text>
              </View>
            </View>
          ) : item.message_type == 3 ? (
            <TouchableOpacity
              onPress={() => {
                onLoading(true);
                PostService.getPostById(jwtToken, item.oid)
                  .then(res => {
                    onLoading(false);
                    if (res.data.code == 404) {
                      //props.onNotExist(post.oid);
                      ToastAndroid.show('Bài viết không tồn tại.', 1000);
                    } else {
                      res.data.result.saved =
                        res.data.result.is_save_by_current;
                      navigation.navigate(navigationConstants.post, {
                        post: res.data.result,
                        vote: res.data.result.is_vote_by_current
                          ? 1
                          : res.data.result.is_downvote_by_current
                          ? -1
                          : 0,
                        upvote: res.data.result.upvote,
                        commentCount: res.data.result.comments_count,
                        downvote: res.data.result.downvote,
                      });
                    }
                  })
                  .catch(err => console.log(err));
              }}
              style={styles.boxMessage}
            >
              <View>
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={{ uri: item.content.author_avatar }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderWidth: 0.5,
                      marginRight: 8,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: '#000',
                        fontWeight: 'bold',
                        fontSize: 14,
                      }}
                    >
                      {item.content.title}
                    </Text>
                    <Text style={{ color: '#ccc', fontSize: 12 }}>
                      {item.content.author_name}
                    </Text>
                  </View>
                </View>
                <Text
                  style={{ color: '#000', marginHorizontal: 8 }}
                  numberOfLines={3}
                >
                  {item.content.string_contents[0].content.length < 80
                    ? `${item.content.string_contents[0].content}`
                    : `${item.content.string_contents[0].content.substring(
                        0,
                        200
                      )}...`}
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
        {showTime ? (
          <View style={styles.timeLeft}>
            <Text style={{ fontSize: 9, color: '#999' }}>
              {moment(new Date()).diff(moment(item.created_date), 'minutes') <
              60
                ? moment(new Date()).diff(
                    moment(item.created_date),
                    'minutes'
                  ) + ' phút trước'
                : moment(new Date()).diff(moment(item.created_date), 'hours') <
                  24
                ? moment(new Date()).diff(moment(item.created_date), 'hours') +
                  ' giờ trước'
                : moment(item.created_date).format('hh:mm DD-MM-YYYY')}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
function Conversation(props) {
  const route = useRoute();
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);

  const [showOption, setShowOption] = useState(true);
  const [listMes, setListMes] = useState([]);
  const [message, setMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const flatListRef = useRef();
  const [chosing, setChosing] = useState(false);
  const [imgMessage, setImgMessage] = useState();
  const [isSending, setSending] = useState(false);
  const conversation_id = route.params.id;
  const [visible, setIsVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const navigation = useNavigation();
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [bodyAlert, setBodyAlert] = useState('');
  const showAlert = (title, body) => {
    setBodyAlert(body);
    setVisibleAlert(true);
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ margin: 16 }}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome5 name={'ellipsis-h'} size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  const onViewImage = useCallback((value, uri) => {
    setIsVisible(true);
    setImgMessage(uri);
  });
  const onLoading = useCallback(value => {
    setIsLoading(value);
  });
  const onDelete = useCallback(value => {
    setModalVisible(false);
    setDeleteVisible(true);
  });
  const deleteConversation = async () => {
    ToastAndroid.show('Đang xóa...', 1000);
    setIsLoading(true);
    setDeleteVisible(false);
    await ChatService.deleteConversation(conversation_id)
      .then(res => {
        setIsLoading(true);
        navigation.goBack();
        setTimeout(
          () => ToastAndroid.show('Đã xóa cuộc trò chuyện này.', 1000),
          1000
        );
      })
      .catch(err => {
        console.log(err);
        setIsLoading(false);

        ToastAndroid.show('Xóa thất bại.', 1000);
      });
  };

  const onDeleteCallBack = React.useCallback(async id => {
    let tmp = listMes.filter(i => i.oid !== id);

    setListMes([...tmp]);

    await ChatService.deleteMessageById(id)
      .then(res => setTimeout(() => ToastAndroid.show('Đã xóa', 1000), 1000))
      .catch(err => {
        console.log(err);
        ToastAndroid.show('Xóa thất bại.', 1000);
      });
  });
  //lazy
  const [isEnd, setIsEnd] = useState(false);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const config = {
    headers: { Authorization: `Bearer ${jwtToken}` },
  };
  // useEffect(() => {
  //   flatListRef.current.scrollToEnd({ animated: true, duration: 1000 });
  // }, [message]);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (
        typeof JSON.parse(
          JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
        ).message == 'undefined'
      )
        return;

      const res = JSON.parse(
        JSON.parse(
          JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
        ).message
      );
      console.log(res);
      if (res.sender_id == userInfo.id) return;
      // if (route.params?.callback)
      // if (res.MediaContent == null) {
      //   route.params.callback(res.StringContent, new Date());
      // } else {
      //   route.params.callback('Ảnh', new Date());
      // }
      if (route.params?.callback) {
      }
      if (res.message_type == 1) {
        res.content = [{ image_hash: res.content[0].ImageHash }];
      } else if (res.message_type == 3) {
        res.content.string_contents[0].content =
          res.content.string_contents[0].Content;
      }

      setListMes([res, ...listMes]);
      // const tmp = {
      //   id: '',
      //   sender_id: res.SenderId,
      //   conversation_id: res.ConversationId,
      //   media_content: res.MediaContent
      //     ? { image_hash: res.MediaContent.ImageUrl }
      //     : res.MediaContent,
      //   string_content: res.StringContent,
      //   status: res.Status,
      //   created_date: res.CreatedDate,
      //   modified_date: res.ModifiedDate,
      //   oid: res.OId,
      // };
      //setListMes([tmp, ...listMes]);

      // console.log(
      //   JSON.parse(
      //     JSON.parse(
      //       JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
      //     ).message
      //   )
      // );
    });

    return unsubscribe;
  }, [listMes]);
  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await ChatService.getAllMessage(jwtToken, {
        conversation_id: conversation_id,
        skip: skip,
        count: 15,
      })
        .then(response => {
          response.data.result.forEach(i => (i.sending = false));
          if (isRender) {
            setListMes(response.data.result);
            setIsLoading(false);
            setSkip(skip + 10);
          }
        })
        .catch(err => console.log(err));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

  const sendMessage = async () => {
    Keyboard.dismiss();

    if (message.trim().length < 1) {
      showAlert('Thông báo', 'Bạn chưa nhập tin nhắn..');
      return;
    }
    setSending(true);
    flatList.current.scrollToOffset({ animated: true, offset: 0 });
    const tmp = {
      id: '',
      sender_id: userInfo.id,
      media_content: [],
      content: [message.trim()],
      message_type: 0,
      created_date: new Date(),
      modified_date: new Date(),
      sending: true,
    };
    setMessage('');
    setListMes([tmp, ...listMes]);

    await ChatService.createMessage(jwtToken, {
      conversation_id: conversation_id,
      message: message.trim(),
    })
      .then(response => {
        // setListMes([...listMes, response.data.result]);
        listMes.forEach(i => {
          if (i.sending) is.sending = false;
        });
        if (route.params?.callback) {
          route.params.callback(
            'Bạn: ' + response.data.result.content[0],
            new Date()
          );
        }
        setListMes([
          {
            id: '',
            sender_id: userInfo.id,
            media_content: response.data.result.media_content,
            content: response.data.result.content,
            conversation_id: response.data.result.conversation_id,
            created_date: response.data.result.created_date,
            modified_date: response.data.result.modified_date,
            sending: false,
            message_type: 0,
          },
          ...listMes,
        ]);
        setSending(false);
      })
      .catch(err => {
        console.log(err);
        setSending(false);
      });
  };

  const renderItem = ({ item }) => {
    if (item.sender_id == userInfo.id)
      return (
        <RightMessage
          item={item}
          onViewImage={onViewImage}
          onDelete={onDeleteCallBack}
          onLoading={onLoading}
        />
      );
    else
      return (
        <LeftMessage
          item={item}
          onViewImage={onViewImage}
          avatar={route.params.avatar}
          onLoading={onLoading}
        />
      );
  };

  const pickImage = () => {
    setSending(true);
    if (route.params?.callback) route.params.callback('Bạn: Ảnh', new Date());

    ImagePicker.openPicker({
      width: 800,
      height: 1000,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        const tmp = {
          id: '',
          sender_id: userInfo.id,
          content: [{ image_hash: image.path }],
          message_type: 1,
          created_date: new Date(),
          modified_date: new Date(),
          sending: true,
        };
        setListMes([tmp, ...listMes]);
        ///
        if (image) {
          const uri = image.path;
          const filename = uuidv4();
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          const task = storage()
            .ref(
              'conversation/' +
                conversation_id +
                '/' +
                userInfo.id +
                '/' +
                filename
            )
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
                  await ChatService.createImageMessage(jwtToken, {
                    conversation_id: conversation_id,
                    url: url,
                  })
                    .then(response => {
                      const tmp = {
                        id: '',
                        sender_id: userInfo.id,
                        content: [{ image_hash: image.path }],
                        message_type: 1,
                        created_date: new Date(),
                        modified_date: new Date(),
                        sending: false,
                      };
                      setListMes([tmp, ...listMes]);
                      setSending(false);

                      //setListMes([...listMes, response.data.result]);
                    })
                    .catch(err => console.log(err));
                });
            });
          } catch (e) {
            console.error(e);
            setSending(false);
          }
        }
      }
    });
  };
  const cameraImage = () => {
    setSending(true);
    if (route.params?.callback) route.params.callback('Bạn: Ảnh', new Date());
    ImagePicker.openCamera({
      width: 800,
      height: 1000,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        const tmp = {
          id: '',
          sender_id: userInfo.id,
          content: [{ image_hash: image.path }],
          message_type: 1,
          created_date: new Date(),
          modified_date: new Date(),
          sending: true,
        };
        setListMes([tmp, ...listMes]);
        ///
        if (image) {
          const uri = image.path;
          const filename = uuidv4();
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          const task = storage()
            .ref(
              'conversation/' +
                conversation_id +
                '/' +
                userInfo.id +
                '/' +
                filename
            )
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
                  await ChatService.createImageMessage(jwtToken, {
                    conversation_id: conversation_id,
                    url: url,
                  })
                    .then(response => {
                      const tmp = {
                        id: '',
                        sender_id: userInfo.id,
                        content: [{ image_hash: image.path }],
                        message_type: 1,
                        created_date: new Date(),
                        modified_date: new Date(),
                        sending: false,
                      };
                      setListMes([tmp, ...listMes]);
                      setSending(false);

                      //setListMes([...listMes, response.data.result]);
                    })
                    .catch(err => console.log(err));
                });
            });
          } catch (e) {
            console.error(e);
            setSending(false);
          }
        }
      }
    });
  };
  const fetchData = async () => {
    await ChatService.getAllMessage(jwtToken, {
      conversation_id: conversation_id,
      skip: skip,
      count: 15,
    })
      .then(response => {
        response.data.result.forEach(i => (i.sending = false));
        setListMes([...listMes, ...response.data.result]);
        setSkip(skip + 10);
        setIsEnd(false);
      })
      .catch(err => console.log(err));
  };

  const flatList = React.useRef(null);

  return (
    <View style={styles.largeContainer}>
      <SafeAreaView>
        <FlatList
          ref={flatList}
          style={{ marginBottom: 56 }}
          onEndReached={() => {
            if (isEnd) return;
            if (listMes.length > 14) {
              setIsEnd(true);

              fetchData();
            }
          }}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          data={listMes}
          inverted={-1}
          ListFooterComponent={() =>
            isEnd ? (
              <View style={{ marginVertical: 12 }}>
                <ActivityIndicator size={'large'} color={main_color} />
              </View>
            ) : (
              <View style={{ margin: 4 }}></View>
            )
          }
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
      <View
        style={{ ...styles.containerInput, height: 56, width: deviceWidth }}
      >
        {showOption ? (
          <View style={styles.grOption}>
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
            style={styles.btnInputOption}
            onPress={() => setShowOption(true)}
          >
            <FontAwesome5 name={'angle-right'} size={24} color={main_color} />
          </TouchableOpacity>
        )}
        <TextInput
          multiline={true}
          style={styles.input}
          onTouchEnd={() => setShowOption(false)}
          placeholder="Nhập j đi bạn.."
          value={message}
          onChangeText={text => setMessage(text)}
        />
        {isSending ? (
          <View style={styles.btnInputOption}>
            <FontAwesome5 name={'paper-plane'} size={24} color={'#ccc'} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.btnInputOption}
            onPress={() => {
              sendMessage();
            }}
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
      <ImageView
        images={[{ uri: imgMessage }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
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
      <ChatOptionModal
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
        onDelete={onDelete}
      />
      <Modal
        visible={deleteVisible}
        width={deviceWidth - 56}
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ fontSize: 14, color: main_color }}
              text="Hủy"
              onPress={() => setDeleteVisible(false)}
            />
            <ModalButton
              textStyle={{ fontSize: 14, color: 'red' }}
              text="Xóa"
              onPress={() => {
                deleteConversation();
                setDeleteVisible(false);
              }}
            />
          </ModalFooter>
        }
      >
        <ModalContent>
          <View>
            <Text style={{ fontSize: 16, alignSelf: 'center' }}>
              Bạn muốn xóa hội thoại này?
            </Text>
          </View>
        </ModalContent>
      </Modal>
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

export default Conversation;
// <FlatList
//             inverted={-1}
//             initialScrollIndex={1}
//             showsVerticalScrollIndicator={false}
//             data={list}
//             renderItem={renderItem}
//             keyExtractor={item => item.id}
//           />
