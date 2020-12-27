import { useTheme, useRoute, useNavigation } from '@react-navigation/native';
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
  TextInput,
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
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import navigationConstants from 'constants/navigation';

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

function ProfileEdit({ userId }) {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const curUser = useSelector(getUser);
  const [firstname, setFirstname] = useState(route.params.data.first_name);
  const [lastname, setLastname] = useState(route.params.data.last_name);
  const [city, setCity] = useState(route.params.data.address.city);
  const [district, setDistrict] = useState(route.params.data.address.district);
  const [dob, setDOB] = useState(route.params.data.date_of_birth);
  const [phone, setPhone] = useState(route.params.data.phone_number);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const onChange = (event, selectedDate) => {
    setDOB(selectedDate || dob);
    setShowDatePicker(false);
  };
  const update = async () => {
    navigation.navigate(navigationConstants.profile, {
      update: true,
      data: {
        first_name: firstname,
        last_name: lastname,
        date_of_birth: dob,
        address: { district: district, city: city },
        phone_number: phone,
      },
    });
  };
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
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View style={styles.container}>
        <View style={{ marginTop: 8 }}></View>
        <Field icon={'id-card'} title={'ID'} value={route.params.data.oid} />
        <View style={styles.editField}>
          <View
            style={{
              marginRight: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Icon name={'user'} size={16} color={main_color} />
            <Text style={{ color: '#ccc', fontSize: 13, marginLeft: 12 }}>
              Họ
            </Text>
          </View>

          <TextInput
            multiline={true}
            maxLength={50}
            style={{
              alignSelf: 'stretch',
              paddingVertical: 4,
              fontSize: 18,
              backgroundColor: '#ccc',
              borderRadius: 8,
              marginVertical: 4,
              marginLeft: 20,
              paddingHorizontal: 8,
            }}
            value={firstname}
            onChangeText={text => setFirstname(text)}
          />
        </View>
        <View style={styles.editField}>
          <View
            style={{
              marginRight: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Icon name={'signature'} size={16} color={main_color} />
            <Text style={{ color: '#ccc', fontSize: 13, marginLeft: 8 }}>
              Tên
            </Text>
          </View>

          <TextInput
            multiline={true}
            maxLength={50}
            style={{
              alignSelf: 'stretch',
              paddingVertical: 4,
              fontSize: 18,
              backgroundColor: '#ccc',
              borderRadius: 8,
              marginVertical: 4,
              marginLeft: 20,
              paddingHorizontal: 8,
            }}
            value={lastname}
            onChangeText={text => setLastname(text)}
          />
        </View>

        <View style={styles.editField}>
          <View
            style={{
              marginRight: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Icon name={'birthday-cake'} size={16} color={main_color} />
            <Text style={{ color: '#ccc', fontSize: 13, marginLeft: 12 }}>
              Ngày sinh
            </Text>
          </View>

          <TouchableOpacity
            style={{
              alignSelf: 'stretch',
              paddingVertical: 4,

              backgroundColor: '#ccc',
              borderRadius: 8,
              marginVertical: 4,
              marginLeft: 20,
              paddingHorizontal: 8,
            }}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={{ fontSize: 18 }}>
              {moment(dob).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
        </View>

        <Field
          icon={'mail-bulk'}
          title={'Email'}
          value={route.params.data.email}
        />
        <View style={styles.editField}>
          <View
            style={{
              marginRight: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Icon name={'user'} size={16} color={main_color} />
            <Text style={{ color: '#ccc', fontSize: 13, marginLeft: 12 }}>
              Số điện thoại (10 số)
            </Text>
          </View>

          <TextInput
            multiline={true}
            maxLength={10}
            keyboardType="number-pad"
            style={{
              alignSelf: 'stretch',
              paddingVertical: 4,
              fontSize: 18,
              backgroundColor: '#ccc',
              borderRadius: 8,
              marginVertical: 4,
              marginLeft: 20,
              paddingHorizontal: 8,
            }}
            value={phone}
            onChangeText={text => {
              let numreg = /^[0-9]+$/;
              if (numreg.test(text)) {
                setPhone(text);
              }
            }}
          />
        </View>
        <View style={styles.editField}>
          <View
            style={{
              marginRight: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Icon name={'user'} size={16} color={main_color} />
            <Text style={{ color: '#ccc', fontSize: 13, marginLeft: 12 }}>
              Quận/Huyện
            </Text>
          </View>

          <TextInput
            multiline={true}
            maxLength={50}
            style={{
              alignSelf: 'stretch',
              paddingVertical: 4,
              fontSize: 18,
              backgroundColor: '#ccc',
              borderRadius: 8,
              marginVertical: 4,
              marginLeft: 20,
              paddingHorizontal: 8,
            }}
            value={district}
            onChangeText={text => setDistrict(text)}
          />
        </View>
        <View style={styles.editField}>
          <View
            style={{
              marginRight: 12,
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Icon name={'user'} size={16} color={main_color} />
            <Text style={{ color: '#ccc', fontSize: 13, marginLeft: 12 }}>
              Thành phố
            </Text>
          </View>

          <TextInput
            multiline={true}
            maxLength={50}
            style={{
              alignSelf: 'stretch',
              paddingVertical: 4,
              fontSize: 18,
              backgroundColor: '#ccc',
              borderRadius: 8,
              marginVertical: 4,
              marginLeft: 20,
              paddingHorizontal: 8,
            }}
            value={city}
            onChangeText={text => setCity(text)}
          />
        </View>
        <TouchableOpacity onPress={() => update()}>
          <View
            style={{
              justifyContent: 'center',
              backgroundColor: main_2nd_color,
              marginHorizontal: 14,
              alignItems: 'center',
              paddingVertical: 8,
              marginVertical: 8,
              borderRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>
              Chỉnh sửa
            </Text>
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(2000, 0, 1)}
            mode={'date'}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </ScrollView>
  );
}

export default ProfileEdit;
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
  editField: {
    marginHorizontal: 10,
    marginVertical: 4,
    backgroundColor: '#fff',
    padding: 4,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
});

// <Field icon={'city'} title={'Thành phố'} value={data.address.city} />
// <Field
//   icon={'map-marker-alt'}
//   title={'Địa chỉ'}
//   value={data.address.detail}
// />
