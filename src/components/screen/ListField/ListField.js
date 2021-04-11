import { useTheme, DrawerActions } from '@react-navigation/native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  RefreshControl,
  ToastAndroid,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import styles from 'components/screen/ListField/styles';
import { getBasicInfo, getJwtToken } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import {
  badge_level1,
  badge_level2,
  badge_level3,
  badge_level4,
  badge_level5,
  main_2nd_color,
  main_color,
  touch_color,
} from 'constants/colorCommon';import PostCard from '../../common/PostCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { actionTypes, update } from 'actions/UserActions';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const fields = [
  {
    id: 1,
    name: 'Cơ sở dữ liệu',
    level: 1,
  },
  {
    id: 2,
    name: 'Giải tích',
    level: 5,
  },
];
function ListField() {
  const jwtToken = useSelector(getJwtToken);
  // const userInfo = useSelector(getBasicInfo);

  // const dispatch = useDispatch();

  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(true);
  const [fields, setFields] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <View style={{ marginRight: 16 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationConstants.pickField)}
          >
            <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);
  useEffect(() => {
    const fetch = async () => {
      await UserService.getFieldByUserId(jwtToken, route.params.userId)
        .then(res => {
          res.data.result.forEach(item => {
            if (item.level_name == 'Level 1') {
              item.color = badge_level1;
              item.icon = require('../../../assets/level1.png');
            } else if (item.level_name == 'Level 2') {
              item.color = badge_level2;
              item.icon = require('../../../assets/level2.png');
            } else if (item.level_name == 'Level 3') {
              item.color = badge_level3;
              item.icon = require('../../../assets/level3.png');
            } else if (item.level_name == 'Level 4') {
              item.color = badge_level4;
              item.icon = require('../../../assets/level4.png');
            } else {
              item.color = badge_level5;
              item.icon = require('../../../assets/level5.png');
            }
          });
          setFields(res.data.result);
        })
        .catch(err => console.log(err));
    };
    fetch();
  }, []);
  const renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 8,
          marginVertical: 4,
          backgroundColor: '#fff',
          borderRadius: 4,
          alignItems: 'center',
          padding: 8,
        }}
      >
        <Text style={{ fontSize: 16, color: item.color }}>
          {index + 1}. {item.field_name}
        </Text>
        <Image source={item.icon} />
      </View>
    );
  };
  return (
    <View
      style={{
        backgroundColor: '#ccc',
        flex: 1,
      }}
    >
      {fields.length < 1 ? (
        <TouchableOpacity
          onPress={() => {
            onRefresh();
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
            Bạn không có lĩnh vực nào. Chọn ngay!
          </Text>
        </TouchableOpacity>
      ) : (
        <SafeAreaView>
          <View>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                borderColor: main_2nd_color,
                borderWidth: 8,
                justifyContent: 'center',
                alignItems: 'center',
                marginVertical: 8,
                alignSelf: 'center',
              }}
            >
              <Text
                style={{ fontSize: 40, color: main_color, fontWeight: 'bold' }}
              >
                {fields.length}
              </Text>
              <Text style={{ marginTop: -10, color: main_color }}>
                lĩnh vực
              </Text>
            </View>
          </View>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={fields}
            renderItem={(item, index) => renderItem(item, index)}
            keyExtractor={(item, index) => index.toString()}
          />
          {false ? (
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
        </SafeAreaView>
      )}
    </View>
  );
}

export default ListField;

// <FlatList
//         showsVerticalScrollIndicator={false}
//         data={list}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//       />
