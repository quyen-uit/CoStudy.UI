import { useTheme, useRoute, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Dimensions,
  Text,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { actionTypes, login } from 'actions/UserActions';
import Button from 'components/common/Button';
import ErrorView from 'components/common/ErrorView';
import TextField from 'components/common/TextField';
import styles from 'components/authScreen/SignUp2/styles';
import ShadowStyles from 'helpers/ShadowStyles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import errorsSelector from 'selectors/ErrorSelectors';
import { isLoadingSelector } from 'selectors/StatusSelectors';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { hint_color, main_2nd_color, main_color } from 'constants/colorCommon';
import axios from 'axios';
import { api } from 'constants/route';
import navigationConstants from 'constants/navigation';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function SignUp2() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  const [phone, setPhone] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const data = route.params;
  const handleSubmit = async () => {
    if (phone == '') {
      Alert.alert('Thông báo', 'Vui lòng nhập số điện thoại.');
      return;
    } else  if (email == '') {
      Alert.alert('Thông báo', 'Vui lòng nhập email.');
      return;
    } else  if (password.length < 6 || password2.length < 6) {
      Alert.alert('Thông báo', 'Vui lòng nhập mật khẩu ít nhất 6 kí tự.');
      return;
    } 
    else if (password != password2)
    {
      Alert.alert('Thông báo', 'Mật khẩu không trùng khớp, vui lòng nhập lại');
      return;
    }
    setIsLoading(true);
     
    await axios
      .post(api + 'User/register', {
        first_name: data.first,
        last_name: data.last,
        date_of_birth: data.dob,
        address: { city: data.city, district: data.district },
        email: email,
        phone_number: phone,
        password: password,
        confirmPassword: password,
        accept_term: true,
        title: 'title'
      })
      .then(res => {
       
        setIsLoading(false);
        navigation.navigate(navigationConstants.verifyEmail, {email: email, password: password});
      })
      .catch(err => {
        setIsLoading(false);
        Alert.alert('Đăng kí không thành công', err.message);
      });
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
            accessibilityHint={strings.dob}
            accessibilityLabel={strings.dob}
            onChangeText={setPhone}
            placeholder={strings.phoneNumber}
            value={phone}
            icon={'phone'}
          />
          <TextField
            accessibilityHint={strings.email}
            accessibilityLabel={strings.email.toLowerCase()}
            onChangeText={setEmail}
            placeholder={strings.email}
            value={email}
            icon={'envelope'}
          />
          <TextField
            accessibilityHint={strings.lastName}
            accessibilityLabel={strings.lastName}
            onChangeText={setPassword}
            placeholder={strings.password}
            value={password}
            icon={'unlock-alt'}
            secureTextEntry={true}

          />
          <TextField
          accessibilityHint={strings.lastName}
          accessibilityLabel={strings.lastName}
          onChangeText={setPassword2}
          placeholder={'Nhập lại mật khẩu'}
          value={password2}
          icon={'unlock'}
          secureTextEntry={true}

        />
          <TouchableOpacity
            style={styles.btnSignUp}
            onPress={() => handleSubmit()}
          >
            <Text style={styles.txtSignUp}>{strings.next}</Text>
          </TouchableOpacity>
        </View>
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

export default SignUp2;
