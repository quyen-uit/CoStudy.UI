import React, { useState } from 'react';
import { ToastAndroid, Text, View, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { main_color } from 'constants/colorCommon';
import { api } from 'constants/route';
import { getAPI } from '../../../apis/instance';
import { getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
// import Modal from 'react-native-modal';
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import styles from './styles';

// const chat = {
//   title: 'Đây là title',
//   author: 'Nguyễn Văn Nam',
//   latestChat: 'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
//   latestTime: '10 phut truoc',
// }
const PostOptionModal = ({ ...rest }) => {
  const curUser = useSelector(getUser);
  const [saved, setSaved] = useState(rest.saved);
  const [isSaving, setIsSaving] = useState(false);

  const onSaved = async () => {
    rest.onVisible(false);
    setIsSaving(true);
    if (saved) {
      await getAPI(curUser.jwtToken)
        .post(api + 'Post/post/save/' + rest.id, { id: rest.id })
        .then(response => {
          setSaved(false);
          setIsSaving(false);

          ToastAndroid.show('Đã hủy lưu thành công', ToastAndroid.SHORT);
        })
        .catch(err => {
          ToastAndroid.show('Có lỗi xảy ra..', ToastAndroid.SHORT);
          setIsSaving(false);
        });
    } else {
      await getAPI(curUser.jwtToken)
        .post(api + 'Post/post/save/' + rest.id, { id: rest.id })
        .then(response => {
          ToastAndroid.show('Đã lưu thành công', ToastAndroid.SHORT);
          setIsSaving(false);

          setSaved(true);
        })
        .catch(err => {
          ToastAndroid.show('Có lỗi xảy ra..', ToastAndroid.SHORT);
          setIsSaving(false);
        });
    }
  };
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
        <TouchableHighlight underlayColor={'#000'} onPress={() => alert('a')}>
          <View style={styles.optionContainer}>
            <Icon
              name={'times'}
              color={main_color}
              size={24}
              style={{ marginHorizontal: 5 }}
            />
            <Text style={styles.txtOption}>Ẩn bài viết này</Text>
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
            <Icon name={'eye'} color={saved ? main_color : '#ccc'} size={24} />
            <Text style={styles.txtOption}>
              {saved
                ? 'Xóa khỏi danh sách quan tâm'
                : 'Thêm vào danh sách quan tâm'}
            </Text>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          underlayColor={'#000'}
          onPress={() => {
            ToastAndroid.show('Đã báo cáo', ToastAndroid.SHORT);
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
    </BottomModal>
  );
};

export default PostOptionModal;
