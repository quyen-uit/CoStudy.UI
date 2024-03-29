import React, { useState } from 'react';
import { Text, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { main_color } from 'constants/colorCommon';
// import Modal from 'react-native-modal';
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import styles from './styles';
import navigationConstants from 'constants/navigation';
import { useNavigation } from '@react-navigation/core';
import ChatService from 'controllers/ChatService';
import { useSelector } from 'react-redux';
import { getJwtToken } from 'selectors/UserSelectors';

// const chat = {
//   title: 'Đây là title',
//   author: 'Nguyễn Văn Nam',
//   latestChat: 'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
//   latestTime: '10 phut truoc',
// }
function ChatOptionModal({ ...rest }) {
  const navigation = useNavigation();
  const jwtToken = useSelector(getJwtToken);
  return (
    <BottomModal
      {...rest}
      swipeDirection={['down']} // can be string or an array
      swipeThreshold={100} // default 100
      useNativeDriver={true}
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
      <ModalContent style={styles.content}>
        <TouchableHighlight
          underlayColor={'#000'}
          onPress={ () => {
            rest.onVisible(false);
            ChatService.createMessage(jwtToken, {
              conversation_id: rest.conversationId,
              message: 'Cuộc gọi video.',
            })
              .then(res => {
                console.log('call success');
              })
              .catch(err => console.log(err));
            navigation.navigate(navigationConstants.video, {
              opponent_id: rest.callId,
              opponent_name: rest.name,
              isCalling: false,
            });
          }}
        >
          <View style={styles.optionContainer}>
            <Icon
              name={'phone'}
              color={main_color}
              size={24}
              style={{ marginHorizontal: 5 }}
            />
            <Text style={styles.txtOption}>Gọi video</Text>
          </View>
        </TouchableHighlight>

        {/* <TouchableHighlight underlayColor={'#000'} onPress={() => alert('a')}>
          <View style={styles.optionContainer}>
            <Icon name={'eye'} color={main_color} size={24} />
            <Text style={styles.txtOption}>Đánh dấu chưa đọc</Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight underlayColor={'#000'} onPress={() => rest.onDelete(true)}>
          <View style={styles.optionContainer}>
            <Icon
              name={'times'}
              color={main_color}
              size={24}
              style={{ marginHorizontal: 5 }}
            />
            <Text style={styles.txtOption}>Xóa hội thoại</Text>
          </View>
        </TouchableHighlight> */}
        <TouchableHighlight
          underlayColor={'#000'}
          onPress={() => {
            rest.onVisible(false);
          }}
        >
          <View style={styles.optionContainer}>
            <Icon
              name={'flag'}
              color={main_color}
              size={24}
              style={{ marginHorizontal: 2 }}
            />
            <Text style={styles.txtOption}>  Báo cáo</Text>
          </View>
        </TouchableHighlight>
      </ModalContent>
    </BottomModal>
  );
}

export default ChatOptionModal;
