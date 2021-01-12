import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  alignItemCenter: {
    alignItems: 'center',
    height: 100,
    backgroundColor: '#f9d'
  },
  container: {
    flex: 1,

    backgroundColor: touch_color,
  },
});

export default styles;
