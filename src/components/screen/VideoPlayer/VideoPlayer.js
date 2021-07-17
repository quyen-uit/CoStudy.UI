import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import {
  useColorScheme,
  LogBox,
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native';


import Video from 'react-native-video';


function VideoPlayer() {
  const route = useRoute();
  useEffect(() => {

  }, []);
  
  return (

    <View style={{ flex: 1 }}>
      <Video
        source={{
          uri:
            route.params.video,
        }} // Can be a URL or a local file.
        ref={ref => {
          this.player = ref;
        }} // Store reference
        controls
        fullscreen={true}
        onBuffer={this.onBuffer} // Callback when remote video is buffering
        onError={this.videoError} // Callback when video cannot be loaded
        resizeMode={'contain'}
        fullscreen={true}
        style={styles.backgroundVideo}
      />
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
