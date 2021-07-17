import React, { useEffect } from 'react';
import {
  useColorScheme,
  LogBox,
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';
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
import Video from 'react-native-video';

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
    // <View style={{ flex: 1 }}>
    //   <Video
    //     source={{
    //       uri:
    //         'https://firebasestorage.googleapis.com/v0/b/costudy-c5390.appspot.com/o/test%2Fvideo.mp4?alt=media&token=8ec461c7-b521-4e30-b523-e33c804f2829',
    //     }} // Can be a URL or a local file.
    //     ref={ref => {
    //       this.player = ref;
    //     }} // Store reference
    //     fullscreen={true}
    //     onBuffer={this.onBuffer} // Callback when remote video is buffering
    //     onError={this.videoError} // Callback when video cannot be loaded
    //     resizeMode={'contain'}
    //     paused={true}
    //     style={styles.backgroundVideo}
    //   />
    // </View>
  );
}

// Later on in your styles..
var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
export default App;
