import React, { useEffect } from 'react';
import { useColorScheme, LogBox, Image } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import Navigation from 'navigation';
import { DarkTheme, LightTheme } from 'helpers/Themes';
import { DARK } from 'constants/colorScheme';
import { persistor, store } from 'store';
import { PersistGate } from 'redux-persist/integration/react';
import { hide } from 'react-native-bootsplash';
import Toast, { BaseToast } from 'react-native-toast-message';

import Login from 'components/authScreen/Login';
import { main_color } from 'constants/colorCommon';
enableScreens();
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);
LogBox.ignoreLogs([
  'Animated.event now requires a second argument for options',
]);
LogBox.ignoreLogs(['Require cycle:']);

function App() {
  const scheme = useColorScheme();

  const hideSplashScreen = async () => {
    await hide({ fade: true });
  };

  useEffect(() => {
    persistor(hideSplashScreen);
  }, []);
  const toastConfig = {
    success: ({ text1, text2, ...rest }) => (
      <BaseToast
        {...rest}
        style={{ borderColor: main_color, marginTop: 10 }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1={text1}
        text2={text2}
        activeOpacity={0.5}
        leadingIcon={require('./assets/success-icon.png')}
      />
    ),
  };
  return (
    <Provider store={store}>
      <Navigation theme={scheme === DARK ? DarkTheme : LightTheme} />
      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
    </Provider>
  );
}

export default App;
