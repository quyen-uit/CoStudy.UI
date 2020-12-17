import { useTheme } from '@react-navigation/native';
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
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { logout } from 'actions/UserActions';
import Button from 'components/common/Button';
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
    id: '1',
    title: 'Đây là title 1',
    author: 'Nguyễn Văn Nam',
    content:
      'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    createdDate: '10 phut truoc',
  },
  {
    id: '2',
    title: 'Đây là title',
    author: 'Nguyễn Văn Nam',
    content:
      'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    createdDate: '10 phut truoc',
  },
  {
    title: 'Đây là title 2',
    author: 'Nguyễn Văn Nam',
    content:
      'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    createdDate: '10 phut truoc',
    id: '3',
  },
];
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function ProfileDetail({ userId }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const curUser = useSelector(getUser);
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${curUser.jwtToken}` },
    };
    const fetchData = async () => {
      await axios
        .get(api + 'User/current', config)
        .then(response => {
          setData(response.data.result);
          console.log(data);
          setIsLoading(false);
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
      height: 400,
      cropping: true,
    }).then(image => {
      const options = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${curUser.jwtToken}`,
        },
      };

      const form_data = new FormData();
      form_data.append('Image', {
        uri: image.path,
        name: 'avatar_' + data.user_id,
        type: image.mime,
      });
      form_data.append('Description', 'a');
      console.log(form_data);
      axios
        .post(api + 'User/avatar', form_data, options)
        .then(response => alert(response))
        .catch(error => alert(error));
    });
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
            source={require('../../../assets/avatar.jpeg')}
          />
          <TouchableOpacity
            onPress={() => pickImage()}
            style={{
              alignSelf: 'center',
              top: 30,
              left: deviceWidth / 2 + 24,
              position: 'absolute',
            }}
          >
            <View>
              <Icon name={'edit'} size={24} />
            </View>
          </TouchableOpacity>

          <View style={styles.containerAmount}>
            <GroupAmount amount={data.post_count} title={'Bài đăng'} />
            <GroupAmount amount={0} title={'Người theo dõi'} />
            <GroupAmount amount={0} title={'Đang theo dõi'} />
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <Field icon={'id-card'} title={'ID'} value={data.user_id} />
        <Field icon={'user'} title={'Họ'} value={data.first_name} />
        <Field icon={'signature'} title={'Tên'} value={data.last_name} />
        <Field
          icon={'birthday-cake'}
          title={'Ngày sinh'}
          value={data.date_of_birth}
        />
        <Field icon={'mail-bulk'} title={'Email'} value={data.email} />
        <Field
          icon={'mobile-alt'}
          title={'Số điện thoại'}
          value={data.phone_number}
        />
      
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
    marginTop: 80,
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
});

// <Field icon={'city'} title={'Thành phố'} value={data.address.city} />
// <Field
//   icon={'map-marker-alt'}
//   title={'Địa chỉ'}
//   value={data.address.detail}
// />