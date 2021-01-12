import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Profile from 'components/screen/Profile';
import navigationConstants from 'constants/navigation';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { main_color, touch_color } from 'constants/colorCommon';
import { color } from 'react-native-reanimated';
import styles from 'navigation/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { View, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../components/DrawerContent';
import TabNavigator from 'navigation/TabNavigator';
import Home from 'components/screen/Home';
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const { profile, home, tabNav, follower } = navigationConstants;

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName={'bottom'}
      drawerContent={props => <DrawerContent {...props} />}
    >
      <Drawer.Screen name={tabNav} component={TabNavigator} />
     </Drawer.Navigator>
  );
}

export default DrawerNavigator;
