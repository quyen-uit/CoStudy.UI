import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  FlatList,
  ToastAndroid,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styles from 'components/screen/Notify/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getBasicInfo, getJwtToken } from 'selectors/UserSelectors';
import NotifyCard from '../../common/NotifyCard';
import { api } from 'constants/route';
import moment from 'moment';
import { getAPI } from '../../../apis/instance';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { setNotify } from 'actions/NotifyAction';
import NotifyService from 'controllers/NotifyService';
import { main_color } from 'constants/colorCommon';
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Button, Menu, Divider, Provider } from 'react-native-paper';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function Notify() {
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);
  const [isLoading, setIsLoading] = useState(false);

  const [refreshing, setRefreshing] = useState(false);
  const [list, setList] = useState([]);
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState(false);

  const dispatch = useDispatch();
  const onDeleteAll = () => {
    setVisibleMenu(false);
    setVisible(true);
  };
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <View style={{ marginRight: 16 }}>
          {/* <TouchableOpacity onPress={() => setVisible(true)}>
            <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
          </TouchableOpacity> */}
          <Menu
            visible={visibleMenu}
            onDismiss={() => setVisibleMenu(false)}
            anchor={
              <TouchableOpacity onPress={() => setVisibleMenu(true)}>
                <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
              </TouchableOpacity>
            }
          >
            <Menu.Item onPress={() => onDeleteAll()} title="Xóa hết" />
          </Menu>
        </View>
      ),
    });
  }, [navigation, visible, visibleMenu]);
  const onDelete = async () => {
    setIsLoading(true);
    await NotifyService.deleteAll(jwtToken)
      .then(res => {
        setIsLoading(false);
        setList([]);
        ToastAndroid.show('Xóa thành công', 1000);
      })
      .catch(err => {
        setIsLoading(false);
        ToastAndroid.show('Xóa thất bại.', 1000);
        console.log(err);
      });
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(setNotify(0));
    });

    return unsubscribe;
  }, [navigation]);
  const onLoadingCallBack = React.useCallback(value => {
    setIsLoading(value);
  });
  const onDeleteCallBack = React.useCallback(id => {
    let tmp = list.filter(i => i.oid !== id);

    setList([...tmp]);
    // setTimeout(() => ToastAndroid.show('Đã xóa thông báo.', 1000), 1000);
    NotifyService.deleteById(jwtToken, id)
      .then(res => ToastAndroid.show('Đã xóa thông báo.', 1000))
      .catch(err => console.log(err));
  });
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
      if (res.author_id != userInfo.id) {
        Toast.show({
          type: 'success',
          position: 'top',
          text1: JSON.parse(
            JSON.parse(
              JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
            ).notification
          ).content,
          visibilityTime: 2000,
        });
        console.log(res);
        setList([
          {
            author_avatar: res.author_avatar,
            content: res.content,
            created_date: new Date(),
            object_thumbnail: res.object_thumbnail,
            object_id: res.object_id,
            is_read: false,
            // isUnread: true,
          },
          ...list,
        ]);
      }
    });

    return unsubscribe;
  }, [list]);

  useEffect(() => {
    let isRender = true;

    const fetch = async () => {
      await NotifyService.getAllNotify(jwtToken)
        .then(res => {
          if (res.data.result) {
            if (refreshing) setRefreshing(false);

            res.data.result.sort(
              (d1, d2) =>
                new Date(d2.modified_date) - new Date(d1.modified_date)
            );
            setList(res.data.result);
            setIsLoading(false);
          }
        })
        .catch(err => {
          console.log(err);
          setIsLoading(false);
        });
    };
    fetch();
    return () => {
      isRender = false;
    };
  }, [refreshing]);

  const renderItem = ({ item }) => {
    return (
      <NotifyCard
        notify={item}
        onDelete={onDeleteCallBack}
        onLoading={onLoadingCallBack}
      />
    );
  };
  return (
    <View>
      {list.length < 1 ? (
        <TouchableOpacity
          onPress={() => {
            setRefreshing(true);
            setIsLoading(true);
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 16,
              color: '#616161',
              marginTop: 200,
            }}
          >
            Bạn không có không báo. Nhấn để làm mới.
          </Text>
        </TouchableOpacity>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={list}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              colors={[main_color]}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
              }}
            />
          }
        />
      )}

      {isLoading ? (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            backgroundColor: '#cccccc',
            opacity: 0.5,
            width: deviceWidth,
            height: deviceHeight - 20,
          }}
        >
          <ActivityIndicator
            size="large"
            color={main_color}
            style={{ marginBottom: 100 }}
          />
        </View>
      ) : null}
      <Modal
        visible={visible}
        width={deviceWidth - 56}
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ fontSize: 14, color: main_color }}
              text="Hủy"
              onPress={() => {
                setVisible(false);
              }}
            />
            <ModalButton
              textStyle={{ fontSize: 14, color: 'red' }}
              text="Xóa"
              onPress={async () => {
                setVisible(false);
                await onDelete();
              }}
            />
          </ModalFooter>
        }
      >
        <ModalContent>
          <View>
            <Text style={{ fontSize: 16, alignSelf: 'center' }}>
              Bạn muốn xóa hết thông báo?
            </Text>
          </View>
        </ModalContent>
      </Modal>
    
    </View>
  );
}

export default Notify;
