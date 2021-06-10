import React, { useState, useEffect } from 'react';
import {
  ToastAndroid,
  Text,
  View,
  TouchableHighlight,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { main_color } from 'constants/colorCommon';
import { getJwtToken, getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
// import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native';
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import styles from './styles';
import PostService from 'controllers/PostService';
import navigationConstants from 'constants/navigation';
import ChatService from 'controllers/ChatService';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
// const chat = {
//   title: 'Đây là title',
//   author: 'Nguyễn Văn Nam',
//   latestChat: 'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
//   latestTime: '10 phut truoc',
// }
const list = [
  {
    name: 'Nguyễn Văn A',
  },
  {
    name: 'Nguyen Le diem kieu',
  },
  {
    name: 'Dang Van B',
  },
];
const PostOptionModal = ({ ...rest }) => {
  const curUser = useSelector(getUser);
  const jwtToken = useSelector(getJwtToken);
  const [saved, setSaved] = useState(
    typeof rest.saved == 'undefined' ? null : rest.saved
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isMe, setIsMe] = useState(false);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  const [modalOrder, setModalOrder] = useState(1);
  useEffect(() => {
     if (rest.id != null) {
      PostService.getPostById(curUser.jwtToken, rest.id)
        .then(res => {
          if (res.data.result.author_id == curUser.oid) setIsMe(true); else setIsMe(false);
        })
        .catch(err => console.log(err));
    }
    return () => {};
  }, [rest.id,isMe]);

  useEffect(() => {
    setList([]);
    const fetch = async () => {
      await ChatService.getCurrentConversation(jwtToken).then(res => {
        res.data.result.conversations.forEach(item => {
          let tmp = { conversationId: '', name: '', avatar: '' };

          tmp.conversationId = item.conversation.oid;
          if (item.conversation.participants[0].member_id == curUser.oid) {
            tmp.name = item.conversation.participants[1].member_name;
            tmp.avatar = item.conversation.participants[1].member_avatar;
          } else {
            tmp.name = item.conversation.participants[0].member_name;
            tmp.avatar = item.conversation.participants[0].member_avatar;
          }

          setList([...list, tmp]);
        });
        setIsLoading(false);
        // name, conversation_id, avatar,
      });
    };
    fetch();
    return () => {};
  }, []);
  const onShare = async id => {
    rest.onVisible(false);
    setModalOrder(1);
    await ChatService.createPostMessage(jwtToken, {
      conversation_id: id,
      post_id: rest.id,
    })
      .then(res => {
        ToastAndroid.show('Chia sẻ thành công', ToastAndroid.SHORT);
      })
      .catch(err => console.log(err));
  };

  // const fetch = async () => {
  //   await ChatService.getCurrentConversation(jwtToken).then(res => {
  //     res.data.result.conversations.forEach(item => {
  //       let tmp = {};
  //       tmp.conversationId = item.conversation.oid;
  //       if (item.conversation.participants[0].member_id == curUser.oid) {
  //         tmp.name = item.conversation.participants[1].member_name;
  //         tmp.avatar = item.conversation.participants[1].member_avatar;
  //       } else {
  //         tmp.name = item.conversation.participants[0].member_name;
  //         tmp.avatar = item.conversation.participants[0].member_avatar;
  //       }
  //     });
  //     setList([...list, tmp]);
  //     // name, conversation_id, avatar,
  //   });
  // };

  const onSaved = async () => {
    rest.onVisible(false);
    setIsSaving(true);
    // if (saved) {
      await PostService.savePost(curUser.jwtToken, rest.id)
        .then(response => {
          if (response.data.result.is_save) {
            ToastAndroid.show('Đã lưu thành công', ToastAndroid.SHORT);
            setIsSaving(false);
            setSaved(true);
          } else {
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
    //   await PostService.savePost(curUser.jwtToken, rest.id)
    //     .then(response => {
    //       if (response.data.result.is_save) {
    //         ToastAndroid.show('Đã lưu thành công', ToastAndroid.SHORT);
    //         setIsSaving(false);
    //         setSaved(true);
    //       } else {
    //         setSaved(false);
    //         setIsSaving(false);
    //         ToastAndroid.show('Đã hủy lưu thành công', ToastAndroid.SHORT);
    //       }
    //     })
    //     .catch(err => {
    //       ToastAndroid.show('Có lỗi xảy ra..', ToastAndroid.SHORT);
    //       setIsSaving(false);
    //     });
    // }
  };
  const renderItem = item => {
    return (
      <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 8,
              }}
              //source={{ uri: item.avatar }}
              source={{ uri: item.avatar }}
            />
            <Text>{item.name}</Text>
          </View>
          <TouchableOpacity
            onPress={async () => await onShare(item.conversationId)}
            style={{
              padding: 4,
              backgroundColor: main_color,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: '#fff', marginHorizontal: 4 }}>Chia sẻ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <BottomModal
      {...rest}
      swipeDirection={['down']} // can be string or an array
      swipeThreshold={100} // default 100
      useNativeDriver={true}
      onSwipeOut={event => {
        rest.onVisible(false);
        setModalOrder(1);
      }}
      onHardwareBackPress={() => {
        rest.onVisible(false);
        setModalOrder(1);
        return true;
      }}
      onTouchOutside={() => {
        rest.onVisible(false);
        setModalOrder(1);
      }}
      modalAnimation={
        new SlideAnimation({
          slideFrom: 'bottom',
        })
      }
      modalTitle={
        <Icon
          name={'chevron-down'}
          color={main_color}
          size={16}
          style={styles.headerIcon}
        />
      }
      modalAnimation={
        new SlideAnimation({
          initialValue: 0, // optional
          slideFrom: 'bottom', // optional
          useNativeDriver: true, // optional
        })
      }
    >
      {modalOrder == 1 ? (
        <ModalContent style={styles.content}>
          <TouchableHighlight
            underlayColor={'#000'}
            onPress={async () => setModalOrder(2)}
          >
            <View style={styles.optionContainer}>
              <Icon
                name={'share'}
                color={main_color}
                size={24}
                style={{ marginHorizontal: 5 }}
              />
              <Text style={styles.txtOption}>Chia sẻ bài viết cho...</Text>
            </View>
          </TouchableHighlight>
            <TouchableHighlight
              underlayColor={'#000'}
              onPress={() => {
                if (isSaving == false) onSaved();
                else ToastAndroid.show('Đang xử lý..', ToastAndroid.SHORT);
              }}
            >
              <View style={styles.optionContainer}>
                <Icon
                  name={'eye'}
                  color={saved ? main_color : '#ccc'}
                  size={24}
                />
                <Text style={styles.txtOption}>
                  {saved
                    ? 'Xóa khỏi danh sách quan tâm'
                    : 'Thêm vào danh sách quan tâm'}
                </Text>
              </View>
            </TouchableHighlight>
          {isMe ? (
            <TouchableHighlight
              underlayColor={'#000'}
              onPress={() => {
                rest.onVisible(false);
                navigation.navigate(navigationConstants.create, {
                  postId: rest.id,
                  isEdit: true,
                });
              }}
            >
              <View style={styles.optionContainer}>
                <Icon
                  name={'edit'}
                  color={main_color}
                  size={24}
                  style={{ marginHorizontal: 2 }}
                />
                <Text style={styles.txtOption}>Sửa bài viết</Text>
              </View>
            </TouchableHighlight>
          ) : null}
          <TouchableHighlight
            underlayColor={'#000'}
            onPress={() => {
              rest.onVisible(false);
              navigation.navigate(navigationConstants.report, {
                postId: rest.id,
              });
            }}
          >
            <View style={styles.optionContainer}>
              <Icon
                name={'flag'}
                color={main_color}
                size={24}
                style={{ marginHorizontal: 2 }}
              />
              <Text style={styles.txtOption}>Báo cáo</Text>
            </View>
          </TouchableHighlight>
        </ModalContent>
      ) : (
        <ModalContent style={styles.content}>
          <View>
            <FlatList
              style={{ height: deviceHeight / 2 - 80 }}
              showsVerticalScrollIndicator={false}
              data={list}
              renderItem={({ item, index, separators }) => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={() => (
                <View>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      color: main_color,
                    }}
                  >
                    Chia sẻ cho...
                  </Text>
                </View>
              )}
              ListHeaderComponentStyle={{ alignItems: 'center' }}
            />
          </View>
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
        </ModalContent>
      )}
    </BottomModal>
  );
};

export default PostOptionModal;
