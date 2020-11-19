import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Text, View, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/DrawerContent/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import {DrawerContentScrollView, DrawerItemList} from '@react-navigation/drawer';
 
function DrawerContent() {
  const { colors } = useTheme();
  const user = useSelector(getUser);

  return (
    <View>
      
    </View>
  );
}

export default DrawerContent;
