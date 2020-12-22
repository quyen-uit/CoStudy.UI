import { useTheme, DrawerActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Home from 'components/screen/Home';
import Chat from 'components/screen/Chat';
import Notify from 'components/screen/Notify';
import ListPost from 'components/screen/ListPost';
import Create from 'components/screen/Create';
import NewsFeed from 'components/screen/NewsFeed';
import { useNavigation, StackActions,CommonActions } from '@react-navigation/native';

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
import { Badge } from 'react-native-elements';

const { home, create, list, notify, newsfeed, chat,tabNav } = navigationConstants;

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

function TabNavigator() {
  const navigation = useNavigation();

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
      <BottomTab.Screen
        name={list}
        component={ListPostNavigator}
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
          tabBarLabel: home,
          tabBarIcon: ({ color }) => (
            <Icon name="plus-square" color={color} size={26} />
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
              <Badge status="success" value="1" containerStyle={styles.badge} />
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
              <Icon name="bell" color={color} size={24} />
              <Badge status="success" value="1" containerStyle={styles.badge} />
            </View>
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}
export default TabNavigator;
