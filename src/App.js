import React, { useEffect } from 'react';
import { useColorScheme, LogBox } from 'react-native';
import RNBootSplash from 'react-native-bootsplash';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import Navigation from 'navigation';
import { DarkTheme, LightTheme } from 'helpers/Themes';
import { DARK } from 'constants/colorScheme';
import { persistor, store } from 'store';
import Login from 'components/authScreen/Login';
enableScreens();
LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
LogBox.ignoreLogs(['Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`']);
LogBox.ignoreLogs(['Animated.event now requires a second argument for options']);
LogBox.ignoreLogs(["Require cycle:"]);

function App() {
  const scheme = useColorScheme();

  useEffect(() => {
    persistor(RNBootSplash.hide);
  }, []);
  useEffect(() => { 
    
}, []);

  return (
    <Provider store={store}>
        <Navigation theme={scheme === DARK ? DarkTheme : LightTheme} />
    </Provider>

  );
}

export default App;
