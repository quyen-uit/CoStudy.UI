import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
import { Text, Image, View, TouchableOpacity, ScrollView } from 'react-native';
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

function SignUp() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [date, setDate] = useState(new Date(1598051730000));
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };

  const showMode = currentMode => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };
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
        <Text style={styles.txtTitle}>{strings.signup}</Text>
        <View style={styles.formContainer}>
          <TextField
            accessibilityHint={strings.firstName}
            accessibilityLabel={strings.firstName.toLowerCase()}
            onChangeText={setEmail}
            placeholder={strings.firstName}
            value={email}
            icon={'user-check'}
          />
          <TextField
            accessibilityHint={strings.lastName}
            accessibilityLabel={strings.lastName}
            onChangeText={setPassword}
            placeholder={strings.lastName}
            value={password}
            icon={'user-edit'}
          />
          <TextField
            accessibilityHint={strings.dob}
            accessibilityLabel={strings.dob}
            onChangeText={setEmail}
            placeholder={strings.dob}
            value={password}
            icon={'calendar-alt'}
          />
          <View style={styles.picker}>
            <RNPickerSelect
              onValueChange={value => console.log(value)}
              placeholder={{
                label: strings.gender,
                value: null,
              }}
              style={{
                placeholder: { color: hint_color },
                inputAndroid: {
                  color: '#000',
                },
              }}
              items={[
                { label: strings.male, value: strings.male },
                { label: strings.female, value: strings.female },
                { label: strings.other, value: strings.other },
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
              items={[
                { label: 'Football', value: 'football' },
                { label: 'Baseball', value: 'baseball' },
                { label: 'Hockey', value: 'hockey' },
              ]}
            />
            <View style={styles.icon}>
              <Icon name={'venus-mars'} size={22} color={main_2nd_color} />
            </View>
          </View>
          <TouchableOpacity style={styles.btnSignUp}>
            <Text style={styles.txtSignUp}>{strings.next}</Text>
          </TouchableOpacity>
        </View>

        <View></View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
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
