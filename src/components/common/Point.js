import React from 'react';
import PropTypes from 'prop-types';
import { Text, TouchableOpacity, StyleSheet, View, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

function Point(props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        style={{
          marginVertical: 2,
          fontSize: 14,
          color: typeof props.color == 'undefined' ? 'white' : props.color,
        }}
      >
        {props.point}{' '}
      </Text>
      <Icon
        name={'star'}
        size={12}
        color={typeof props.color == 'undefined' ? 'white' : props.color}
      />
    </View>
  );
}
export default Point;
