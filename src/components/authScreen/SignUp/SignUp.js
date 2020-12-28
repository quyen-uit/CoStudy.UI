import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Text,
  Image,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { actionTypes, login } from 'actions/UserActions';
import Button from 'components/common/Button';
import ErrorView from 'components/common/ErrorView';
import TextField from 'components/common/TextField';
import styles from 'components/authScreen/SignUp/styles';
import ShadowStyles from 'helpers/ShadowStyles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import errorsSelector from 'selectors/ErrorSelectors';
import { isLoadingSelector } from 'selectors/StatusSelectors';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { hint_color, main_2nd_color, main_color } from 'constants/colorCommon';
import moment from 'moment';
import navigationConstants from 'constants/navigation';
function SignUp() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const onNext = () => {
    if (first == '' || last == '') {
      Alert.alert('Thông báo', 'Vui lòng đầy đủ họ và tên.');
      return;
    }else 
    {
      navigation.navigate(navigationConstants.signup2, {first: first, last: last, dob: date, city: city, district: district})
    }
  };

  const handleSubmit = () => {
    dispatch(login(email, password));
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <View style={styles.container}>
        <Text style={styles.txtTitle}>{strings.signup}</Text>
        <View style={styles.formContainer}>
          <TextField
            accessibilityHint={strings.firstName}
            accessibilityLabel={strings.firstName.toLowerCase()}
            onChangeText={setFirst}
            placeholder={strings.firstName}
            value={first}
            icon={'user-check'}
          />
          <TextField
            accessibilityHint={strings.lastName}
            accessibilityLabel={strings.lastName}
            onChangeText={setLast}
            placeholder={strings.lastName}
            value={last}
            icon={'user-edit'}
          />
          <TouchableOpacity
            style={{
              alignSelf: 'stretch',
              marginHorizontal: 56,
              backgroundColor: '#fff',
              borderRadius: 32,
              justifyContent: 'center',
              marginVertical: 12,
            }}
            onPress={() => setShow(true)}
          >
            <Text
              style={{
                paddingRight: 16,
                paddingLeft: 48,
                fontSize: 16,
                color: '#000',
                marginVertical: 14,
              }}
            >
              {moment(date).format('DD-MM-YYYY')}
            </Text>
            <View style={{ paddingLeft: 12, position: 'absolute' }}>
              <Icon name={'birthday-cake'} size={22} color={main_2nd_color} />
            </View>
          </TouchableOpacity>
          <View style={styles.picker}>
            <RNPickerSelect
              onValueChange={value => setDistrict(value)}
              placeholder={{
                label: 'Quận/Huyện',
                value: '',
              }}
              style={{
                placeholder: { color: hint_color },
                inputAndroid: {
                  color: '#000',
                },
              }}
              items={[
                { label: 'Thủ đức', value: 'Thủ đức' },
                { label: 'Gò vấp', value: 'Gò vấp' },
                { label: 'Quận 12', value: 'Quận 12' },
              ]}
            />
            <View style={styles.icon}>
              <Icon name={'venus-mars'} size={22} color={main_2nd_color} />
            </View>
          </View>
          <View style={styles.picker}>
            <RNPickerSelect
              onValueChange={value => console.log(value)}
              style={{
                placeholder: { color: hint_color },
                inputAndroid: {
                  color: '#000',
                },
              }} 
              placeholder={{
                label: 'Thành phố',
                value: '',
              }}
              items={[
                { label: 'Hồ Chí Minh', value: 'Hồ Chí Minh' },
                
              ]}
            />
            <View style={styles.icon}>
              <Icon name={'venus-mars'} size={22} color={main_2nd_color} />
            </View>
          </View>
          <TouchableOpacity
            style={styles.btnSignUp}
            onPress={() => onNext()}
          >
            <Text style={styles.txtSignUp}>{strings.next}</Text>
          </TouchableOpacity>
        </View>

        <View></View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    </ScrollView>
  );
  // return (
  //   <View style={styles.container}>
  //     <View
  //       style={[
  //         styles.formContainer,
  //         ShadowStyles.shadow,
  //         { backgroundColor: colors.primary },
  //       ]}
  //     >
  //       <Text style={[TextStyles.fieldTitle, { color: colors.text }]}>
  //         {strings.email}
  //       </Text>
  //       <TextField
  //         accessibilityHint={strings.emailHint}
  //         accessibilityLabel={strings.email.toLowerCase()}
  //         onChangeText={setEmail}
  //         placeholder={strings.email}
  //         style={{ color: colors.text }}
  //         value={email}
  //       />
  //       <Text style={[TextStyles.fieldTitle, { color: colors.text }]}>
  //         {strings.password}
  //       </Text>
  //       <TextField
  //         secureTextEntry
  //         accessibilityHint={strings.passwordHint}
  //         accessibilityLabel={strings.password.toLowerCase()}
  //         onChangeText={setPassword}
  //         placeholder={strings.password}
  //         value={password}
  //         style={{ color: colors.text }}
  //       />
  //       <ErrorView errors={errors} />
  //       <Button
  //         onPress={handleSubmit}
  //         title={isLoading ? strings.loading : strings.login}
  //       />
  //     </View>
  //   </View>
  // );
}

export default SignUp;
