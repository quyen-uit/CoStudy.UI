import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import styles from 'components/screen/Following/styles';
import { getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import moment from 'moment';
import FollowService from 'controllers/FollowService';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function UserCard({ item }) {
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);
  const route = useRoute();
  const [following, setFollowing] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const onCallback = React.useCallback(value => {
    setFollowing(value);
  });
  useEffect(() => {
    let isRender = true;
    const fetch = async () =>
      await FollowService.getFollowerByUserId(jwtToken, {
        id: route.params.id,
        skip: 0,
        count: 99,
      })
        .then(res => {
          res.data.result.forEach(i => {
            if (item.to_id == i.to_id) if (isRender) setFollowing(true);
          });
        })
        .catch(error => console.log(error));
    fetch();
    return () => {
      isRender = false;
    };
  }, []);
  const onFollow = async () => {
    setLoading(true);
    if (following) {
      await FollowService.unfollow(jwtToken, { from_id: item.to_id })
        .then(res => {
          setLoading(false);
          setFollowing(false);
        })
        .catch(error => console.log(error));
    } else {
      await FollowService.follow(jwtToken, item.to_id)
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
            id: item.to_id,
            callback: onCallback,
          })
        }
      >
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(navigationConstants.profile, {
                  id: item.to_id,
                  callback: onCallback,
                })
              }
            >
              <Image
                style={styles.imgAvatar}
                source={
                  item.to_avatar
                    ? { uri: item.to_avatar }
                    : require('../../../assets/avatar.jpeg')
                }
              />
            </TouchableOpacity>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.txtAuthor}>{item.to_name}</Text>
              <Text style={styles.txtContent}>
                Đã theo dõi từ {moment(item.follow_date).format('DD-MM-YYYY')}
              </Text>
            </View>
          </View>
          {item.to_id != userInfo.id ? (
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
function Following() {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [listMes, setListMes] = useState([]);
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const jwtToken = useSelector(getJwtToken);
  const route = useRoute();

  useEffect(() => {
    let isOut = false;
    const fetch = async () => {
      await FollowService.getFollowingByUserId(jwtToken, {
        id: route.params.id,
        skip: 0,
        count: 99,
      })
        .then(res => {
          if (!isOut) {
            setList(res.data.result);
            setIsLoading(false);
          }
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
          Bạn chưa theo dõi ai
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
export default Following;
