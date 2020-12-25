import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import {
  Text,
  View,
  FlatList,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/Follower/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import * as signalR from '@microsoft/signalr';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const list = [
  {
    id: '1',
    author: 'Nguyễn Văn Nam',
    info: 'Đại học Công nghệ thông tin',
    status: 0,
  },
  {
    id: '2',
    author: 'Nguyễn Văn Ba',
    info: 'Đại học Công nghệ thông tin',
    status: 1,
  },
  {
    id: '3',
    author: 'Nguyễn Văn Ta',
    info: 'Đại học Công nghệ thông tin',
    status: 0,
  },
];

function Follower() {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [listMes, setListMes] = useState([]);
  const user = useSelector(getUser);

  const renderItem = ({ item }) => {
    return (
      <Card containerStyle={styles.cardContainer}>
        <TouchableHighlight
          onPress={() => GoToConversation()}
          onLongPress={() => setModalVisible(true)}
          underlayColor={touch_color}
          style={styles.card}
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
                <Text style={styles.txtAuthor}>{item.author}</Text>
                <Text style={styles.txtContent}>{item.info}</Text>
              </View>
            </View>
            <View style={{ alignSelf: 'center' }}>
              <TouchableOpacity style={{ backgroundColor: main_color , padding: 4, paddingHorizontal:8, borderRadius: 8}}>
                <Text style={{color: 'white'}}>Hủy theo dõi</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableHighlight>
      </Card>
    );
  };
  return (
    <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}
export default Follower;
