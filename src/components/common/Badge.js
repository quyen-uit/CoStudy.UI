import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';

import {
  badge_level1,
  badge_level2,
  badge_level3,
  badge_level4,
  badge_level5,
  main_2nd_color,
  main_color,
  touch_color,
} from 'constants/colorCommon';
const styles = StyleSheet.create({
  // badge
  badgeContainer: {
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
  },
  badgeText: {
    fontSize: 14,
    textAlign: 'center',
    marginLeft: 4,
  },
  badgeSmallContainer: {
    borderWidth: 2,
    marginRight: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
  },
  badgeSmallText: {
    fontSize: 10,
    textAlign: 'center',
    marginLeft: 4,
  },
});

function Badge({ item }) {
  if (item.name == 'Level 1') {
    item.color = badge_level1;
    item.icon = require('../../assets/level1.png');
  } else if (item.name == 'Level 2') {
    item.color = badge_level2;
    item.icon = require('../../assets/level2.png');
  } else if (item.name == 'Level 3') {
    item.color = badge_level3;
    item.icon = require('../../assets/level3.png');
  } else if (item.name == 'Level 4') {
    item.color = badge_level4;
    item.icon = require('../../assets/level4.png');
  } else {
    item.color = badge_level5;
    item.icon = require('../../assets/level5.png');
  }
  return (
    <View
      style={
        typeof(item.userBadge) == 'undefined' ?
        {
        borderColor: item.color,
        ...styles.badgeContainer,
      } :
      {
        borderColor: '#b5b5b5',
        backgroundColor: '#f0f0f0',
        ...styles.badgeSmallContainer,
      }
    }
    >
      <Image style={ typeof(item.userBadge) == 'undefined' ?
      { width: 20, height: 24 } : {width: 14, height: 18}} source={item.icon} />
      <Text style={
         typeof(item.userBadge) == 'undefined' ?
         { color: item.color, ...styles.badgeText } :
         { color: '#6e6e6e', ...styles.badgeSmallText }}>
        {item.description}
      </Text>
    </View>
  );
}

export default Badge;
