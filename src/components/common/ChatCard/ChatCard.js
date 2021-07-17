import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import styles from 'components/common/ChatCard/styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  main_color,
  active_color,
  touch_color,
  main_2nd_color,
} from '../../../constants/colorCommon';
import { useNavigation } from '@react-navigation/native';
import navigationConstants from 'constants/navigation';
import moment from 'moment';
import { Card } from 'react-native-elements';
import ChatOptionModal from 'components/modal/ChatOptionModal/ChatOptionModal';
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
// const chat = {
//   title: 'Đây là title',
//   author: 'Nguyễn Văn Nam',
//   latestChat: 'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
//   latestTime: '10 phut truoc',
// }
function ChatCard(props) {
  const navigation = useNavigation();
  const chat = props.chat;
  const [content, setContent] = React.useState(chat.content);
  const [date, setDate] = React.useState(props.chat.modified_date);
  const [modalVisible, setModalVisible] = useState(false);
  const [isUnread, setIsUnread] = useState(props.chat.isUnread);
  const [visible, setVisible] = useState(false);
  const onDelete = React.useCallback(value => {
    setVisible(true);
  });

  const onCallback = React.useCallback((value, date) => {
  //   setContent(value);
  //   setDate(date);
  //   props.onCallback({
  //     name: chat.name,
  //     modified_date: date,
  //     avatar: chat.avatar,
  //     content: [value],
  //     id: chat.id,
  //     isUnread: false,
  //   });
  });
  const onVisible = React.useCallback((value ) => {
    setModalVisible(value);
  });
  useEffect(() => {
    setContent(chat.content);
    setDate(chat.modified_date);
    setIsUnread(chat.isUnread);
  }, [chat.content, chat.modified_date]);
  const GoToConversation = () => {
    setIsUnread(false);
    navigation.navigate(navigationConstants.conversation, {
      id: chat.id,
      callback: onCallback,
      avatar: chat.avatar,
      name: chat.name,
      callId: chat.call_id
    });
  };
  return (
    <View
      style={{
        padding: -8,
        marginTop: 8,
        marginHorizontal: 8,
        borderRadius: 8,
        borderWidth: 0.5, // Remove Border
        elevation: 0,
        backgroundColor: isUnread ? '#ccc' : '#fff',
        borderColor: main_color,
        opacity: isUnread ? 0.5 : 1,
      }}
    >
      <TouchableHighlight
        onPress={() => GoToConversation()}
        onLongPress={() => setModalVisible(true)}
        underlayColor={touch_color}
        style={{ padding: 6, borderRadius: 8 }}
      >
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity>
              <Image style={styles.imgAvatar} source={{ uri: chat.avatar }} />
            </TouchableOpacity>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.txtAuthor}>{chat.name}</Text>
              <Text style={styles.txtContent} numberOfLines={1}>
                {content.length < 20
                  ? `${content}`
                  : `${content.substring(
                      0,
                      20
                    )}...`}
              </Text>
            </View>
          </View>

          <View style={styles.headerTime}>
            <View style={styles.headerAuthor}>
              <Text style={styles.txtCreateDate}>
                {' '}
                {moment(new Date()).diff(moment(date), 'minutes') < 60
                  ? moment(new Date()).diff(moment(date), 'minutes') +
                    ' phút trước'
                  : moment(new Date()).diff(moment(date), 'hours') < 24
                  ? moment(new Date()).diff(moment(date), 'hours') +
                    ' giờ trước'
                  : moment(date).format('hh:mm DD-MM-YYYY')}
              </Text>
              <FontAwesome name={'circle'} size={8} color={active_color} />
            </View>
          </View>
        </View>
      </TouchableHighlight>

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
        onVisible={onVisible}
        callId={chat.call_id}
        name={chat.name}
        conversationId={chat.id}
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
                //props.onDelete(chat.id);
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
    </View>
  );
}

export default ChatCard;
