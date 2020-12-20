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
import { useTheme, useNavigation } from '@react-navigation/native';
import navigationConstants from 'constants/navigation';
import Toast from 'react-native-toast-message';

const user = {
  name: 'Nguyễn Văn Nam',
  follower: 20,
  following: 21,
  amountPost: 10,
  school: 'Đại học Công nghệ thông tin - ĐHQG TPHCM',
  specialized: 'Ngành kỹ thuật phần mềm',
  graduation: 'Đã tốt nghiệp',
};

const list = [
  {
    author_id: '5fcf41d2c02620814ace9b4d',
    comments: [],
    comments_countd: 0,
    created_date: '2020-12-15T05:23:10.437Z',
    downvote: 0,
    fields: [],
    id: {
      creationTime: '2020-12-15T05:23:10Z',
      increment: 15713706,
      machine: 3231656,
      pid: -28756,
      timestamp: 1608009790,
    },
    image_contents: [],
    modified_date: '2020-12-15T05:23:10.437Z',
    status: 0,
    string_contents: [[Object]],
    title: 'Lỗi khi nhập dữ liệu trong Mysql',
    upvote: 0,
  },
  {
    author_id: '5fcf41d2c02620814ace9b4d',
    comments: [],
    comments_countd: 0,
    created_date: '2020-12-15T05:23:34.763Z',
    downvote: 0,
    fields: [],
    id: {
      creationTime: '2020-12-15T05:23:34Z',
      increment: 15713821,
      machine: 3231656,
      pid: -28756,
      timestamp: 1608009814,
    },
    image_contents: [],
    modified_date: '2020-12-15T05:23:34.763Z',
    status: 0,
    string_contents: [[Object]],
    title: 'Hỏi về thuật toán lùa bò về chuồng',
    upvote: 0,
  },
];
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
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
function Profile({ userId }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const curUser = useSelector(getUser);
  const [avatar, setAvatar] = useState('');
  const config = {
    headers: { Authorization: `Bearer ${curUser.jwtToken}` },
  };
  const showToast = () => {
    ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
  };
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(api + 'User/current', config)
        .then(response => {
          setData(response.data.result);
          setAvatar(response.data.result.avatar.image_hash);

          axios
            .get(api + 'Post/get/user/' + response.data.result.user_id, config)
            .then(res => {
              setPosts(res.data.result.posts);
              

              setIsLoading(false);
            })
            .catch(error => alert(error));
        })
        .catch(error => alert(error));
    };
    fetchData();
  }, []);
  const renderItem = ({ item }) => {
    return <PostCard post={item} />;
  };
  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      mediaType: 'photo',
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0.5,
    }).then(async image => {
      if (image)
        await axios
          .post(
            api + 'User/avatar/update',
            { image: '', description: '', avatar_hash: image.data },
            config
          )
          .then(response => {
            Toast.show({
              type: 'success',
              position: 'bottom',
              text1: 'Ảnh đại diện đã được thay đổi.',
              visibilityTime: 2000,
            });
            setAvatar(image.data);
          })
          .catch(error => alert(error));
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
                : { uri: `data:image/gif;base64,${avatar}` }
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
                alignItems: 'center'
              }}
            >
              <Icon name={'edit'} size={20} color={'#fff'}/>
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
            <GroupAmount
              amount={
                typeof data.followers === 'undefined'
                  ? 0
                  : Object.keys(data.followers).length
              }
              title={'Người theo dõi'}
            />
            <GroupAmount
              amount={
                typeof data.followings === 'undefined'
                  ? 0
                  : Object.keys(data.followings).length
              }
              title={'Đang theo dõi'}
            />
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
            showsVerticalScrollIndicator={false}
            data={posts}
            renderItem={item => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
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
