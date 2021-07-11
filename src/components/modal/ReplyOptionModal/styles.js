import { StyleSheet } from 'react-native';
import { main_2nd_color, main_color } from 'constants/colorCommon';

const styles = StyleSheet.create({
  // container (view)
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    paddingLeft: 12
  },
  headerIcon: { alignSelf: 'center', marginTop: 2 },
  content: {marginHorizontal: -16},
  txtOption: {
    fontSize: 16, 
    marginLeft:12
  }
});

export default styles;
