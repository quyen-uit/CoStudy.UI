import { useTheme } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  SafeAreaView,
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
function Profile({userId}) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const renderItem = ({ item }) => {
    return <PostCard post={item} />;
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}>
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

          <Text style={styles.txtName}>{user.name}</Text>
          <View style={styles.containerAmount}>
            <GroupAmount amount={user.amountPost} title={'Bài đăng'} />
            <GroupAmount amount={user.follower} title={'Người theo dõi'} />
            <GroupAmount amount={user.following} title={'Đang theo dõi'} />
          </View>
          <GroupInfor name={user.school} icon={'school'} />
          <GroupInfor name={user.specialized} icon={'user-cog'} />
          <GroupInfor name={user.graduation} icon={'graduation-cap'} />
          <TouchableOpacity>
            <GroupInfor name={'Xem chi tiết thông tin'} icon={'ellipsis-h'} />
          </TouchableOpacity>
          <View style={styles.containerButton}>
            <TouchableHighlight style={styles.btnFollow} underlayColor={touch_color}>
                <Text style={styles.txtFollow}>Theo dõi</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.btnFollow} underlayColor={touch_color} onPress={()=>alert('â')}>
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
            data={list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      </View>
    </ScrollView>
  );
}

export default Profile;
