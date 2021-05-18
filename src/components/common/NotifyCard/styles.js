import { StyleSheet } from 'react-native';
import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';
 
const styles = StyleSheet.create({
  // container (view)
  container: {
    padding: 0,
    margin: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    padding: 8,
   },
  headerAvatar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
   },
  headerAuthor: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  btnCard: {
    borderRadius: 8,
  },
  btnCancel: {  alignItems: 'flex-end' },
  // image
  imgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: '#c4c4c4',
    marginRight: 8
  },

  // text
  txtAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtCreateDate: {
    color: '#8f8f8f',
    fontSize: 12,
    marginRight: 4,
    marginTop: 4,
  },
  txtContent: {
    fontSize: 14,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
  },
});

export default styles;
