import { Drawer } from 'react-native-paper';
import { useTheme, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { Text, Image, View, FlatList, LogBox } from 'react-native';
import styles from 'components/DrawerContent/styles';
import TextStyles from 'helpers/TextStyles';
import axios from 'axios';
import { api } from 'constants/route';
import { getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { main_color, main_2nd_color } from '../../constants/colorCommon';
import navigationConstants from '../../constants/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '../../actions/UserActions';
import { actionTypes, increaseChat, setChat } from 'actions/ChatAction';

const { tabNav, profile, field, home, help, setting, ranking } = navigationConstants;
function ItemDrawer({ icon, route }) {
  const navigation = useNavigation();

  return (
    <DrawerItem
      icon={() => <Icon name={icon} color={main_color} size={28} />}
      label={route}
      labelStyle={styles.label}
      onPress={() => {
         navigation.navigate(route);
      }}
    />
  );
}
function DrawerContent(props) {
  const dispatch = useDispatch();
  const curUser = useSelector(getUser);
  const logoutUser = () => {
    dispatch(logout(curUser.jwtToken));
    dispatch(setChat(0));
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={styles.header}>
              <Image
                source={{ uri: curUser.avatar.image_hash }}
                style={styles.imgAvatar}
              />
              <View style={styles.childHeader}>
                <Text style={styles.title}>
                  {curUser.first_name} {curUser.last_name}
                </Text>
                <View style={styles.row}>
                  <View style={styles.section}>
                    <Text style={styles.number}>{curUser.followings}</Text>
                    <Text style={styles.caption}>Đang theo dõi</Text>
                  </View>
                  <View style={styles.section}>
                    <Text style={styles.number}>{curUser.followers}</Text>
                    <Text style={styles.caption}>Theo dõi</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={() => <Icon name="home" color={main_color} size={24} />}
              labelStyle={styles.label}
              label={home}
             />
            <ItemDrawer icon={'user-circle'} route={profile} />
            <ItemDrawer icon={'trophy'} route={ranking} />
            <ItemDrawer icon={'cog'} route={setting} />
            <ItemDrawer icon={'question-circle'} route={help} />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="sign-out-alt" color={main_2nd_color} size={size} />
          )}
          label="Sign Out"
          onPress={() => logoutUser()}
        />
      </Drawer.Section>
    </View>
  );
}

export default DrawerContent;
