import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, DrawerActions } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import React from 'react';
import TabBarIcon from 'components/common/TabBarIcon';
import Home from 'components/screen/Home';
import Profile from 'components/screen/Profile';
import ProfileDetail from 'components/screen/ProfileDetail';
import ProfileEdit from 'components/screen/ProfileEdit';

import Create from 'components/screen/Create';
import VideoScreen from 'components/videocall/components/VideoScreen';

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
import Follower from 'components/screen/Follower';
import Following from 'components/screen/Following';

import Search from 'components/screen/Search';
import ListField from 'components/screen/ListField';
import PickField from 'components/screen/PickField';
import Report from 'components/screen/Report';
import Ranking from 'components/screen/Ranking';
import UserNearBy from 'components/screen/UserNearBy';
import HelpPost from 'components/screen/HelpPost';
import VideoPlayer from 'components/screen/VideoPlayer';
const Stack = createStackNavigator();

const {
  chat,
  post,
  profile,
  conversation,
  following,
  comment,
  drawerNav,
  search,
  profileDetail,
  profileEdit,
  follower,
  create,
  listField,
  pickField,
  report,
  video,
  ranking,
  nearby,
  helpPost,
  videoPlayer
} = navigationConstants;

function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
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
        name={listField}
        component={ListField}
        options={{
          title: listField,
          headerShown: true,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },
        }}
      />
      <Stack.Screen
        name={nearby}
        component={UserNearBy}
        options={{
          title: nearby,
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
              <TouchableOpacity >
                <Icon name={'ellipsis-h'} size={24} color={main_color} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name={pickField}
        component={PickField}
        options={{
          title: pickField,
          headerShown: true,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },
        }}
      />
      <Stack.Screen
        name={report}
        component={Report}
        options={{
          title: report,
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
              <TouchableOpacity>
                <Icon name={'ellipsis-h'} size={24} color={main_color} />
              </TouchableOpacity>
            </View>
          ),
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
        }}
      />
      <Stack.Screen
        name={search}
        component={Search}
        options={{
          title: search,
          headerShown: false,
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
        name={profileEdit}
        component={ProfileEdit}
        options={{
          title: profileEdit,
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
        name={videoPlayer}
        component={VideoPlayer}
        options={{
          title: videoPlayer,
          headerShown: false,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },

          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity>
                <Icon name={'ellipsis-h'} size={24} color={main_color} />
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
        }}
      />
      <Stack.Screen
        name={conversation}
        component={Conversation}
        options={({ route }) => ({
          title: route.params.name,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },

          // headerRight: () => (
          //   <View style={styles.headerRight}>
          //     <TouchableOpacity onPress={() => alert('search is clicked')}>
          //       <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
          //     </TouchableOpacity>
          //   </View>
          // ),
        })}
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
              <TouchableOpacity>
                <Icon name={'ellipsis-h'} size={24} color={main_color} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name={follower}
        component={Follower}
        options={{
          title: follower,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },

          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity>
                <Icon name={'ellipsis-h'} size={24} color={main_color} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name={following}
        component={Following}
        options={{
          title: following,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },

          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity>
                <Icon name={'ellipsis-h'} size={24} color={main_color} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name={helpPost}
        component={HelpPost}
        options={{
          title: helpPost,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },

          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity>
                <Icon name={'ellipsis-h'} size={24} color={main_color} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name={ranking}
        component={Ranking}
        options={{
          //title: ranking,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },

          // headerRight: () => (
          //   <View style={styles.headerRight}>
          //     <TouchableOpacity onPress={() => alert('search is clicked')}>
          //       <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
          //     </TouchableOpacity>
          //   </View>
          // ),
        }}
      />
      <Stack.Screen
        name={video}
        component={VideoScreen}
        options={{
          title: video,
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
        name={create}
        component={Create}
        options={{
          title: create,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
        }}
      />
    </Stack.Navigator>
  );
}
export default AppNavigator;
