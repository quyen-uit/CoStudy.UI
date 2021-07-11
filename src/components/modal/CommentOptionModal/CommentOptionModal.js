import React, { useEffect, useState } from 'react';
import { useTheme, useRoute, useNavigation } from '@react-navigation/native';
import {
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { main_color } from 'constants/colorCommon';
// import Modal from 'react-native-modal';
import Modal, {
  ModalContent,
  BottomModal,
  ModalFooter,
  ModalButton,
  SlideAnimation,
} from 'react-native-modals';
import styles from './styles';
import navigationConstants from 'constants/navigation';
import { useSelector } from 'react-redux';
import { getUser } from 'selectors/UserSelectors';
import CommentService from 'controllers/CommentService';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
// const chat = {
//   title: 'Đây là title',
//   author: 'Nguyễn Văn Nam',
//   latestChat: 'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
//   latestTime: '10 phut truoc',
// }
function CommentOptionModal({ ...rest }) {
  const curUser = useSelector(getUser);
  const [visibleDelete, setVisibleDelete] = useState(false);
  const [isMe, setIsMe] = useState(false);
  useEffect(() => {
    if (rest.id != null) {
      CommentService.getCommentById(curUser.jwtToken, rest.id)
        .then(res => {
          if (res.data.code == 404) {
            rest.onNotExist(rest.id);
            ToastAndroid.show('Bình luận không tồn tại.', 1000);
          } else {
            if (res.data.result.author_id == curUser.oid) setIsMe(true);
          }
        })
        .catch(err => console.log(err));
    }
    return () => {};
  }, [rest.id]);
  const onEdit = () => {
    rest.onVisible(false);
    rest.onEdit(true, rest.id);
  };
  const navigation = useNavigation();
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
        {/* <TouchableHighlight underlayColor={'#000'} onPress={() => alert('a')}>
          <View style={styles.optionContainer}>
            <Icon
              name={'reply'}
              color={main_color}
              size={24}
              style={{ marginHorizontal: 5 }}
            />
            <Text style={styles.txtOption}>Trả lời</Text>
          </View>
        </TouchableHighlight> */}
        {isMe ? (
          <View>
            <TouchableHighlight underlayColor={'#000'} onPress={() => onEdit()}>
              <View style={styles.optionContainer}>
                <Icon name={'edit'} color={main_color} size={24} />
                <Text style={styles.txtOption}>Sửa bình luận</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              underlayColor={'#000'}
              onPress={() => setVisibleDelete(true)}
            >
              <View style={styles.optionContainer}>
                <Icon name={'times'} color={main_color} size={24} />
                <Text style={styles.txtOption}>Xóa bình luận</Text>
              </View>
            </TouchableHighlight>
          </View>
        ) : null}
        <TouchableHighlight
          underlayColor={'#000'}
          onPress={() => {
            rest.onVisible(false);
            navigation.navigate(navigationConstants.report, {
              commentId: rest.id,
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
      <Modal
        visible={visibleDelete}
        width={deviceWidth - 56}
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ fontSize: 14, color: main_color }}
              text="Hủy"
              onPress={() => {
                setVisibleDelete(false);
                rest.onVisible(false);
              }}
            />
            <ModalButton
              textStyle={{ fontSize: 14, color: 'red' }}
              text="Xóa"
              onPress={() => {
                setVisibleDelete(false);
                rest.onVisible(false);
                rest.onDelete(rest.id);
              }}
            />
          </ModalFooter>
        }
      >
        <ModalContent>
          <View>
            <Text style={{ fontSize: 16, alignSelf: 'center' }}>
              Bạn muốn xóa bình luận này?
            </Text>
          </View>
        </ModalContent>
      </Modal>
    </BottomModal>
  );
}

export default CommentOptionModal;
