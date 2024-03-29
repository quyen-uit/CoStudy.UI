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
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';
import { ModalPortal } from 'react-native-modals';
import 'react-native-gesture-handler';
import Login from 'components/authScreen/Login';
import { main_color } from 'constants/colorCommon';
import { AuthService } from 'components/videocall/services';
import { Provider as PaperProvider } from 'react-native-paper';

enableScreens();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreLogs([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
]);
LogBox.ignoreLogs([
  'Animated.event now requires a second argument for options',
]);
LogBox.ignoreLogs(['Require cycle:']);
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
function App() {
  const scheme = useColorScheme();

  const hideSplashScreen = async () => {
    await hide({ fade: true });
  };
  // messaging()
  // .getToken()
  // .then(token => {
  //   console.log(token);
  // });
  // useEffect(() => {
  //   const unsubscribe = messaging().onMessage(async remoteMessage => {
  //     Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
  //     console.log(JSON.parse(JSON.stringify(remoteMessage)).data);
  //     console.log(JSON.parse(JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)).message)

  //    });

  //   return unsubscribe;
  // }, []);
  useEffect(() => {
    AuthService.init();
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
          <PaperProvider>

      <Navigation theme={LightTheme} />
      <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
      <ModalPortal />
      </PaperProvider>
    </Provider>
  );
}

export default App;
