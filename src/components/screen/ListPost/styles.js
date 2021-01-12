import { StyleSheet } from 'react-native';
import { main_color, main_2nd_color, touch_color } from 'constants/colorCommon';

const styles = StyleSheet.create({
  cardContainer: {
    padding: 0,
    margin: 8,
    borderRadius: 8,
  },
  imgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerLeft: {
    marginLeft: 12
  },
  headerRight: {
    marginRight: 12,
  },
// modal
fieldPicked: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  marginLeft: 8,
  flexWrap: 'wrap',
  marginBottom: 4,
},
btnTag: {
  backgroundColor: main_2nd_color,
  marginRight: 8,
  paddingHorizontal: 8,
  paddingVertical: 4,
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 16,
  flexDirection: 'row',
  marginVertical: 4,
},
txtTag: {
  fontSize: 12,
  color: '#fff',
  textAlign: 'center',
  marginRight: 4,
},
md_txtHeader: {
  fontSize: 16,
  color: '#fff',
},
md_field: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 8,
  paddingVertical: 8,
  borderBottomWidth: 1,
  borderColor: main_color,
},
md_txtfield: {
  fontSize: 16,
  marginLeft: 8,
},
md_txtchoose: {
  fontSize: 16,
  marginRight: 8,
  color: main_2nd_color,
},
});
export default styles;
