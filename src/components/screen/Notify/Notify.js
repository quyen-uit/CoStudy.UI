import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/Notify/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import NotifyCard from '../../common/NotifyCard';

const list = [
  {
    author: 'Nguyen Van Nam',
    createdDate: '1 phút',
    id: '1'
  },
  {
    author: 'Nguyen Van Nam',
    createdDate: '1 phút',
    id: '2'
  },
  {
    author: 'Nguyen Van Nam',
    createdDate: '1 phút',
    id: '3'
  }
]
function Notify() {
  const { colors } = useTheme();
  const user = useSelector(getUser);

  const renderItem = ({ item }) => {
    return <NotifyCard notify={item} />;
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

export default Notify;
