import { useNavigation, useRoute } from '@react-navigation/native';
import { main_color } from 'constants/colorCommon';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  useColorScheme,
  LogBox,
  Image,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Video from 'react-native-video';

function VideoPlayer() {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {}, []);
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height;
  return (
    <View style={{ flex: 1 }}>
      <Video
        source={{
          uri: route.params.video,
        }} // Can be a URL or a local file.
       
        controls
        fullscreen={true}
        onLoad={() => setIsLoading(false)} // Callback when remote video is buffering
        onError={() => alert('Video error.')} // Callback when video cannot be loaded
        resizeMode={'contain'}
        fullscreen={true}
        style={styles.backgroundVideo}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          opacity: 0.5,
          borderRadius: 20,
        }}
        onPress={() => navigation.goBack()}
      >
        <Icon name={'times-circle'} size={30} color={'#ccc'} />
      </TouchableOpacity>
      {isLoading ? (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            opacity: 0.5,
            width: deviceWidth,
            height: deviceHeight - 20,
          }}
        >
          <ActivityIndicator size="large" color={main_color} />
        </View>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  backgroundVideo: {
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
export default VideoPlayer;
