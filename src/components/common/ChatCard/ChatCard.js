import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
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
  console.log(props.chat);
  const onCallback = React.useCallback((value, date) => {
    setContent(value);
    setDate(date);
    props.onCallback({
      name: chat.name,
      modified_date: date,
      avatar: chat.avatar,
      content: value,
      id: chat.id,
      isUnread: false,
    });
  });
  useEffect(() => {
    setContent(chat.content);
    setDate(chat.modified_date);
    setIsUnread(chat.isUnread)
  }, [chat.content, chat.modified_date]);
  const GoToConversation = () => {
    setIsUnread(false);
    navigation.navigate(navigationConstants.conversation, {
      id: chat.id,
      callback: onCallback,
      avatar: chat.avatar,
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
        backgroundColor: isUnread ? main_color : '#fff',
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
            <TouchableOpacity onPress={() => alert('avatar is clicked')}>
              <Image style={styles.imgAvatar} source={{ uri: chat.avatar }} />
            </TouchableOpacity>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.txtAuthor}>{chat.name}</Text>
              <Text style={styles.txtContent}>{content}</Text>
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
      />
    </View>
  );
}

export default ChatCard;
