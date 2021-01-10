import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/Notify/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import NotifyCard from '../../common/NotifyCard';
import { api } from 'constants/route';
import moment from 'moment';
import { getAPI } from '../../../apis/instance';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';

function Notify() {
  const { colors } = useTheme();
  const [list, setList] = useState([]);

  const curUser = useSelector(getUser);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (
        typeof JSON.parse(
          JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
        ).notification == 'undefined'
      )
        return;
      const res = JSON.parse(
        JSON.parse(
          JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
        ).notification
      );
      Toast.show({
        type: 'success',
        position: 'top',
        text1: JSON.parse(
          JSON.parse(
            JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
          ).notification
        ).Content,
        visibilityTime: 2000,
      });
      setList([
        {
          author_avatar: res.AuthorAvatar,
          content: res.Content,
          created_date: new Date(),
        },
        ...list,
      ]);
    });

    return unsubscribe;
  }, [list]);

  useEffect(() => {
    let isRender = true;

    const fetch = async () => {
      await getAPI(curUser.jwtToken)
        .get(api + 'Noftication/current')
        .then(res => {
          res.data.result.sort(
            (d1, d2) => new Date(d2.modified_date) - new Date(d1.modified_date)
          );
          setList(res.data.result);
        })
        .catch(err => alert(err));
    };
    fetch();
    return () => {
      isRender = false;
    };
  }, []);

  const renderItem = ({ item }) => {
    return <NotifyCard notify={item} />;
  };
  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

export default Notify;
