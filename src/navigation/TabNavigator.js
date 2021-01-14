import { useTheme, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import Home from 'components/screen/Home';
import Chat from 'components/screen/Chat';
import Notify from 'components/screen/Notify';
import ListPost from 'components/screen/ListPost';
import Create from 'components/screen/Create';
import NewsFeed from 'components/screen/NewsFeed';
import {
  useNavigation,
  StackActions,
  CommonActions,
  Vibration,
} from '@react-navigation/native';
import axios from 'axios';
import { api } from 'constants/route';
import { getUser } from 'selectors/UserSelectors';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import navigationConstants from 'constants/navigation';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { main_color, main_2nd_color, touch_color } from 'constants/colorCommon';
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
import { Badge } from 'react-native-elements';
import messaging from '@react-native-firebase/messaging';
import { getChatCount } from 'selectors/ChatSelectors';
import { actionTypes, increaseChat, setChat } from 'actions/ChatAction';
import { increaseNotify } from 'actions/NotifyAction';
import { getNotifyCount } from 'selectors/NotifySelectors';
const {
  home,
  create,
  list,
  notify,
  newsfeed,
  chat,
  search,
  tabNav,
} = navigationConstants;

const BottomTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();

function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={home} component={Home} />
    </Stack.Navigator>
  );
}

function NewsFeedNavigator({ navigation }) {
  const curUser = useSelector(getUser);
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
              <TouchableOpacity
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <Image
                  style={styles.imgAvatar}
                  source={{ uri: curUser.avatar.image_hash }}
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
  const navigation = useNavigation();
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
              <TouchableOpacity onPress={() => navigation.navigate(search)}>
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
  const curUser = useSelector(getUser);
  const navigation = useNavigation();
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
              <TouchableOpacity
                onPress={() =>
                  navigation.push(navigationConstants.profile, {
                    id: curUser.oid,
                  })
                }
              >
                <Image
                  style={styles.imgAvatar}
                  source={{ uri: curUser.avatar.image_hash }}
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
  const curUser = useSelector(getUser);

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
                  source={{ uri: curUser.avatar.image_hash }}
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

function TabNavigator() {
  const navigation = useNavigation();
  //const [countNotify, setCountNotify] = React.useState(0);
  //const [countChat, setCountChat] = React.useState(0);
  const countChat = useSelector(getChatCount);
  const countNotify = useSelector(getNotifyCount);
  const dispatch = useDispatch();
  const curUser = useSelector(getUser);

  useEffect(() => {
    console.log(countNotify);
  }, [countNotify]);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (
        typeof JSON.parse(
          JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
        ).notification != 'undefined'
      ) {
        if (
          JSON.parse(
            JSON.parse(
              JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
            ).notification
          ).AuthorId != curUser.oid
        ) {
          dispatch(increaseNotify());
        }
      } else if (
        typeof JSON.parse(
          JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
        ).message != 'undefined'
      )
        dispatch(increaseChat());
    });

    return unsubscribe;
  }, []);
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
      <BottomTab.Screen
        name={newsfeed}
        component={NewsFeed}
        options={{
          tabBarLabel: newsfeed,
          tabBarIcon: ({ color }) => (
            <View style={{ width: 100 }}>
              <Icon name="newspaper" color={color} size={24} />
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name={list}
        component={ListPost}
        options={{
          tabBarLabel: list,
          tabBarIcon: ({ color }) => (
            <Icon name="list-ul" color={color} size={24} />
          ),
        }}
      />
      <BottomTab.Screen
        name={home}
        component={HomeNavigator}
        listeners={{
          tabPress: e => {
            // Prevent default action
            navigation.dispatch(
              CommonActions.navigate({
                name: create,
                params: {},
              })
            );
          },
        }}
        options={navigation => ({
          unmountOnBlur: true,
          tabBarLabel: 'Đăng',

          tabBarIcon: ({ color }) => (
            <Icon
              name="plus-square"
              color={color}
              size={26}
              color={main_2nd_color}
            />
          ),
        })}
      />
      <BottomTab.Screen
        name={chat}
        component={ChatNavigator}
        options={{
          tabBarLabel: chat,
          tabBarIcon: ({ color }) => (
            <View>
              <Icon name="envelope" color={color} size={24} />
              {countChat.count > 0 ? (
                <Badge
                  status="success"
                  value={countChat.count}
                  containerStyle={styles.badge}
                />
              ) : null}
            </View>
          ),
        }}
      />
      <BottomTab.Screen
        name={notify}
        component={NotifyNavigator}
        options={{
          tabBarLabel: notify,
          tabBarIcon: ({ color }) => (
            <View>
              <Icon name="envelope" color={color} size={24} />
              {countNotify.count > 0 ? (
                <Badge
                  status="success"
                  value={countNotify.count}
                  containerStyle={styles.badge}
                />
              ) : null}
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
export default TabNavigator;
