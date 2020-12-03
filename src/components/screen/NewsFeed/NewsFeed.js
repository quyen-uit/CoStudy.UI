import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, FlatList, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/NewsFeed/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import { Card } from 'react-native-elements';
import navigationConstants from 'constants/navigation';
import { touch_color } from 'constants/colorCommon';
import PostCard from '../../common/PostCard';
import Button from 'components/common/Button';
import { useNavigation } from '@react-navigation/native';

const list = [
  {
    id: '1',
    title: 'Đây là title 1',
    author: 'Nguyễn Văn Nam',
    content:
      'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    createdDate: '10 phut truoc',
  },
  {
    id: '2',
    title: 'Đây là title',
    author: 'Nguyễn Văn Nam',
    content:
      'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    createdDate: '10 phut truoc',
  },
  {
    title: 'Đây là title 2',
    author: 'Nguyễn Văn Nam',
    content:
      'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    createdDate: '10 phut truoc',
    id: '3',
  },
];

function NewsFeed() {
  const { colors } = useTheme();
  const user = useSelector(getUser);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const GoToPost = () => {
    navigation.navigate(navigationConstants.post);
  }
  const renderItem = ({ item }) => {
    return (
 
          <PostCard post={item} />
 
    );
  };
  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
}

export default NewsFeed;
