import PropTypes from 'prop-types';
import React from 'react';
import { Image, ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import homeIcon from 'assets/ic_home/ic_home.png';
import settingsIcon from 'assets/ic_settings/ic_settings.png';
import navigationConstants from 'constants/navigation';
import {main_color} from 'constants/colorCommon';
const tabIcon = {
  [navigationConstants.home]: homeIcon,
  [navigationConstants.profile]: settingsIcon,
};

function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={'#fff'} animating={true} size="large" />

      <Text style={styles.loadingText}>Chờ tí ...</Text>
    </View>
  );
}

export default Loading;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: main_color
  },
  loadingText: {
    fontSize: 16,
    marginTop: 4,
    color: '#fff',
    fontWeight: 'bold'
  }
});
