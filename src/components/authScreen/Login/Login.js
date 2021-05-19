import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { actionTypes, login, loginGoogle } from 'actions/UserActions';
import Button from 'components/common/Button';
import ErrorView from 'components/common/ErrorView';
import TextField from 'components/common/TextField';
import styles from 'components/authScreen/Login/styles';
import ShadowStyles from 'helpers/ShadowStyles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import errorsSelector from 'selectors/ErrorSelectors';
import { isLoadingSelector } from 'selectors/StatusSelectors';
import navigationConstants from 'constants/navigation';
import axios from 'axios';
import Loading from 'components/common/Loading';
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { main_color } from 'constants/colorCommon';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
GoogleSignin.configure();

function Login() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [bodyAlert, setBodyAlert] = useState('');

  const [titleAlert, setTitleAlert] = useState('');
  const navigation = useNavigation();
  const isLoading = useSelector(state =>
    isLoadingSelector([actionTypes.LOGIN], state)
  );
  const showAlert = (title, body) => {
    setBodyAlert(body);
    setVisibleAlert(true);
  };
  // Somewhere in your code
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfoGG = await GoogleSignin.signIn();
      setUserInfo(userInfoGG);
      dispatch(loginGoogle(userInfoGG));
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('cancel');
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('in progress');
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        alert('play services not available');
        // play services not available or outdated
      } else {
        console.log(error);
        // some other error happened
      }
    }
  };

  const errors = useSelector(
    state => errorsSelector([actionTypes.LOGIN], state),
    shallowEqual
  );

  const handleSubmit = () => {
    
    if (email === '')
      //Alert.alert('Thông báo', 'Vui lòng nhập email.');
      showAlert('Thông báo', 'Vui lòng nhập email.');
    else if (password === '')
      // Alert.alert('Thông báo', 'Vui lòng nhập mật khẩu.');
      showAlert('Thông báo', 'Vui lòng nhập mật khẩu.');

    else dispatch(login(email, password));
    
  };
  return (
    <View style={{ flex: 1 }}>
      {isLoading ? (
        <Loading />
      ) : (
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
              <TextField
                accessibilityHint={strings.emailHint}
                accessibilityLabel={strings.email.toLowerCase()}
                onChangeText={setEmail}
                placeholder={strings.username}
                value={email}
                icon={'user'}
              />
              <TextField
                accessibilityHint={strings.passwordHint}
                accessibilityLabel={strings.password}
                onChangeText={setPassword}
                placeholder={strings.password}
                style={{ color: colors.text }}
                value={password}
                icon={'lock'}
                secureTextEntry={true}
              />
              <TouchableOpacity
                style={styles.btnLogin}
                onPress={() => handleSubmit()}
              >
                <Text style={styles.txtLogin}>{strings.login}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate(navigationConstants.forgot)}
              >
                <Text style={styles.txtForgot}>{strings.forgotPassword} ?</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ justifyContent: 'space-around', alignItems: 'center' }}
            >
              <GoogleSigninButton
                style={{}}
                size={GoogleSigninButton.Size.Standard}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
                //disabled={this.state.isSigninInProgress}
              />
              <View style={styles.otherContainer}>
                {/* <TouchableOpacity>
                  <Image source={require('../../../assets/fb.png')} />
                </TouchableOpacity> */}
                {/* <TouchableOpacity onPress={() => signIn()}>
                  <Image source={require('../../../assets/google.png')} />
                </TouchableOpacity> */}
              </View>
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={() => navigation.navigate(navigationConstants.signup)}
              >
                <Text style={styles.txtFooter}>
                  {strings.signupHint} {strings.signup}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
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

export default Login;
