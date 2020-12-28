import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { actionTypes, login } from 'actions/UserActions';
import Button from 'components/common/Button';
import ErrorView from 'components/common/ErrorView';
import TextField from 'components/common/TextField';
import styles from 'components/authScreen/Verification/styles';
import ShadowStyles from 'helpers/ShadowStyles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import errorsSelector from 'selectors/ErrorSelectors';
import { isLoadingSelector } from 'selectors/StatusSelectors';
import navigationConstants from 'constants/navigation';
import axios from 'axios';
import Loading from 'components/common/Loading';
function Verification() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [key, setKey] = useState('');
  const route = useRoute();
  const navigation = useNavigation();

  const errors = useSelector(
    state => errorsSelector([actionTypes.LOGIN], state),
    shallowEqual
  );

  const handleSubmit = () => {
    axios
      .post(api + 'Account/verify-email', token)
      .then(res => {
        //check response
        dispatch(login(route.params.email, route.params.password));
      })
      .catch(err => alert(err));
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
            <TextField
              onChangeText={setKey}
              placeholder={'Mã xác thực'}
              value={key}
              icon={'key'}
            />

            <TouchableOpacity
              style={styles.btnLogin}
              onPress={() => handleSubmit()}
            >
              <Text style={styles.txtLogin}>{'Xác thực tài khoản'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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

export default Verification;
