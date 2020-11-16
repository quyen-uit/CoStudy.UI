import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import TabBarIcon from 'components/common/TabBarIcon';
import Home from 'components/screen/Home';
import Profile from 'components/Profile';
import NewsFeed from 'components/screen/NewsFeed';
import Chat from 'components/screen/Chat';
import Notify from 'components/screen/Notify';
import ListPost from 'components/screen/ListPost';
import navigationConstants from 'constants/navigation';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {main_color} from 'constants/colorCommon';
import { color } from 'react-native-reanimated';
import styles from 'navigation/styles';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {Text, View, Button, Image, TouchableOpacity} from 'react-native';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const BottomTab = createMaterialTopTabNavigator();

const { home, profile, create, list, notify, newsfeed, chat} = navigationConstants;

function HomeNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={home} component={Home} />
    </Stack.Navigator>
  );
}
function NewsFeedNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name={newsfeed}   
        component={NewsFeed} 
        options = {{
          title: newsfeed,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: "center"
          },
          headerLeft: () =>(
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={()=> alert('avatar is clicked')}>
                <Image style={styles.imgAvatar} source={require('../assets/avatar.jpeg')}/>
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
               <TouchableOpacity onPress={()=>alert('search is clicked')}>
                <Icon name={'search'} size={24} color={'#fff'}/>
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
        options = {{
          title: chat,
          headerStyle: {
            backgroundColor: main_color,
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            alignSelf: "center"
          },
          headerLeft: () =>(
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={()=> alert('avatar is clicked')}>
              <Icon name={'search'} size={24} color={'#fff'}/>
              </TouchableOpacity>
            </View>
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
               <TouchableOpacity onPress={()=>alert('search is clicked')}>
                <Icon name={'edit'} size={24} color={'#fff'}/>
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
      <Stack.Screen name={notify} component={Notify} />
    </Stack.Navigator>
  );
}
function ListPostNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={list} component={ListPost} />
    </Stack.Navigator>
  );
}
function ProfileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={profile} component={Profile} />
    </Stack.Navigator>
  );
}

function AppNavigator1() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route: { name } }) => ({
        tabBarIcon: ({ color }) => <TabBarIcon color={color} name={name} />,
      })}
      tabBarOptions={{
        activeTintColor: colors.activeTab,
        inactiveTintColor: colors.inactiveTab,
      }}
    >
      <Tab.Screen name={home} component={HomeNavigator} />
      <Tab.Screen name={profile} component={ProfileNavigator} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    <BottomTab.Navigator 
        swipeEnabled = {true}
        
        tabBarPosition =  {'bottom'}
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

        options = {{
          tabBarLabel: newsfeed,
          tabBarIcon: ({ color }) => (
            <View style={{width: 100}}>
              <Icon name="newspaper" color={color} size={24}/>
            </View>
          ),
         
        }} />
      <Tab.Screen 
        name={list} 
        component={ListPostNavigator} 
        options = {{
          tabBarLabel:
            list
          ,
          tabBarIcon: ({ color }) => (
            <Icon name="list-ul" color={color} size={24} />
          ),
        }}/>
      <Tab.Screen 
        name={create} 
        component={HomeNavigator} 
        options = {{
          tabBarLabel: create
          ,
          tabBarIcon: ({ color }) => (
            <Icon name="plus-square" color={color} size={26} />
          ),
        }}/>
      <Tab.Screen 
        name={chat} 
        component={ChatNavigator}
        options = {{
          tabBarLabel:
            chat
          ,
          tabBarIcon: ({ color }) => (
            <Icon name="envelope" color={color} size={24} />
          ),
        }}/>
      <Tab.Screen 
        name={notify} 
        component={NotifyNavigator} 
        options = {{
          tabBarLabel:
            notify
          ,
          tabBarIcon: ({ color }) => (
            <Icon name="bell" color={color} size={24} />
          ),
        }}/>

    </BottomTab.Navigator>
  );
}
export default AppNavigator;

