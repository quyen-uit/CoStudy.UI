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
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import { getAPI } from '../../../apis/instance';
import { api } from 'constants/route';
import moment from 'moment';
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
  const [following, setFollowing] = useState(true);
  const [loading, setLoading] = useState(false);
  const curUser = useSelector(getUser);
  const navigation = useNavigation();
  useEffect(() => {
    let isRender = true;
    const fetch = async () =>
      await getAPI(curUser.jwtToken)
        .get(api + 'User/following?UserId=' + curUser.oid + '&Skip=0&Count=99')
        .then(res => {
          res.data.result.forEach(i => {
            if (item.toId == i.toId) if (isRender) setFollowing(true);
          });
        })
        .catch(error => alert(error));
    fetch();
    return ()=>{
      isRender = false;
    }
  }, []);
  const onFollow = async () => {
    setLoading(true);
    if (following) {
      await getAPI(curUser.jwtToken)
        .post(api + 'User/following/remove?followingId=' + item.toId, {
          followingId: item.toId,
        })
        .then(res => {
          setLoading(false);
          setFollowing(false);
        })
        .catch(error => alert(error));
    } else {
      await getAPI(curUser.jwtToken)
        .post(api + 'User/following', { followers: [item.toId] })
        .then(res => {
          setLoading(false);
          setFollowing(true);
        })
        .catch(error => alert(error));
    }
  };
  return (
    <Card containerStyle={styles.cardContainer}>
      <TouchableHighlight
        
        underlayColor={touch_color}
        style={styles.card}
        onPress={() =>
          navigation.push(navigationConstants.profile, { id: item.toId })
        }
      >
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity onPress={() => alert('avatar is clicked')}>
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
                  backgroundColor: following ? main_color : '#ccc',
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
                    color: following ? 'white' : main_color,
                    alignSelf: 'center',
                  }}
                >
                  {following ? 'Hủy theo dõi' : 'Theo dõi'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
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
  const curUser = useSelector(getUser);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  useEffect(() => {
    let isOut = false;
    const fetch = async () => {
      await getAPI(curUser.jwtToken)
        .get(api + 'User/following?UserId=' + route.params.id + '&Skip=0&Count=99')
        .then(res => {
          if (!isOut) {
            setList(res.data.result);
            setIsLoading(false);
          }
        })
        .catch(error => alert(error));
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
