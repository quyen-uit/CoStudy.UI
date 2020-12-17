import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView } from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { actionTypes, login } from 'actions/UserActions';
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

function Login() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();
  const isLoading = useSelector(state =>
    isLoadingSelector([actionTypes.LOGIN], state)
  );

  const errors = useSelector(
    state => errorsSelector([actionTypes.LOGIN], state),
    shallowEqual
  );

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
        <Image
          source={require('../../../assets/logo.png')}
          style={styles.imgLogo}
        />
        <View style={styles.formContainer}>
          <TextField
            accessibilityHint={strings.usernameHint}
            accessibilityLabel={strings.username.toLowerCase()}
            onChangeText={setEmail}
            placeholder={strings.username}
            value={email}
            icon={'user'}
          />
          <TextField
            accessibilityHint={strings.passwordHint}
            accessibilityLabel={strings.password}
            onChangeText={setEmail}
            placeholder={strings.password}
            style={{ color: colors.text }}
            value={password}
            icon={'lock'}
          />
          <TouchableOpacity style={styles.btnLogin} onPress={handleSubmit()}>
            <Text style={styles.txtLogin}>{strings.login}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.txtForgot}>{strings.forgotPassword} ?</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.otherContainer}>
            <TouchableOpacity>
              <Image source={require('../../../assets/fb.png')} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image source={require('../../../assets/google.png')} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationConstants.signup)}
          >
            <Text style={styles.txtFooter}>
              {strings.signupHint} {strings.signup}
            </Text>
          </TouchableOpacity>
        </View>
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

export default Login;
