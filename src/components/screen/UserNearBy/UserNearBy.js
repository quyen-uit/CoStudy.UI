import { useTheme, useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import DateRangePicker from '../../common/DateRangePicker';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  RefreshControl,
  Alert,
  ToastAndroid,
  BackHandler,
  Keyboard,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from './styles';

import { getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import { main_color, main_2nd_color, touch_color } from 'constants/colorCommon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';
import PostCard from '../../common/PostCard';
import { Badge } from 'react-native-elements';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import navigationConstants from 'constants/navigation';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';
import FollowService from 'controllers/FollowService';
import PostOptionModal from 'components/modal/PostOptionModal/PostOptionModal';

function UserCard({ item }) {
  const [loading, setLoading] = useState(false);
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);

  const [following, setFollowing] = useState(item.following);
  const onCallback = React.useCallback(value => {
    setFollowing(value);
  });
  const navigation = useNavigation();

  const onFollow = async () => {
    setLoading(true);
    if (following) {
      await FollowService.unfollower(jwtToken, item.user_id)
        .then(res => {
          setLoading(false);
          setFollowing(false);
        })
        .catch(error => console.log(error));
    } else {
      await FollowService.follow(jwtToken, item.user_id)
        .then(res => {
          setLoading(false);
          setFollowing(true);
        })
        .catch(error => console.log(error));
    }
  };
  return (
    <Card containerStyle={styles.cardContainer}>
      <TouchableHighlight
        onPress={() =>
          navigation.push(navigationConstants.profile, {
            id: item.user_id,
            callback: onCallback,
          })
        }
        underlayColor={touch_color}
        style={styles.card}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity
              onPress={() =>
                navigation.push(navigationConstants.profile, {
                  id: item.user_id,
                  callback: onCallback,
                })
              }
            >
              <Image
                style={styles.imgAvatar}
                source={
                  item.avatar != null
                    ? { uri: item.avatar }
                    : require('../../../assets/avatar.jpeg')
                }
              />
            </TouchableOpacity>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.txtAuthor}>{item.full_name}</Text>
              <Text style={styles.txtContent}>{item.distance}m</Text>
            </View>
          </View>
          {item.user_id == userInfo.id ? null : (
            <View style={{ alignSelf: 'center', width: 96 }}>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color={main_color}
                  style={{ alignSelf: 'center' }}
                />
              ) : (
                <TouchableOpacity
                  style={{
                    backgroundColor: following ? '#ccc' : main_color,
                    padding: 4,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                  }}
                  onPress={() => {
                    onFollow();
                  }}
                >
                  <Text
                    style={{
                      color: following ? main_color : 'white',
                      alignSelf: 'center',
                    }}
                  >
                    {following ? 'Hủy theo dõi' : 'Theo dõi'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableHighlight>
    </Card>
  );
}

function UserNearBy() {
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);

  const navigation = useNavigation();
  // data
  const [users, setUsers] = useState([]);

  // show modal
  const [modalVisible, setModalVisible] = useState(false);
  // loading
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const onModal = React.useCallback((value, id, saved) => {
    setModalPostVisible(value);
    setIdModal(id);
    setSavedModal(saved);
  });
  const onVisibleCallBack = React.useCallback(value => {
    setModalPostVisible(value);
  });
  const backAction = () => {
    setModalVisible(false);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  useEffect(() => {
    let isRender = true;
    setIsLoading(true);

    const fetchData = async () => {
      await UserService.getUserNearBy(jwtToken, { skip: 0, count: 10 })
        .then(async response => {
          if (isRender) {
            response.data.result.shift();

            await FollowService.getFollowingByUserId(jwtToken, {
              skip: 0,
              count: 99,
              id: userInfo.id,
            }).then(following => {
              response.data.result.forEach(er => {
                er.following = false;
                following.data.result.forEach(ing => {
                  if (er.user_id == ing.to_id) er.following = true;
                });
              });
              setIsLoading(false);
              setUsers([...response.data.result]);
              setSkip(skip + 10);
            });
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

  const fetchMore = async () => {
    await UserService.getUserNearBy(jwtToken, { skip: skip, count: 10 })
      .then(async response => {
        await FollowService.getFollowingByUserId(jwtToken, {
          skip: 0,
          count: 99,
          id: userInfo.id,
        }).then(following => {
          response.data.result.forEach(er => {
            er.following = false;
            following.data.result.forEach(ing => {
              if (er.oid == ing.to_id) er.following = true;
            });
          });
          setIsLoading(false);
          setUsers([...users, ...response.data.result]);
          setSkip(skip + 10);
        });
      })
      .catch(error => console.log(error));
  };
  const onRefresh = async () => {
    setRefreshing(true);
    setIsEnd(false);
    await UserService.getUserNearBy(jwtToken, { skip: 0, count: 10 })
      .then(async response => {
        response.data.result.shift();

        await FollowService.getFollowingByUserId(jwtToken, {
          skip: 0,
          count: 99,
          id: userInfo.id,
        }).then(following => {
          response.data.result.forEach(er => {
            er.following = false;
            following.data.result.forEach(ing => {
              if (er.oid == ing.to_id) er.following = true;
            });
          });
          setIsLoading(false);
          setUsers(response.data.result);
          setSkip(10);
          setRefreshing(false);
        });
      })
      .catch(error => console.log(error));
  };
  const renderUserCard = ({ item }) => {
    return <UserCard item={item} />;
  };
  return (
    <View>
      <SafeAreaView>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={users}
          onEndReached={async () => {
            if (users.length > 10) {
              setIsEnd(true);
              if (refreshing) {
                setIsEnd(false);
                return;
              }
              await fetchMore();
            }
          }}
          onEndReachedThreshold={0.1}
          renderItem={item => renderUserCard(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              colors={[main_color]}
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
            />
          }
          ListFooterComponent={() =>
            isEnd ? (
              <View style={{ marginVertical: 12 }}>
                <ActivityIndicator size={'large'} color={main_color} />
              </View>
            ) : (
              <View style={{ margin: 4 }}></View>
            )
          }
        />

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
      </SafeAreaView>
    </View>
  );
}

export default UserNearBy;
