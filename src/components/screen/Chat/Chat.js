import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/Chat/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import ChatCard from '../../common/ChatCard';

const list = [
  {
    id: '1',
    title: 'Đây là title',
    author: 'Nguyễn Văn Nam',
    latestChat: 'Đây là tin nhanw cuoi',
    latestTime: '10 phut truoc',
  },
  {
    id: '2',
    title: 'Đây là title',
    author: 'Nguyễn Văn Nam',
    latestChat: 'Đây là tin nhanw cuoi',
    latestTime: '10 phut truoc',
  },
  {
    id: '3',
    title: 'Đây là title',
    author: 'Nguyễn Văn Nam',
    latestChat: 'Đây là tin nhanw cuoi',
    latestTime: '10 phut truoc',
  },
];
function Chat() {
  const { colors } = useTheme();
  const user = useSelector(getUser);
  const renderItem = ({ item }) => {
    return <ChatCard chat={item} />;
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

export default Chat;
