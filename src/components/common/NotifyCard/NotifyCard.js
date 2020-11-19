import React from 'react';
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

function NotifyCard(props) {
  const notify = props.notify;
  return (
    <Card containerStyle={styles.container}>
      <TouchableHighlight
        style={styles.btnCard}
        onPress={() => alert('click')}
        underlayColor={touch_color}
      >
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity onPress={() => alert('avatar is clicked')}>
              <Image
                style={styles.imgAvatar}
                source={require('../../../assets/avatar.jpeg')}
              />
            </TouchableOpacity>
            <View>
              <View style={styles.row}>
                <Text style={styles.txtAuthor}>{notify.author}</Text>
                <Text> đã theo dõi bạn</Text>
              </View>
              <Text style={styles.txtCreateDate}>{notify.createdDate}</Text>
            </View>
          </View>

          <View style={styles.btnCancel}>
            <FontAwesome name={'times'} size={16} color={active_color} />
          </View>
        </View>
      </TouchableHighlight>
    </Card>
  );
}

export default NotifyCard;
