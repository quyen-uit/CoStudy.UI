import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
} from 'react-native';
import styles from 'components/common/ChatCard/styles';
import { Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { active_color, touch_color } from '../../../constants/colorCommon';

// const chat = {
//   title: 'Đây là title',
//   author: 'Nguyễn Văn Nam',
//   latestChat: 'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
//   latestTime: '10 phut truoc',
// }
function ChatCard(props) {
  const chat = props.chat;
  return (
    <Card containerStyle={styles.container}>
      <TouchableHighlight style={{borderRadius: 8}} onPress={()=>alert('click')} underlayColor={touch_color}>
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity onPress={() => alert('avatar is clicked')}>
              <Image
                style={styles.imgAvatar}
                source={require('../../../assets/avatar.jpeg')}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.txtAuthor}>{chat.author}</Text>
              <Text style={styles.txtContent}>{chat.latestChat}</Text>
            </View>
          </View>

          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <View style={styles.headerAuthor}>
              <Text style={styles.txtCreateDate}>{chat.latestTime}</Text>
              <FontAwesome name={'circle'} size={8} color={active_color} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </Card>
  );
}

export default ChatCard;
