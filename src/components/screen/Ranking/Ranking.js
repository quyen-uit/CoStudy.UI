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
} from 'react-native';
import { useSelector } from 'react-redux';
import { getUser, getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import 'react-native-get-random-values';
import UserService from 'controllers/UserService';

import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const colWidth = deviceWidth / 6;

import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import Badge from 'components/common/Badge';

function Ranking() {
  const jwtToken = useSelector(getJwtToken);

  const navigation = useNavigation();
  const route = useRoute();
  const [current, setCurrent] = useState({});
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userInfo = useSelector(getBasicInfo);
  const goToProfile = id => {
    navigation.push(navigationConstants.profile, { id: id });
  };
  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await UserService.getRanking(jwtToken, { skip: 0, count: 100 }).then(
        res => {
          setList(res.data.result.leaderboard);
          setCurrent(res.data.result.current_user);
          setIsLoading(false);
        }
      );
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => goToProfile(item.id)}
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
            <Text>{item.total_point}đ</Text>
          </View>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: main_2nd_color }}>Hạng</Text>
          <Text style={{ color: main_2nd_color }}>{item.index}</Text>
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
        <View style={{ flex: 1 }}>
          <Image
            style={{
              width: deviceWidth,
              height: deviceHeight / 2,
              position: 'absolute',
            }}
            source={require('../../../assets/ranking_background.jpg')}
          />
          <View style={{ flex: 2 }}>
            <View
              style={{
                height: deviceHeight / 2 - 100,
                flexDirection: 'row',
              }}
            >
              <View style={{ marginTop: 80, ...styles.col }}>
                <TouchableOpacity onPress={() => goToProfile(list[1].id)}>
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderColor: main_color,
                      borderWidth: 1,
                    }}
                    source={{ uri: list[1].user_avatar }}
                  />
                </TouchableOpacity>
                <Text style={{ marginTop: 4, color: '#fff' }}>
                  {list[1].user_name}
                </Text>
                <Text
                  style={{ marginVertical: 2, fontSize: 12, color: '#fff' }}
                >
                  {list[1].total_point}đ
                </Text>
                <Text
                  style={{ backgroundColor: '#0CE570', ...styles.indexCol }}
                >
                  2
                </Text>
              </View>
              <View style={{ marginTop: 40, ...styles.col }}>
                <TouchableOpacity onPress={() => goToProfile(list[0].id)}>
                  <Image
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      borderColor: main_color,
                      borderWidth: 1,
                    }}
                    source={{ uri: list[0].user_avatar }}
                  />
                </TouchableOpacity>
                <Text style={{ marginTop: 4, color: '#fff' }}>
                  {list[0].user_name}
                </Text>
                <Text
                  style={{ marginVertical: 2, fontSize: 12, color: '#fff' }}
                >
                  {list[0].total_point}đ
                </Text>
                <Text
                  style={{ backgroundColor: '#FE5C29', ...styles.indexCol }}
                >
                  1
                </Text>
              </View>
              <View style={{ marginTop: 100, ...styles.col }}>
                <TouchableOpacity onPress={() => goToProfile(list[2].id)}>
                  <Image
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      borderColor: main_color,
                      borderWidth: 1,
                    }}
                    source={{ uri: list[2].user_avatar }}
                  />
                </TouchableOpacity>
                <Text style={{ marginTop: 4, color: '#fff' }}>
                  {list[2].user_name}
                </Text>
                <Text
                  style={{ marginVertical: 2, fontSize: 12, color: '#fff' }}
                >
                  {list[2].total_point}đ
                </Text>
                <Text
                  style={{ backgroundColor: '#CCF429', ...styles.indexCol }}
                >
                  3
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 3,
              backgroundColor: '#fff',
              alignItems: 'center',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 16,
            }}
          >
            <View
              style={{
                borderRadius: 8,
                marginBottom: 8,
                paddingHorizontal: 16,
                paddingVertical: 8,
                flexDirection: 'row',
                justifyContent: 'center',
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
                  style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}
                >
                  Bạn
                </Text>
                <Text style={{ color: '#fff' }}>{current.total_point}đ</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#fff' }}>Hạng</Text>
                <Text style={{ color: '#fff' }}>{current.index}</Text>
              </View>
            </View>
            <SafeAreaView>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={list}
                // onEndReached={async () => {
                //   if (posts.length > 2) {
                //     setIsEnd(true);
                //     if (refreshing) {
                //       setIsEnd(false);
                //       return;
                //     }
                //     await fetchData();
                //   }
                // }}
                // onEndReachedThreshold={0.1}
                renderItem={item => renderItem(item)}
                keyExtractor={(item, index) => index.toString()}
                // refreshControl={
                //   <RefreshControl
                //     colors={[main_color]}
                //     refreshing={refreshing}
                //     onRefresh={() => {
                //       onRefresh();
                //     }}
                //   />
                // }
                // ListFooterComponent={() =>
                //   isEnd ? (
                //     <View style={{ marginVertical: 12 }}>
                //       <ActivityIndicator size={'large'} color={main_color} />
                //     </View>
                //   ) : (
                //     <View style={{ margin: 4 }}></View>
                //   )
                // }
              />
            </SafeAreaView>
          </View>
        </View>
      )}
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
  indexCol: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    width: colWidth,
    textAlign: 'center',
    paddingTop: 16,
    color: '#fff',
  },
});
