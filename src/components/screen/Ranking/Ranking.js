import {
  useTheme,
  useNavigation,
  CommonActions,
  useRoute,
} from '@react-navigation/native';
import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
  ToastAndroid,
  StyleSheet,
  SafeAreaView,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import { getUser, getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import 'react-native-get-random-values';
import UserService from 'controllers/UserService';
import Point from 'components/common/Point';

import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';

function Ranking() {
  const jwtToken = useSelector(getJwtToken);
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height;

  const navigation = useNavigation();
  const route = useRoute();
  const [current, setCurrent] = useState({});
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState('Bảng xếp hạng');
  const [idPick, setIdPick] = useState('');
  const userInfo = useSelector(getBasicInfo);
  const [fieldPickers, setFieldPickers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const goToProfile = id => {
    navigation.push(navigationConstants.profile, { id: id });
  };
  useEffect(() => {
    if (idPick == '') return;
    let isRender = true;
    setIsLoading(true);

    const fetchData = async () => {
      await UserService.getRanking(jwtToken, {
        skip: 0,
        count: 100,
        fieldId: idPick,
      }).then(res => {
        // res.data.result.leaderboard[0].total_point = Math.random();
        setList(res.data.result.leaderboard);
        setCurrent(res.data.result.current_user);
        setIsLoading(false);
      });
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, [idPick]);
  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await UserService.getAllField(jwtToken)
        .then(response => {
          if (isRender) {
            response.data.result.forEach(element => {
              element.isPick = false;
            });
            response.data.result[0].isPick = true;
            setFieldPickers(response.data.result);
            setTitle(response.data.result[0].value);
            setIdPick(response.data.result[0].oid);
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Bảng xếp hạng',
      headerShown: true,
      headerRight: () => (
        <View style={{ marginRight: 16 }}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={{ fontSize: 16, color: '#fff' }}>Thay đổi</Text>
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, title]);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => goToProfile(item.user_id)}
        style={{
          borderRadius: 8,
          borderWidth: 1,
          paddingHorizontal: 16,
          paddingVertical: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: deviceWidth - 32,
          marginVertical: 4,
          borderColor: main_color,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderColor: main_color,
              borderWidth: 1,
            }}
            source={{ uri: item.user_avatar }}
          />
          <View style={{ marginLeft: 8, marginRight: 16 }}>
            <Text
              style={{ fontSize: 18, fontWeight: 'bold', color: main_color }}
            >
              {item.user_name}
            </Text>
            <Point point={item.total_point} color={main_color} />
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: main_2nd_color }}>Hạng</Text>
          <Text
            style={{ color: main_2nd_color, fontWeight: 'bold', fontSize: 18 }}
          >
            {item.index}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ flex: 1 }}>
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
      ) : (
        <View style={{ flex: 1, backgroundColor: main_color }}>
          {/* <Image
            style={{
              width: deviceWidth,
              height: deviceHeight / 2,
              position: 'absolute',
            }}
            source={require('../../../assets/ranking_background.jpg')}
          /> */}
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 18,
              marginTop: 4,
              marginBottom: 32,
              color: 'white',
            }}
          >
            {title}
          </Text>
          {deviceWidth < deviceHeight ? (
            <View style={{ paddingBottom: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                }}
              >
                <View style={{ ...styles.col, marginTop: 32 }}>
                  <TouchableOpacity
                    onPress={() => goToProfile(list[1].user_id)}
                  >
                    <Image
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        borderColor: '#fff',
                        borderWidth: 1,
                      }}
                      source={{ uri: list[1].user_avatar }}
                    />
                    <View
                      style={{
                        backgroundColor: main_2nd_color,
                        width: 20,
                        height: 20,
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <Text style={{ color: 'white' }}>2</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={{ marginTop: 4, color: '#fff' }}>
                    {list[1].user_name}
                  </Text>
                  <Point point={list[1].total_point} />
                </View>
                <View style={{ ...styles.col }}>
                  <View>
                    <TouchableOpacity
                      onPress={() => goToProfile(list[0].user_id)}
                    >
                      <Image
                        style={{
                          width: 88,
                          height: 88,
                          borderRadius: 44,
                          borderColor: '#ede437',
                          borderWidth: 1,
                        }}
                        source={{ uri: list[0].user_avatar }}
                      />
                      <Image
                        style={{
                          width: 64,
                          height: 48,
                          position: 'absolute',
                          top: -24,
                          right: -20,
                          transform: [{ rotate: '408deg' }],
                        }}
                        source={require('../../../assets/crown.png')}
                      />
                    </TouchableOpacity>
                    <View
                      style={{
                        backgroundColor: '#ede437',
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <Text style={{ color: 'white' }}>1</Text>
                    </View>
                  </View>
                  <Text style={{ marginTop: 4, color: '#fff' }}>
                    {list[0].user_name}
                  </Text>
                  <Point point={list[0].total_point} />
                </View>
                <View style={{ ...styles.col, marginTop: 32 }}>
                  <TouchableOpacity
                    onPress={() => goToProfile(list[2].user_id)}
                  >
                    <Image
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        borderColor: '#fff',
                        borderWidth: 1,
                      }}
                      source={{ uri: list[2].user_avatar }}
                    />
                    <View
                      style={{
                        backgroundColor: '#4ced37',
                        width: 20,
                        height: 20,
                        borderRadius: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                      }}
                    >
                      <Text style={{ color: 'white' }}>3</Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={{ marginTop: 4, color: '#fff' }}>
                    {list[2].user_name}
                  </Text>
                  <Point point={list[2].total_point} />
                </View>
              </View>
            </View>
          ) : null}
          <View
            style={{
              flex: 1,
              backgroundColor: '#fff',
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 4,
            }}
          >
            <FlatList
              showsVerticalScrollIndicator={false}
              data={list}
              renderItem={item => renderItem(item)}
              keyExtractor={(item, index) => index.toString()}
              ListHeaderComponent={() => (
                <View
                  style={{
                    borderRadius: 8,
                    marginBottom: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    alignItems: 'center',
                    backgroundColor: main_color,
                  }}
                >
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderColor: main_color,
                      borderWidth: 1,
                    }}
                    source={{ uri: current.user_avatar }}
                  />
                  <View style={{ marginLeft: 8, marginRight: 16 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: '#fff',
                      }}
                    >
                      Bạn
                    </Text>
                    <Point point={current.total_point} />
                  </View>
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>Hạng</Text>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 18,
                      }}
                    >
                      {current.index}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      )}
      <BottomModal
        visible={modalVisible}
        swipeDirection={['up', 'down']} // can be string or an array
        swipeThreshold={100} // default 100
        useNativeDriver={true}
        modalTitle={
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <Icon name={'grip-lines'} color={main_color} size={16} />
            <Text>Chọn lĩnh vực cho bài biết</Text>
          </View>
        }
        modalAnimation={
          new SlideAnimation({
            initialValue: 0, // optional
            slideFrom: 'bottom', // optional
            useNativeDriver: true, // optional
          })
        }
        onHardwareBackPress={() => {
          setModalVisible(false);
          return true;
        }}
        onTouchOutside={() => {
          setModalVisible(false);
        }}
        onSwipeOut={event => {
          setModalVisible(false);
        }}
      >
        <ModalContent style={{ marginHorizontal: -16 }}>
          <View>
            <View
              style={{ flexWrap: 'wrap', flexDirection: 'row', padding: 8 }}
            >
              {fieldPickers.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    fieldPickers.forEach(field => {
                      field.isPick = false;
                      if (field.oid == item.oid) {
                        field.isPick = true;
                        setTitle(item.value);
                        setIdPick(item.oid);
                      }
                    });

                    setFieldPickers(fieldPickers.filter(item => item));
                  }}
                >
                  <View
                    style={{
                      backgroundColor: item.isPick ? main_2nd_color : '#ccc',
                      padding: 8,
                      borderRadius: 100,
                      margin: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: item.isPick ? '#fff' : main_2nd_color,
                        fontSize: 16,
                      }}
                    >
                      {item.value}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  backgroundColor: main_color,
                  marginHorizontal: 16,
                  marginBottom: -8,
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
                >
                  Xác nhận
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ModalContent>
      </BottomModal>
    </View>
  );
}

export default Ranking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
  },
  col: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  // indexCol: {
  //   flex: 1,
  //   fontSize: 24,
  //   fontWeight: 'bold',
  //   width: colWidth,
  //   textAlign: 'center',
  //   paddingTop: 16,
  //   color: '#fff',
  // },
});
