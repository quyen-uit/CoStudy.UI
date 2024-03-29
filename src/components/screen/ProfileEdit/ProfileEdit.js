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

import {
  hint_color,
  main_2nd_color,
  main_color,
  touch_color,
} from 'constants/colorCommon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import RNPickerSelect from 'react-native-picker-select';
import { getJwtToken, getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import navigationConstants from 'constants/navigation';

import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
  ModalButton,
  ModalFooter,
} from 'react-native-modals';
import UserService from 'controllers/UserService';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function ProfileEdit({ userId }) {
  const route = useRoute();
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const jwtToken = useSelector(getJwtToken);
  const [firstname, setFirstname] = useState(route.params.data.first_name);
  const [lastname, setLastname] = useState(route.params.data.last_name);
  const [city, setCity] = useState(route.params.data.address.city);
  const [district, setDistrict] = useState(route.params.data.address.district);
  const [dob, setDOB] = useState(route.params.data.date_of_birth);
  const [phone, setPhone] = useState(route.params.data.phone_number);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [fields, setFields] = useState(route.params.data.fields);
  const [fieldPickers, setFieldPickers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [bodyAlert, setBodyAlert] = useState('');
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [school, setSchool] = useState(route.params.data.additional_infos[0].information_value);
  const [subject, setSubject] = useState(route.params.data.additional_infos[1].information_value);
  const showAlert = (title, body) => {
    setBodyAlert(body);
    setVisibleAlert(true);
  };
  const onChange = (event, selectedDate) => {
    setDOB(selectedDate || dob);

    setShowDatePicker(Platform.OS === 'ios');
  };
  const update = async () => {
    if (firstname == '' || lastname == '') {
      showAlert('Thông báo', 'Vui lòng nhập đầy đủ họ và tên.');
      return;
    } else if (district == '' || city == '') {
      showAlert('Thông báo', 'Vui lòng chọn thông tin nơi ở.');
      return;
    }

    // update field ???
    let temp = [];
    fieldPickers.forEach(i => {
      if (i.isPick) temp.push(i.oid);
    });
    //console.log(temp);
    navigation.navigate(navigationConstants.profile, {
      update: true,
      fields: temp,
      school: school,
      subject: subject,
      data: {
        first_name: firstname,
        last_name: lastname,
        date_of_birth: dob,
        address: { district: district, city: city },
        phone_number: phone,
      },
    });
  };

  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await UserService.getAllField(jwtToken)
        .then(response => {
          if (isRender) {
            response.data.result.forEach(element => {
              element.isPick = false;
              fields.forEach(i => {
                if (i.field_id == element.oid) element.isPick = true;
              });
            });
            setFieldPickers(response.data.result);
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

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
          <Text style={{ color: '#ccc', fontSize: 12 }}>{props.title}</Text>
          <Text style={{ fontSize: 18 }}>{props.value}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
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
              <Text style={{ color: '#ccc', fontSize: 12, marginLeft: 12 }}>
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
              <Text style={{ color: '#ccc', fontSize: 12, marginLeft: 8 }}>
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
              <Text style={{ color: '#ccc', fontSize: 12, marginLeft: 12 }}>
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
              <Icon name={'phone'} size={16} color={main_color} />
              <Text style={{ color: '#ccc', fontSize: 12, marginLeft: 12 }}>
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
              <Icon name={'school'} size={16} color={main_color} />
              <Text style={{ color: '#ccc', fontSize: 12, marginLeft: 12 }}>
                Trường
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
              value={school}
              onChangeText={text => setSchool(text)}
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
              <Icon name={'graduation-cap'} size={16} color={main_color} />
              <Text style={{ color: '#ccc', fontSize: 12, marginLeft: 12 }}>
                Chuyên ngành
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
              value={subject}
              onChangeText={text => setSubject(text)}
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
              <Icon name={'city'} size={16} color={main_color} />
              <Text style={{ color: '#ccc', fontSize: 12, marginLeft: 12 }}>
                Thành phố
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                marginLeft: 20,
                alignSelf: 'stretch',
                height: 36,
                fontSize: 18,
                backgroundColor: '#ccc',
                borderRadius: 8,
                marginVertical: 4,
              }}
            >
              <RNPickerSelect
                onValueChange={value => setCity(value)}
                style={{
                  placeholder: { color: hint_color },
                  inputAndroid: {
                    color: '#000',
                    margin: -8,
                  },
                }}
                placeholder={{
                  label: 'Thành phố',
                  value: '',
                }}
                value={city}
                items={[{ label: 'Hồ Chí Minh', value: 'Hồ Chí Minh' }]}
              />
            </View>
            {/* <TextInput
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
            /> */}
          </View>
          <View style={styles.editField}>
            <View
              style={{
                marginRight: 12,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Icon name={'compass'} size={16} color={main_color} />
              <Text style={{ color: '#ccc', fontSize: 12, marginLeft: 12 }}>
                Quận/Huyện
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                marginLeft: 20,
                alignSelf: 'stretch',
                height: 36,
                fontSize: 18,
                backgroundColor: '#ccc',
                borderRadius: 8,
                marginVertical: 4,
              }}
            >
              <RNPickerSelect
                onValueChange={value => setDistrict(value)}
                style={{
                  placeholder: { color: hint_color },
                  inputAndroid: {
                    color: '#000',
                    margin: -8,
                  },
                }}
                placeholder={{
                  label: 'Quận/Huyện',
                  value: '',
                }}
                value={district}
                items={[
                  { label: 'Thủ đức', value: 'Thủ đức' },
                  { label: 'Gò vấp', value: 'Gò vấp' },
                  { label: 'Quận 12', value: 'Quận 12' },
                ]}
              />
            </View>
            {/* <TextInput
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
            /> */}
          </View>
          <View style={styles.field}>
            <View
              style={{
                width: 30,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 12,
              }}
            >
              <Icon name={'city'} size={20} color={main_color} />
            </View>
            <View>
              <Text style={{ color: '#ccc', fontSize: 12 }}>Lĩnh vực</Text>
              <View style={styles.containerTag}>
                {fieldPickers.map((item, index) =>
                  item.isPick ? (
                    <TouchableOpacity
                      key={index}
                      onPress={() => alert('tag screen')}
                    >
                      <View style={styles.btnTag}>
                        <Text style={styles.txtTag}>{item.value}</Text>
                      </View>
                    </TouchableOpacity>
                  ) : null
                )}
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={{ paddingTop: 4 }}
                >
                  <Icon name={'plus-circle'} size={24} color={main_color} />
                </TouchableOpacity>
              </View>
            </View>
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
      <BottomModal
        visible={modalVisible}
        swipeDirection={['up', 'down']} // can be string or an array
        swipeThreshold={100} // default 100
        useNativeDriver={true}
        modalTitle={
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <Icon name={'grip-lines'} color={main_color} size={16} />
            <Text>Chọn lĩnh vực cho bài biết</Text>
          </View>
        }
        modalAnimation={
          new SlideAnimation({
            initialValue: 0, // optional
            slideFrom: 'bottom', // optional
            useNativeDriver: true, // optional
          })
        }
        onHardwareBackPress={() => {
          setModalVisible(false);
          return true;
        }}
        onTouchOutside={() => {
          setModalVisible(false);
        }}
        onSwipeOut={event => {
          setModalVisible(false);
        }}
      >
        <ModalContent style={{ marginHorizontal: -16 }}>
          <View>
            <View
              style={{ flexWrap: 'wrap', flexDirection: 'row', padding: 8 }}
            >
              {fieldPickers.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    item.isPick = item.isPick ? false : true;

                    setFieldPickers(fieldPickers.filter(item => item));
                  }}
                >
                  <View
                    style={{
                      backgroundColor: item.isPick ? main_2nd_color : '#ccc',
                      padding: 8,
                      borderRadius: 100,
                      margin: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: item.isPick ? '#fff' : main_2nd_color,
                        fontSize: 16,
                      }}
                    >
                      {item.value}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}
            >
              <View
                style={{
                  justifyContent: 'center',
                  backgroundColor: main_color,
                  marginHorizontal: 16,
                  marginBottom: -8,
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
                >
                  Xác nhận
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ModalContent>
      </BottomModal>
      <Modal
        visible={visibleAlert}
        width={deviceWidth - 56}
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ fontSize: 14, color: main_color }}
              text="Hủy"
              onPress={() => setVisibleAlert(false)}
            />
          </ModalFooter>
        }
      >
        <ModalContent>
          <View>
            <Text style={{ fontSize: 16, alignSelf: 'center' }}>
              {bodyAlert}
            </Text>
          </View>
        </ModalContent>
      </Modal>
    </View>
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
  containerTag: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 8,
    flexWrap: 'wrap',
    alignItems: 'center',
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
});

// <Field icon={'city'} title={'Thành phố'} value={data.address.city} />
// <Field
//   icon={'map-marker-alt'}
//   title={'Địa chỉ'}
//   value={data.address.detail}
// />
