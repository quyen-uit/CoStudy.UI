import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Login from 'components/authScreen/Login';
import SignUp from 'components/authScreen/SignUp';
import SignUp2 from 'components/authScreen/SignUp2';

import navigationConstants from 'constants/navigation';
import Verification from 'components/authScreen/Verification';
import PickField from 'components/screen/PickField';

const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Login}
        name={navigationConstants.login}
        options={{ headerShown: false }}
      />
      <Stack.Screen component={SignUp} name={navigationConstants.signup} />
      <Stack.Screen component={SignUp2} name={navigationConstants.signup2} />
      <Stack.Screen component={Verification} name={navigationConstants.verifyEmail} />
    </Stack.Navigator>
  );
}

export default AuthNavigator;
