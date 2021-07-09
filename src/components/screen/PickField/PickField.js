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
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { getBasicInfo, getJwtToken } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import { main_color, main_2nd_color, touch_color } from 'constants/colorCommon';
import PostCard from '../../common/PostCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { actionTypes, update } from 'actions/UserActions';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';
import Loading from '../../common/Loading';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function PickField() {
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);

  // const dispatch = useDispatch();

  const navigation = useNavigation();
  // const route = useRoute();

  const [isLoading, setIsLoading] = useState(true);
  const [fieldPickers, setFieldPickers] = useState([]);
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <View style={{ marginRight: 16 }}>
          <TouchableOpacity
            onPress={async () => {
              let temp = [];
              fieldPickers.forEach(i => {
                if (i.isPick) temp.push(i.oid);
              });
              if(temp.length < 1)
              {
                ToastAndroid.show('Bạn chưa chọn lĩnh vực nào.', ToastAndroid.SHORT);
              }
              else
              {
                await UserService.updateFieldOfUser(jwtToken, userInfo.id, temp)
                .then(res => {
                  ToastAndroid.show('Cập nhật thành công.', ToastAndroid.SHORT);
                  navigation.goBack();
                })
                .catch(err => console.log(err));
              }
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16 }}>Thay đổi</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation,fieldPickers]);

  useEffect(() => {
    let isRender = true;
    let fields = [];
    const fetchData = async () => {
      await UserService.getFieldByUserId(jwtToken, userInfo.id).then(user => {
        fields = user.data.result;
      });
      await UserService.getAllField(jwtToken)
        .then(response => {
          if (isRender) {
            response.data.result.forEach(async element => {
              element.isPick = false;
              fields.forEach(i => {
                if (i.field_id == element.oid) element.isPick = true;
              });
            });
            setIsLoading(false);
            setFieldPickers(response.data.result);
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      {false ? (
        <TouchableOpacity
          onPress={() => {
            onRefresh();
            setIsLoading(true);
          }}
        >
          <Text style={styles.notFound}>
            Bạn không có lĩnh vực nào. Chọn ngay!
          </Text>
        </TouchableOpacity>
      ) : (
        <SafeAreaView>
          <View style={styles.containerField}>
            {fieldPickers.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  item.isPick = item.isPick ? false : true;

                  setFieldPickers(fieldPickers.filter(item => item));
                }}
              >
                <View
                  style={{
                    borderColor: item.isPick ? '#ededed' : main_2nd_color,
                    backgroundColor: item.isPick ? main_2nd_color : '#ededed',
                    ...styles.box,
                  }}
                >
                  <Text
                    style={{
                      color: item.isPick ? '#ededed' : main_2nd_color,
                      ...styles.txtField,
                    }}
                  >
                    {item.value}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {isLoading ? <Loading /> : null}
        </SafeAreaView>
      )}
    </View>
  );
}

export default PickField;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  containerField: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'space-around',
  },
  box: {
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    margin: 8,
    borderWidth: 1,
  },
  txtField: {
    fontSize: 16,
  },
  notFound: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#616161',
    marginTop: 200,
  },
});
