import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  View,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import ChatCard from '../../common/ChatCard';
import navigationConstants from 'constants/navigation';
import { touch_color, main_color } from 'constants/colorCommon';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { setChat } from 'actions/ChatAction';
import ChatService from 'controllers/ChatService';
import UserService from 'controllers/UserService';

function Chat() {
  const userInfo = useSelector(getBasicInfo);
  const jwtToken = useSelector(getJwtToken);
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [listMes, setListMes] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const onCallback = React.useCallback(conversation => {
    let userTemp = listMes.filter(i => i.id === conversation.id)[0];
    let tmp = listMes.filter(i => i.id !== conversation.id);

    setListMes([conversation, ...tmp]);
  });

  const onDeleteCallBack = React.useCallback(async id => {
    let tmp = listMes.filter(i => i.id !== id);
    ToastAndroid.show('Đang xóa...', 1000);
    setListMes([...tmp]);
    await ChatService.deleteConversation(id)
      .then(res =>
        setTimeout(
          () => ToastAndroid.show('Đã xóa cuộc trò chuyện này.', 1000),
          1000
        )
      )
      .catch(err => {
        console.log(err);
        ToastAndroid.show('Xóa thất bại.', 1000);
      });
  });
  const onRefresh = React.useCallback(() => {
    let temp = [];
    setIsLoading(true);
    setRefreshing(true);
    const fetchData1 = async () => {
      await ChatService.getCurrentConversation(jwtToken)
        .then(async res => {
          setIsLoading(false);

          res.data.result.conversations.forEach(async item => {
            if (item.conversation.oid != null && item.messages.length > 0) {
              const obj = {};

              if (item.conversation.participants[0].member_id == userInfo.id) {
                await UserService.getUserById(
                  jwtToken,
                  item.conversation.participants[1].member_id
                ).then(user => {
                  obj.name =
                    user.data.result.first_name +
                    ' ' +
                    user.data.result.last_name;
                  obj.avatar = user.data.result.avatar.image_hash;
                  obj.call_id = user.data.result.call_id;
                });
              } else {
                await UserService.getUserById(
                  jwtToken,
                  item.conversation.participants[0].member_id
                ).then(user => {
                  obj.name =
                    user.data.result.first_name +
                    ' ' +
                    user.data.result.last_name;
                  obj.avatar = user.data.result.avatar.image_hash;
                  obj.call_id = user.data.result.call_id;
                });
              }

              // if (item.messages.sender_id == userInfo.id) {
              //   if (item.messages.media_content == null)
              //     obj.content = 'Bạn: ' + item.messages.string_content;
              //   else obj.content = 'Bạn: Ảnh';
              // } else {
              //   if (item.messages.media_content == null)
              //     obj.content = item.messages.string_content;
              //   else obj.content = 'Ảnh';
              // }
              if (item.messages[0].sender_id == userInfo.id) {
                if (item.messages[0].message_type == 0)
                  obj.content = 'Bạn: ' + item.messages[0].content[0];
                else if (item.messages[0].message_type == 3)
                  obj.content = 'Bạn: Bài đăng';
                else {
                  if (item.messages[0].content[0].media_type == 0)
                    obj.content = 'Bạn: Hình ảnh';
                  else obj.content = 'Bạn: Video';
                }
              } else {
                if (item.messages[0].message_type == 0)
                  obj.content = item.messages[0].content[0];
                else if (item.messages[0].message_type == 3)
                  obj.content = 'Bài đăng';
                else {
                  if (item.messages[0].content[0].media_type == 0)
                    obj.content = 'Hình ảnh';
                  else obj.content = 'Video';
                }
              }
              temp.push({
                name: obj.name,
                modified_date: item.messages[0].modified_date,
                avatar: obj.avatar,
                content:
                  obj.content == null ? 'Bạn chưa nhắn tin' : obj.content,
                id: item.conversation.oid,
                isUnread: false,
                call_id: obj.call_id,
              });
              //console.log('1');

              temp.sort(
                (d1, d2) =>
                  new Date(d2.modified_date) - new Date(d1.modified_date)
              );
              setListMes(temp);
              setRefreshing(false);
            }
          });
          //setListMes([...listMes, ...temp]);
        })
        .catch(err => console.log(err));
    };

    fetchData1();
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(setChat(0));
    });

    return unsubscribe;
  }, [navigation]);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(remoteMessage => {
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
      // test
      //if (listMes.length < 1) return;

      console.log(res);
      //let userTemp = listMes.filter(i => i.id === res.conversation_id)[0];
      let tmp = listMes.filter(i => i.id !== res.conversation_id);

      // setListMes([
      //   {
      //     name: userTemp.name,
      //     modified_date: res.CreatedDate,
      //     avatar: userTemp.avatar,
      //     content: res.MediaContent == null ? res.StringContent : 'Ảnh',
      //     id: userTemp.id,
      //     isUnread: true,
      //   },
      //   ...tmp,
      // ]);
      if (res.sender_id == userInfo.id) {
        // setListMes([
        //   {
        //     name: res.receiver_name,
        //     modified_date: res.created_date,
        //     avatar: res.receiver_avatar,
        //     content:
        //      res.message_type == 3
        //         ? 'Bạn: Bài đăng'
        //         : res.message_type == 1
        //         ? 'Bạn: Ảnh'
        //         : 'Bạn: ' + res.content,
        //     id: res.conversation_id,
        //     isUnread: false,
        //   },
        //   ...tmp,
        // ]);
        onRefresh();
      } else {
        let text = '';
        if (res.message_type == 1) {
          if (res.content[0].MediaType == 0) text = 'Ảnh';
          else text = 'Video';
        }
        setListMes([
          {
            name: res.sender_name,
            modified_date: res.created_date,
            avatar: res.sender_avatar,
            content:
              res.message_type == 3
                ? 'Bài đăng'
                : res.message_type == 1
                ? text
                : res.content,
            id: res.conversation_id,
            isUnread: true,
          },
          ...tmp,
        ]);
        if (res.message_type != 3 && res.message_type != 1) {
          if (res.content == 'Cuộc gọi video.') return;
        }
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Bạn có tin nhắn mới từ ' + res.sender_name,
          visibilityTime: 2000,
        });
      }
      ///
    });

    return unsubscribe;
  }, [listMes]);
  useEffect(() => {
    setIsLoading(true);

    let isRender = true;
    let temp = [];
    const fetch = async () => {
      await ChatService.getCurrentConversation(jwtToken)
        .then(async res => {
          setIsLoading(false);

          res.data.result.conversations.forEach(async item => {
            if (item.conversation.oid != null && item.messages.length > 0) {
              const obj = {};
              if (item.conversation.participants[0].member_id == userInfo.id) {
                await UserService.getUserById(
                  jwtToken,
                  item.conversation.participants[1].member_id
                ).then(user => {
                  obj.name =
                    user.data.result.first_name +
                    ' ' +
                    user.data.result.last_name;
                  obj.avatar = user.data.result.avatar.image_hash;
                  obj.call_id = user.data.result.call_id;
                });
              } else {
                await UserService.getUserById(
                  jwtToken,
                  item.conversation.participants[0].member_id
                ).then(user => {
                  obj.name =
                    user.data.result.first_name +
                    ' ' +
                    user.data.result.last_name;
                  obj.avatar = user.data.result.avatar.image_hash;
                  obj.call_id = user.data.result.call_id;
                });
              }

              if (item.messages[0].sender_id == userInfo.id) {
                if (item.messages[0].message_type == 0)
                  obj.content = 'Bạn: ' + item.messages[0].content[0];
                else if (item.messages[0].message_type == 3)
                  obj.content = 'Bạn: Bài đăng';
                else {
                  if (item.messages[0].content[0].media_type == 0)
                    obj.content = 'Bạn: Hình ảnh';
                  else obj.content = 'Bạn: Video';
                }
              } else {
                if (item.messages[0].message_type == 0)
                  obj.content = item.messages[0].content[0];
                else if (item.messages[0].message_type == 3)
                  obj.content = 'Bài đăng';
                else {
                  if (item.messages[0].content[0].media_type == 0)
                    obj.content = 'Hình ảnh';
                  else obj.content = 'Video';
                }
              }
              temp.push({
                name: obj.name,
                modified_date: item.messages[0].modified_date,
                avatar: obj.avatar,
                content:
                  obj.content == null ? 'Bạn chưa nhắn tin' : obj.content,
                id: item.conversation.oid,
                isUnread: false,
                call_id: obj.call_id,
              });
              //console.log('1');
              if (isRender) {
                temp.sort(
                  (d1, d2) =>
                    new Date(d2.modified_date) - new Date(d1.modified_date)
                );
                setListMes(temp);
              }
            }
          });
          //setListMes([...listMes, ...temp]);
        })
        .catch(err => console.log(err));
    };
    fetch();
    return () => {
      isRender = false;
    };
  }, []);
  function isClose() {
    setModalVisible(true);
  }
  function callbackVisibleModal(isVisible) {
    setModalVisible(false);
  }
  const GoToConversation = id => {
    navigation.navigate(navigationConstants.conversation, { id: id });
  };

  const renderItem = ({ item }) => {
    return (
      <ChatCard
        chat={item}
        onCallback={onCallback}
        onDelete={onDeleteCallBack}
      />
    );
  };
  return (
    <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
      {listMes.length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={listMes}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              colors={[main_color]}
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            onRefresh();
            setIsLoading(true);
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 16,
              color: '#616161',
              marginBottom: deviceHeight / 2,
            }}
          >
            Bạn chưa có tin nhắn nào, nhấn để làm mới.
          </Text>
        </TouchableOpacity>
      )}
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
    </View>
  );
}
export default Chat;
