import { useTheme, useRoute } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import {
  Text,
  View,
  FlatList,
  Pressable,
  TouchableHighlight,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/Follower/styles';

import { getUser, getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import moment from 'moment';
import FollowService from 'controllers/FollowService';
import UserService from 'controllers/UserService';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function UserCard({ item }) {
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(item.following);
  const navigation = useNavigation();
  const onCallback = React.useCallback(value => {
    setFollowing(value);
  });
  const onFollow = async () => {
    setLoading(true);
    if (following) {
      // ??
      await FollowService.unfollow(jwtToken, { from_id: item.from_id })
        .then(res => {
          setLoading(false);
          setFollowing(false);
        })
        .catch(error => console.log(error));
    } else {
      await FollowService.follow(jwtToken, item.from_id)
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
        underlayColor={touch_color}
        style={styles.card}
        onPress={() =>
          navigation.navigate(navigationConstants.profile, {
            id: item.from_id,
            callback: onCallback,
          })
        }
      >
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationConstants.profile, {
                  id: item.from_id,
                  callback: onCallback,
                })
              }
            >
              <Image
                style={styles.imgAvatar}
                source={
                  item.from_avatar
                    ? { uri: item.from_avatar }
                    : require('../../../assets/avatar.jpeg')
                }
              />
            </TouchableOpacity>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.txtAuthor}>{item.full_name}</Text>
              <Text style={styles.txtContent}>
                Đã theo dõi từ {moment(item.follow_date).format('DD-MM-YYYY')}
              </Text>
            </View>
          </View>
          {item.from_id != userInfo.id ? (
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
          ) : null}
        </View>
      </TouchableHighlight>
    </Card>
  );
}
function Follower() {
  // const { colors } = useTheme();
  // const [modalVisible, setModalVisible] = useState(false);
  // const [listMes, setListMes] = useState([]);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);

  useEffect(() => {
    let isOut = false;
    const fetch = async () => {
      await FollowService.getFollowerByUserId(jwtToken, {
        id: route.params.id,
        skip: 0,
        count: 99,
      })
        .then(async res => {
          await FollowService.getFollowingByUserId(jwtToken, {
            id: userInfo.id,
            skip: 0,
            count: 99,
          }).then(following => {
            if (!isOut) {
              let promises = res.data.result.map(async er => {
                er.full_name = er.from_name;
                er.following = false;
                following.data.result.forEach(ing => {
                  if (er.from_id == ing.to_id) er.following = true;
                });
              });
              Promise.all(promises).then(() => {
                setIsLoading(false);
                setList(res.data.result);
              });
            }
          });
        })
        .catch(error => console.log(error));
    };
    fetch();
    return () => {
      isOut = true;
    };
  }, []);
  const renderItem = ({ item }) => {
    return <UserCard item={item} />;
  };
  return (
    <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
      {list.length == 0 ? (
        <Text style={{ alignSelf: 'center', marginTop: 100 }}>
          Bạn chưa có người theo dõi
        </Text>
      ) : null}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
    </View>
  );
}
export default Follower;
