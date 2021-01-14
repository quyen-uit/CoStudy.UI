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
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import { api } from 'constants/route';
import moment from 'moment';
import { getAPI } from '../../../apis/instance';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const list = [
  {
    id: '1',
    author: 'Nguyễn Văn Nam',
    info: 'Đại học Công nghệ thông tin',
    status: 0,
  },
  {
    id: '2',
    author: 'Nguyễn Văn Ba',
    info: 'Đại học Công nghệ thông tin',
    status: 1,
  },
];
function UserCard({ item }) {
  const [loading, setLoading] = useState(false);
  const curUser = useSelector(getUser);
  const [following, setFollowing] = useState(item.following);
  const navigation = useNavigation();
  const onCallback = React.useCallback(value => {
    setFollowing(value);
  });
  const onFollow = async () => {
    setLoading(true);
    if (following) {
      await getAPI(curUser.jwtToken)
        .post(api + 'User/following/remove?followingId=' + item.from_id, {
          followingId: item.from_id,
        })
        .then(res => {
          setLoading(false);
          setFollowing(false);
        })
        .catch(error => console.log(error));
    } else {
      await getAPI(curUser.jwtToken)
        .post(api + 'User/following', { followers: [item.from_id] })
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
            id: item.from_id,
            callback: onCallback,
          })
        }
        underlayColor={touch_color}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity>
              <Image
                style={styles.imgAvatar}
                source={
                  item.avatar
                    ? { uri: item.avatar }
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
          {item.from_id != curUser.oid ? (
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
                    backgroundColor: following ?  '#ccc' : main_color,
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
                      color: following ?  main_color : 'white',
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
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [listMes, setListMes] = useState([]);
  const [list, setList] = useState([]);
  const curUser = useSelector(getUser);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();

  useEffect(() => {
    let isOut = false;
    const fetch = async () => {
      await getAPI(curUser.jwtToken)
        .get(
          api + 'User/follower?UserId=' + route.params.id + '&Skip=0&Count=99'
        )
        .then(async res => {
          await getAPI(curUser.jwtToken)
            .get(
              api + 'User/following?UserId=' + curUser.oid + '&Skip=0&Count=99'
            )
            .then(following => {
              if (!isOut) {
                console.log(res.data.result);
                let promises = res.data.result.map(async er => {
                  await getAPI(curUser.jwtToken)
                    .get(api + 'User/get/' + er.from_id)
                    .then(user => {
                      er.full_name = user.data.result.first_name + ' ' + user.data.result.last_name;
                      er.avatar = user.data.result.avatar.image_hash;
                    })
                    .catch(er => alert(er));
                  er.following = false;
                  following.data.result.forEach(ing => {
                    if (er.from_id == ing.toId) er.following = true;
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
