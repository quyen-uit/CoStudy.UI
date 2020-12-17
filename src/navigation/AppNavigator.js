import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, DrawerActions } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators  } from '@react-navigation/stack';
import React from 'react';
import TabBarIcon from 'components/common/TabBarIcon';
import Home from 'components/screen/Home';
import Profile from 'components/screen/Profile';
import ProfileDetail from 'components/screen/ProfileDetail';

import NewsFeed from 'components/screen/NewsFeed';
import Chat from 'components/screen/Chat';
import Notify from 'components/screen/Notify';
import ListPost from 'components/screen/ListPost';
import navigationConstants from 'constants/navigation';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { main_color, touch_color } from 'constants/colorCommon';
import { color } from 'react-native-reanimated';
import styles from 'navigation/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  
} from 'react-native';
import Post from 'components/screen/Post';
import Conversation from 'components/screen/Conversation';
import Comment from 'components/screen/Comment';
import { createDrawerNavigator, DrawerContent } from '@react-navigation/drawer';
import DrawerNavigator from './DrawerNavigator';
const Stack = createStackNavigator();


const {
  chat,
  post,
  profile,
  conversation,
  comment,
  drawerNav,
  profileDetail
} = navigationConstants;

function AppNavigator() {
  return (
    <Stack.Navigator 
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
    }}
    >
      <Stack.Screen
        name={drawerNav}
        component={DrawerNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
      name={profile}
      component={Profile}
      
      options={{
        
        title: profile,
        headerShown: true,
        headerStyle: {
          backgroundColor: main_color,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          alignSelf: 'center',
        },
     
        headerRight: () => (
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => alert('search is clicked')}>
              <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
            </TouchableOpacity>
          </View>
        ),
      }}
    />
    <Stack.Screen
    name={profileDetail}
    component={ProfileDetail}
    
    options={{
      
      title: profileDetail,
      headerShown: true,
      headerStyle: {
        backgroundColor: main_color,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        alignSelf: 'center',
      },
   
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => alert('search is clicked')}>
            <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
      ),
    }}
  />
      <Stack.Screen
        name={post}
        component={Post}
        options={{
          title: post,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },

          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => alert('search is clicked')}>
                <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name={conversation}
        component={Conversation}
        options={{
          title: conversation,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },

          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => alert('search is clicked')}>
                <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name={comment}
        component={Comment}
        options={{
          title: comment,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },

          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => alert('search is clicked')}>
                <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
