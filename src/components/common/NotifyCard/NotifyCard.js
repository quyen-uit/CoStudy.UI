import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import styles from 'components/common/NotifyCard/styles';
import { Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  active_color,
  main_color,
  touch_color,
} from '../../../constants/colorCommon';
import NotifyOptionModal from 'components/modal/NotifyOptionModal/NotifyOptionModal';
 
import moment from 'moment';
 
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function NotifyCard(props) {
  const notify = props.notify;
  const [modalVisible, setModalVisible] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isUnread, setIsUnread] = useState(props.notify.isUnread);
  React.useEffect(() => {
 
    setIsUnread(notify.isUnread);
  }, [notify.oid]);
   return (
    <Card containerStyle={styles.container}>
      <TouchableHighlight
        style={styles.btnCard}
        onPress={() => setIsUnread(false)}
        onLongPress={() => {
          setModalVisible(true);
        }}
        underlayColor={touch_color}
      >
        <View
          style={{
            flexDirection: 'row',
            padding: 8,
            borderRadius: 8,
            backgroundColor: isUnread ? '#ccc' : '#fff',
            opacity: isUnread ? 0.8 : 1,
          }}
        >
          <View style={styles.headerAvatar}>
            <TouchableOpacity>
              <Image
                style={styles.imgAvatar}
                source={{ uri: notify.author_avatar }}
              />
            </TouchableOpacity>
            <View style={{ flexShrink: 1 }}>
              <Text>{notify.content}</Text>

              <Text style={styles.txtCreateDate}>
                {moment(new Date()).diff(
                  moment(notify.created_date),
                  'minutes'
                ) < 60
                  ? moment(new Date()).diff(
                      moment(notify.created_date),
                      'minutes'
                    ) + ' phút trước'
                  : moment(new Date()).diff(
                      moment(notify.created_date),
                      'hours'
                    ) < 24
                  ? moment(new Date()).diff(
                      moment(notify.created_date),
                      'hours'
                    ) + ' giờ trước'
                  : moment(notify.created_date).format('hh:mm DD-MM-YYYY')}
              </Text>
            </View>
          </View>

          <View style={styles.btnCancel}>
            <TouchableOpacity onPress={() => setVisible(true)}>
              <FontAwesome name={'times'} size={16} color={active_color} />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableHighlight>
      <NotifyOptionModal
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
                props.onDelete(notify.oid);
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
    </Card>
  );
}

export default NotifyCard;
