import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import TabBarIcon from 'components/common/TabBarIcon';
import Home from 'components/screen/Home';
import Profile from 'components/screen/Profile';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const BottomTab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

const {
  home,
  profile,
  create,
  list,
  notify,
  newsfeed,
  chat,
  post,
  conversation,
  comment,
} = navigationConstants;

function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={home} component={Home} />
    </Stack.Navigator>
  );
}

function NewsFeedNavigator({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={newsfeed}
        component={NewsFeed}
        options={{
          title: newsfeed,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <Image
                  style={styles.imgAvatar}
                  source={require('../assets/avatar.jpeg')}
                />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => alert('search is clicked')}>
                <Icon name={'search'} size={24} color={'#fff'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
function ChatNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={chat}
        component={Chat}
        options={{
          title: chat,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => alert('avatar is clicked')}>
                <Icon name={'search'} size={24} color={'#fff'} />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => alert('search is clicked')}>
                <Icon name={'edit'} size={24} color={'#fff'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
function NotifyNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={notify}
        component={Notify}
        options={{
          title: notify,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => alert('avatar is clicked')}>
                <Image
                  style={styles.imgAvatar}
                  source={require('../assets/avatar.jpeg')}
                />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableHighlight
                style={styles.btnRight}
                underlayColor={touch_color}
                onPress={() => alert('search is clicked')}
              >
                <Icon name={'ellipsis-h'} size={24} color={'#fff'} />
              </TouchableHighlight>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}
function ListPostNavigator({ navigation }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={list}
        component={ListPost}
        options={{
          title: list,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: 'center',
          },
          headerLeft: () => (
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => alert('click')}>
                <Image
                  style={styles.imgAvatar}
                  source={require('../assets/avatar.jpeg')}
                />
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={() => alert('search is clicked')}>
                <Icon name={'search'} size={24} color={'#fff'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator gestureEnabled={true} drawerContent={props=><DrawerContent {...props} />}>
      <Drawer.Screen name={'Tap'} component={Home} />
      <Drawer.Screen name={profile} component={Profile} />
    </Drawer.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      swipeEnabled={true}
      tabBarPosition={'bottom'}
      tabBarOptions={{
        activeTintColor: main_color,
        inactiveTintColor: '#c4c4c4',
        labelStyle: styles.labelText,
        showIcon: true,
        style: styles.tabBar,
        tabStyle: styles.tab,
        indicatorStyle: styles.indicator,
      }}
    >
      <Tab.Screen
        name={newsfeed}
        component={NewsFeedNavigator}
        options={{
          tabBarLabel: newsfeed,
          tabBarIcon: ({ color }) => (
            <View style={{ width: 100 }}>
              <Icon name="newspaper" color={color} size={24} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name={list}
        component={ListPostNavigator}
        options={{
          tabBarLabel: list,
          tabBarIcon: ({ color }) => (
            <Icon name="list-ul" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name={create}
        component={HomeNavigator}
        options={{
          tabBarLabel: create,
          tabBarIcon: ({ color }) => (
            <Icon name="plus-square" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name={chat}
        component={ChatNavigator}
        options={{
          tabBarLabel: chat,
          tabBarIcon: ({ color }) => (
            <Icon name="envelope" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name={notify}
        component={NotifyNavigator}
        options={{
          tabBarLabel: notify,
          tabBarIcon: ({ color }) => (
            <Icon name="bell" color={color} size={24} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
function AppNavigator() {
  return (
    <Drawer.Navigator initialRouteName={'bottom'} drawerContent={props=><DrawerContent {...props} />}>

      <Drawer.Screen
        name="bottom"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={profile}
        component={Profile}
        options={{
          title: profile,
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
      <Drawer.Screen
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
      <Drawer.Screen
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
      <Drawer.Screen
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
     
    </Drawer.Navigator>
 
  );
}
function AppNavigator1() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="bottom"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={profile}
        component={Profile}
        options={{
          title: profile,
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
