import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
} from 'react-native';
import styles from 'components/common/NotifyCard/styles';
import { Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { active_color, touch_color } from '../../../constants/colorCommon';
import NotifyOptionModal from 'components/modal/NotifyOptionModal/NotifyOptionModal';
import { useNavigation } from '@react-navigation/native';
import { api } from 'constants/route';
import moment from 'moment';
import { getAPI } from '../../../apis/instance';
import messaging from '@react-native-firebase/messaging';

function NotifyCard(props) {
  const notify = props.notify;
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Card containerStyle={styles.container}>
      <TouchableHighlight
        style={styles.btnCard}
        onPress={() => setModalVisible(true)}
        underlayColor={touch_color}
      >
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity onPress={() => alert('avatar is clicked')}>
              <Image
                style={styles.imgAvatar}
                source={{ uri: notify.author_avatar }}
              />
            </TouchableOpacity>
            <View style={{flexShrink: 1}}>
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
            <FontAwesome name={'times'} size={16} color={active_color} />
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
    </Card>
  );
}

export default NotifyCard;
