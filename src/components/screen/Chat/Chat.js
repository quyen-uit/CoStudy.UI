import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  Text,
  View,
  FlatList,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styles from 'components/screen/Chat/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import ChatCard from '../../common/ChatCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import { touch_color } from 'constants/colorCommon';
import { api } from 'constants/route';
import moment from 'moment';
import { getAPI } from '../../../apis/instance';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { actionTypes, increaseChat, setChat } from 'actions/ChatAction';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function Chat() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [listMes, setListMes] = useState([]);
  const curUser = useSelector(getUser);
  const onCallback = React.useCallback(conversation => {
    let userTemp = listMes.filter(i => i.id === conversation.id)[0];
    let tmp = listMes.filter(i => i.id !== conversation.id);

    setListMes([conversation, ...tmp]);
  });
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

      // console.log(res);
      let userTemp = listMes.filter(i => i.id === res.ConversationId)[0];
      let tmp = listMes.filter(i => i.id !== res.ConversationId);

      setListMes([
        {
          name: userTemp.name,
          modified_date: res.CreatedDate,
          avatar: userTemp.avatar,
          content: res.MediaContent == null ? res.StringContent : 'Ảnh',
          id: userTemp.id,
          isUnread: true,
        },
        ...tmp,
      ]);
      if (res.SenderId == curUser.oid) return;
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Bạn có tin nhắn mới từ ' + userTemp.name,
        visibilityTime: 2000,
      });
      ///
    });

    return unsubscribe;
  }, [listMes]);
  useEffect(() => {
    let isRender = true;
    let temp = [];
    const fetch = async () => {
      await getAPI(curUser.jwtToken)
        .get(api + 'Message/conversation/current')
        .then(async res => {
          res.data.result.conversations.forEach(async item => {
            if (item.item2.conversation_id != null) {
              const obj = {};

              if (item.item1.participants[0] == curUser.oid) {
                await getAPI(curUser.jwtToken)
                  .get(api + 'User/get/' + item.item1.participants[1])
                  .then(user => {
                    obj.name =
                      user.data.result.first_name +
                      ' ' +
                      user.data.result.last_name;
                    obj.avatar = user.data.result.avatar.image_hash;
                  });
              } else {
                await getAPI(curUser.jwtToken)
                  .get(api + 'User/get/' + item.item1.participants[0])
                  .then(user => {
                    obj.name =
                      user.data.result.first_name +
                      ' ' +
                      user.data.result.last_name;
                    obj.avatar = user.data.result.avatar.image_hash;
                  });
              }

              if (item.item2.sender_id == curUser.oid) {
                if (item.item2.media_content == null)
                  obj.content = 'Bạn: ' + item.item2.string_content;
                else obj.content = 'Bạn: Ảnh';
              } else {
                if (item.item2.media_content == null)
                  obj.content = item.item2.string_content;
                else obj.content = 'Ảnh';
              }
              temp.push({
                name: obj.name,
                modified_date: item.item2.modified_date,
                avatar: obj.avatar,
                content:
                  obj.content == null ? 'Bạn chưa nhắn tin' : obj.content,
                id: item.item2.conversation_id,
                isUnread: false,
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
        .catch(err => alert(err));
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
    return <ChatCard chat={item} onCallback={onCallback} />;
  };
  return (
    <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={listMes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
export default Chat;

// <BottomModal
//         visible={modalVisible}
//         swipeDirection={['up', 'down']} // can be string or an array
//         swipeThreshold={100} // default 100
//         useNativeDriver={true}
//         modalTitle={<Icon name={'chevron-down'} color={main_color} size={16} style={{alignSelf: 'center', marginTop: 2}}/>}

//         modalAnimation={
//           new SlideAnimation({
//             initialValue: 0, // optional
//             slideFrom: 'bottom', // optional
//             useNativeDriver: true, // optional
//           })
//         }
//         useNativeDriver={true}
//         onSwipeOut={event => {
//           setModalVisible(false);
//         }}
//         onTouchOutside={() => setModalVisible(false)}
//       >
//         <ModalContent style={{ marginHorizontal: -16 }}>
//           <TouchableHighlight underlayColor={'#000'} onPress={()=>alert('a')}>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               paddingVertical: 12,
//               backgroundColor: '#fff',
//             }}
//           >
//             <Icon
//               style={{ marginHorizontal: 12 }}
//               name={'home'}
//               color={main_color}
//               size={24}
//             />
//             <Text style={{ fontSize: 16 }}>Xóa hội thoại</Text>
//           </View>
//           </TouchableHighlight>
//           <TouchableHighlight
//             underlayColor={'#000'}
//             onPress={() => alert('a')}
//           >
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',

//                 paddingVertical: 12,
//                 backgroundColor: '#fff',
//               }}
//             >
//               <Icon
//                 style={{ marginHorizontal: 12 }}
//                 name={'home'}
//                 color={main_color}
//                 size={24}
//               />
//               <Text style={{ fontSize: 16 }}>Đánh dấu chưa đọc</Text>
//             </View>
//           </TouchableHighlight>
//           <TouchableHighlight
//             underlayColor={'#000'}
//             onPress={() => {
//               setModalVisible(false);
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',

//                 paddingVertical: 12,
//                 backgroundColor: '#fff',
//               }}
//             >
//               <Icon
//                 style={{ marginHorizontal: 12 }}
//                 name={'home'}
//                 color={main_color}
//                 size={24}
//               />
//               <Text style={{ fontSize: 16 }}>Báo cáo</Text>
//             </View>
//           </TouchableHighlight>
//         </ModalContent>
//       </BottomModal>
