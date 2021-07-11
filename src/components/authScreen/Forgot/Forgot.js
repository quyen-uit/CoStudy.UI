import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { actionTypes, login } from 'actions/UserActions';
import Button from 'components/common/Button';
import ErrorView from 'components/common/ErrorView';
import TextField from 'components/common/TextField';
import styles from 'components/authScreen/Forgot/styles';
import ShadowStyles from 'helpers/ShadowStyles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import errorsSelector from 'selectors/ErrorSelectors';
import { isLoadingSelector } from 'selectors/StatusSelectors';
import navigationConstants from 'constants/navigation';
import axios from 'axios';
import { api } from 'constants/route';
import Loading from 'components/common/Loading';
import { main_color } from 'constants/colorCommon';
import { ToastAndroid } from 'react-native';
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';
function Forgot() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [key, setKey] = useState('');
  const [mail, setMail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isResend, setIsResend] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [isChange, setIsChange] = useState(false);
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [bodyAlert, setBodyAlert] = useState('');
  const errors = useSelector(
    state => errorsSelector([actionTypes.LOGIN], state),
    shallowEqual
  );
  const showAlert = (title, body) => {
    setBodyAlert(body);
    setVisibleAlert(true);
  };
  const handleSubmit = () => {
    if (!isChange || isResend) {
      setIsResend(false);

      if (mail == '') {
        showAlert('Thông báo', 'Vui lòng nhập email.');
        return;
      } else if (password.length < 6 || password2.length < 6) {
        showAlert('Thông báo', 'Vui lòng nhập mật khẩu ít nhất 6 kí tự.');
        return;
      } else if (password != password2) {
        showAlert(
          'Thông báo',
          'Mật khẩu không trùng khớp, vui lòng nhập lại'
        );
        return;
      }
      setIsLoading(true);
      axios
        .post(api + 'Accounts/forgot-password', { email: mail })
        .then(res => {
          //check response
          setIsChange(true);
          ToastAndroid.show(
            'Mã xác nhận đã được gửi tới email của bạn.',
            ToastAndroid.SHORT
          );
          setTimeout(() => {
            setIsResend(true);
          }, 15000);
          setIsLoading(false);
        })
        .catch(err => {
          showAlert('Thất bại', 'Có lỗi xảy ra, vui lòng thử lại sau.');
          setIsLoading(false);
        });
    } else {
      if (key == '') {
        showAlert('Thông báo', 'Bạn chưa nhập mã xác nhận.');
        return;
      }
      setIsLoading(true);
      axios
        .post(api + 'Accounts/reset-password', {
          token: key,
          password: password,
          confirmPassword: password2,
        })
        .then(res => {
          //check response
          dispatch(login(mail, password));
          ToastAndroid.show(
            'Bạn đã thay đổi mật khẩu thành công.',
            ToastAndroid.SHORT
          );
        })
        .catch(err => {
          showAlert('Thất bại', 'Mã xác thực không đúng, vui lòng nhập lại.');
          setIsLoading(false);
        });
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <View style={styles.container}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.imgLogo}
          />
          <View style={styles.formContainer}>
            {!isChange ? (
              <View style={{ alignSelf: 'stretch' }}>
                <TextField
                  onChangeText={setMail}
                  placeholder={'Nhập email'}
                  value={mail}
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
              </View>
            ) : (
              <View style={{ alignSelf: 'stretch' }}>
                <TextField
                  onChangeText={setKey}
                  placeholder={'Mã xác thực'}
                  value={key}
                  icon={'key'}
                />
                {isResend ? (
                  <TouchableOpacity onPress={() => handleSubmit()}>
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                      Bạn chưa nhận được mã xác thực? Gửi lại.
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            )}

            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => handleSubmit()}
            >
              {isChange ? (
                <Text style={styles.txtLogin}>{'Xác thực tài khoản'}</Text>
              ) : (
                <Text style={styles.txtLogin}>{'Nhận mã xác thực'}</Text>
              )}
            </TouchableOpacity>
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

export default Forgot;
