import React, { useEffect, useState } from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from 'actions/UserActions';
import Button from 'components/common/Button';
import styles from 'components/screen/Profile/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { color } from 'react-native-reanimated';
import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PostCard from '../../common/PostCard';
import axios from 'axios';
import { api } from 'constants/route';
import { getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import navigationConstants from 'constants/navigation';
import Toast from 'react-native-toast-message';
import storage from '@react-native-firebase/storage';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function GroupAmount(props) {
  return (
    <View style={styles.flex1}>
      <View style={styles.alignItemCenter}>
        <Text style={styles.txtAmount}>{props.amount}</Text>
        <Text style={styles.txtTitleAmount}>{props.title}</Text>
      </View>
    </View>
  );
}

function GroupInfor(props) {
  return (
    <View style={styles.grInfor}>
      <Icon name={props.icon} size={18} />
      <Text style={styles.txtInfor}>{props.name}</Text>
    </View>
  );
}
function GroupOption(props) {
  return (
    <View style={styles.flex1}>
      <TouchableHighlight
        underlayColor={touch_color}
        onPress={() => alert('option')}
      >
        <View style={styles.btnOption}>
          <Icon name={props.icon} size={22} color={main_color} />
          <Text style={styles.txtOption}>{props.option}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}
const user = {
  name: 'Nguyễn Văn Nam',
  follower: 20,
  following: 21,
  amountPost: 10,
  school: 'Đại học Công nghệ thông tin - ĐHQG TPHCM',
  specialized: 'Ngành kỹ thuật phần mềm',
  graduation: 'Đã tốt nghiệp',
};

function Profile({ userId }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(true);
  const curUser = useSelector(getUser);
  const [avatar, setAvatar] = useState('');
  const [bg, setBg] = useState();
  //loading
  const [refreshing, setRefreshing] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [skip, setSkip] = useState(0);
  const config = {
    headers: { Authorization: `Bearer ${curUser.jwtToken}` },
  };
  useEffect(() => {
    if (route.params?.update) {
      console.log(route.params.data);
      setIsLoading(true);
      ToastAndroid.show('Đang cập nhật ...', ToastAndroid.SHORT);
      if (route.params.update) {
        const postAPI = async () => {
          await axios
            .put(api + 'User/update', route.params.data, {
              headers: { Authorization: `Bearer ${curUser.jwtToken}` },
            })
            .then(res => {
              console.log(res.data.result);
              setData(res.data.result);
              setIsLoading(false);
            })
            .catch(error => alert(error));
        };
        postAPI();
      }
    } else console.log('update cc');
  }, [route.params?.update]);
  useEffect(() => {
    let isOut = false;

    const fetchData = async () => {
      await axios
        .get(api + 'User/current', config)
        .then(response => {
          if (isOut) return;
          setData(response.data.result);
          setAvatar(response.data.result.avatar.image_hash);
          axios
            .get(
              api +
                'Post/get/user/' +
                response.data.result.oid +
                '/skip/' +
                skip +
                '/count/5',
              config
            )
            .then(res => {
              if (isOut) return;

              setPosts([...posts, ...res.data.result]);
              setSkip(skip + 5);
              setIsLoading(false);
              setIsEnd(false);
            })
            .catch(error => alert(error));
        })
        .catch(error => alert(error));
    };
    fetchData();
    return () => {
      isOut = true;
    };
  }, [skip]);
  const renderItem = ({ item }) => {
    return <PostCard post={item} />;
  };
  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        const uri = image.path;
        const filename = 'avatar_' + curUser.id;
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
          .ref('avatar/' + filename)
          .putFile(uploadUri);
        // set progress state
        task.on('state_changed', snapshot => {
          console.log('uploading avatar..');
        });
        try {
          await task.then(async response => {
            await storage()
              .ref(response.metadata.fullPath)
              .getDownloadURL()
              .then(async url => {
                setAvatar(url);
                await axios
                  .post(
                    api + 'User/avatar/update',
                    { discription: '', avatar_hash: url },
                    config
                  )
                  .then(response => {
                    Toast.show({
                      type: 'success',
                      position: 'top',
                      text1: 'Ảnh đại diện đã được thay đổi.',
                      visibilityTime: 2000,
                    });
                  })
                  .catch(error => alert(error));
              });
          });
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  const uploadImage = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 0.5,
    }).then(async image => {
      if (image) {
        const uri = image.path;
        const filename = 'avatar_' + curUser.id;
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
          .ref('avatar/' + filename)
          .putFile(uploadUri);
        // set progress state
        task.on('state_changed', snapshot => {
          console.log(
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
          );
        });
        try {
          await task.then(response => console.log(response));
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  return (
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
          <TouchableOpacity
            onPress={() => pickImage()}
            style={{
              alignSelf: 'center',
              top: 24,
              left: deviceWidth / 2 + 12,
              position: 'absolute',
            }}
          >
            <View
              style={{
                backgroundColor: main_2nd_color,
                padding: 8,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Icon name={'edit'} size={20} color={'#fff'} />
            </View>
          </TouchableOpacity>
          <Text style={styles.txtName}>
            {data ? data.first_name : null} {data ? data.last_name : null}
          </Text>
          <View style={styles.containerAmount}>
            <GroupAmount
              amount={typeof data.posts === 'undefined' ? 0 : data.post_count}
              title={'Bài đăng'}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate(navigationConstants.follower)}
            >
              <GroupAmount amount={data.followers} title={'Người theo dõi'} />
            </TouchableOpacity>
            <GroupAmount amount={data.followings} title={'Đang theo dõi'} />
          </View>
          <GroupInfor name={user.school} icon={'school'} />
          <GroupInfor name={user.specialized} icon={'user-cog'} />
          <GroupInfor name={user.graduation} icon={'graduation-cap'} />
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(navigationConstants.profileDetail)
            }
          >
            <GroupInfor name={'Xem chi tiết thông tin'} icon={'ellipsis-h'} />
          </TouchableOpacity>
          <View style={styles.containerButton}>
            <TouchableHighlight
              style={styles.btnFollow}
              underlayColor={touch_color}
            >
              <Text style={styles.txtFollow}>Theo dõi</Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.btnFollow}
              underlayColor={touch_color}
              onPress={() => alert('â')}
            >
              <Text style={styles.txtFollow}>Nhắn tin</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.containerNew}>
          <View style={styles.grNew}>
            <View style={styles.flex1}>
              <Image
                style={styles.imgAvatar}
                source={require('../../../assets/avatar.jpeg')}
              />
            </View>
            <TouchableHighlight
              onPress={() => alert('new')}
              underlayColor={touch_color}
              style={styles.btnBoxNew}
            >
              <Text style={styles.txtNew}>
                Bạn có câu hỏi gì mới, {user.name}?
              </Text>
            </TouchableHighlight>
          </View>
          <View style={styles.grOption}>
            <GroupOption icon={'plus-circle'} option={'Lĩnh vực'} />
            <GroupOption icon={'square-root-alt'} option={'Công thức'} />
            <GroupOption icon={'images'} option={'Hình ảnh'} />
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <SafeAreaView>
          <FlatList
            style={{ flexGrow: 0 }}
            onEndReached={async () => {
              setIsEnd(true);
              if (refreshing) {
                setIsEnd(false);
                return;
              }
            }}
            onEndReachedThreshold={0.7}
            showsVerticalScrollIndicator={false}
            data={posts}
            renderItem={item => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
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
        </SafeAreaView>
      </View>
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
    </ScrollView>
  );
}

export default Profile;
