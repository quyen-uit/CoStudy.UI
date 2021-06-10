import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PostCard from '../../common/PostCard';
import { getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import navigationConstants from 'constants/navigation';
import moment from 'moment';
import UserService from 'controllers/UserService';
import Badge from 'components/common/Badge';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function ProfileDetail({ userId }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const route = useRoute();
  const [data, setData] = useState(route.params.data);
  const [isLoading, setIsLoading] = useState(true);
  const curUser = useSelector(getUser);
  const [isMe, setIsMe] = useState(true);
  const [avatar, setAvatar] = useState('');
  const [fields, setFields] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    if (route.params.data.oid != curUser.oid) {
      setIsMe(false);
    }
    let isOut = false;
    const fetchData = async () => {
      await UserService.getUserById(curUser.jwtToken, route.params.data.oid)
        .then(response => {
          if (!isOut) {
            setData(response.data.result);
            setAvatar(response.data.result.avatar.image_hash);
            setFields(response.data.result.fields);
            setIsLoading(false);
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isOut = true;
    };
  }, []);
  const renderItem = ({ item }) => {
    return <PostCard post={item} />;
  };

  function GroupAmount(props) {
    return (
      <View style={styles.flex1}>
        <TouchableOpacity onPress={() => alert('aa')}>
          <View style={styles.alignItemCenter}>
            <Text style={styles.txtAmount}>{props.amount}</Text>
            <Text style={styles.txtTitleAmount}>{props.title}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  function Field(props) {
    return (
      <View style={styles.field}>
        <View
          style={{
            width: 30,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}
        >
          <Icon name={props.icon} size={20} color={main_color} />
        </View>
        <View>
          <Text style={{ color: '#ccc', fontSize: 13 }}>{props.title}</Text>
          <Text style={{ fontSize: 18 }}>{props.value}</Text>
        </View>
      </View>
    );
  }
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <View style={{ marginRight: 16 }}>
          <TouchableOpacity
            onPress={() => {
              if (isMe)
                navigation.navigate(navigationConstants.profileEdit, {
                  data: data,
                });
            }}
          >
            {isMe ? <Icon name={'edit'} size={24} color={'#fff'} /> : <Icon name={'edit'} size={24} color={main_color} />}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, data, isMe]);
  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View>
            <Image
              style={styles.imgCover}
              source={require('../../../assets/test.png')}
            />
          </View>
          <View style={styles.containerProfile}>
            <Image
              style={styles.imgBigAvatar}
              source={
                avatar == ''
                  ? require('../../../assets/test.png')
                  : { uri: avatar }
              }
            />
            {/* {isMe ? (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate(navigationConstants.profileEdit, {
                    data: data,
                  })
                }
                style={{
                  alignSelf: 'flex-end',
                  marginRight: 12,
                  marginTop: 12,
                }}
              >
                <View>
                  <Icon name={'edit'} size={30} />
                </View>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  alignSelf: 'flex-end',
                  marginRight: 12,
                  marginTop: 48,
                }}
              ></View>
            )} */}
            <Text
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                marginTop: 64,
                alignSelf: 'center',
              }}
            >
              {data ? data.first_name : null} {data ? data.last_name : null}
            </Text>
            <View style={styles.containerAmount}>
              <GroupAmount amount={data.post_count} title={'Bài đăng'} />
              <GroupAmount amount={data.followers} title={'Người theo dõi'} />
              <GroupAmount amount={data.followings} title={'Đang theo dõi'} />
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <Field icon={'id-card'} title={'ID'} value={data.oid} />
          <Field icon={'user'} title={'Họ'} value={data.first_name} />
          <Field icon={'signature'} title={'Tên'} value={data.last_name} />
          <Field
            icon={'birthday-cake'}
            title={'Ngày sinh'}
            value={moment(data.date_of_birth).format('DD-MM-YYYY')}
          />
          <Field icon={'mail-bulk'} title={'Email'} value={data.email} />
          <Field
            icon={'mobile-alt'}
            title={'Số điện thoại'}
            value={data.phone_number}
          />
          <Field
            icon={'location-arrow'}
            title={'Quận/Huyện'}
            value={data.address ? data.address.district : null}
          />
          <Field
            icon={'city'}
            title={'Thành phố'}
            value={data.address ? data.address.city : null}
          />
          <View
            style={{
              marginHorizontal: 10,
              marginVertical: 4,
              backgroundColor: '#fff',
              padding: 4,
              paddingHorizontal: 12,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'flex-start',
            }}
          >
            <View
              style={{
                width: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
                marginTop: 4,
              }}
            >
              <Icon name={'icons'} size={20} color={main_color} />
            </View>
            <View>
              <Text style={{ color: '#ccc', fontSize: 13, marginBottom: 4 }}>
                Lĩnh vực
              </Text>
              <View style={styles.containerTag}>
                {fields.length < 1 ? (
                  <Text>Chưa có thông tin</Text>
                ) : (
                  fields.map((item, index) => (
                    <TouchableOpacity key={index}>
                      <Badge
                        item={{
                          name: item.level_name,
                          description: item.field_name,
                        }}
                      />
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
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

export default ProfileDetail;
const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  alignItemCenter: {
    alignItems: 'center',
  },
  container: {
    flex: 1,

    backgroundColor: touch_color,
  },
  containerProfile: {
    backgroundColor: '#fff',
    margin: 8,
    marginTop: -56,
    paddingBottom: 12,
    borderRadius: 20,
  },
  containerAmount: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 8,
    marginBottom: 8,
    marginTop: 8,
  },
  txtAmount: {
    color: main_2nd_color,
    fontSize: 20,
    fontWeight: 'bold',
  },
  grInfor: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  imgCover: {
    width: '100%',
    height: 180,
  },
  txtTitleAmount: {
    fontSize: 16,
    color: main_color,
  },
  imgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: touch_color,
  },
  imgBigAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 0.5,
    borderColor: touch_color,
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
  },
  field: {
    marginHorizontal: 10,
    marginVertical: 4,
    backgroundColor: '#fff',
    padding: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerTag: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // marginBottom: 8,
    flexWrap: 'wrap',
    marginRight: 16,
  },
  btnTag: {
    backgroundColor: main_2nd_color,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 8,
  },
  txtTag: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  headerLeft: {
    marginLeft: 16,
  },
  headerRight: {
    marginRight: 12,
  },
});

// <Field icon={'city'} title={'Thành phố'} value={data.address.city} />
// <Field
//   icon={'map-marker-alt'}
//   title={'Địa chỉ'}
//   value={data.address.detail}
// />
