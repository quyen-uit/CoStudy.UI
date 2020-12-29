import { StyleSheet } from 'react-native';
import { main_color, main_2nd_color, touch_color } from 'constants/colorCommon';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 56,
    backgroundColor: main_color,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filter: {
    flexDirection: 'row',
    borderBottomColor: main_color,
    borderBottomWidth: 0.5,
    alignItems: 'center',
  },
  headerLeft: {
    marginHorizontal: 8,
  },
  //btn
  btnSelected: {
    paddingVertical: 4,
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: main_color,
  },
  btnNotSelected: {
    paddingVertical: 4,
    alignItems: 'center',
    marginVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#ccc',
  },
  //txt
  txtBtnSelected: {
    fontSize: 16,
    color: '#fff',
  },
  txtBtnNotSelected: {
    fontSize: 16,
    color: '#fff',
  },
  //text input
  inputSearch: {
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 100,
    margin: 8,
    paddingHorizontal: 8,
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
  //card user
  cardContainer: {
     padding: -8,
     margin: 8,
    borderRadius: 8,
    borderWidth: 0, // Remove Border
    elevation: 0,
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 8, padding: 12
  },
  imgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: '#c4c4c4',
    marginRight: 8,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between'
   },
   headerAvatar: {
     flexDirection: 'row',
    justifyContent: 'flex-start',
    flexShrink: 1,
    

  },
  txtAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtCreateDate: {
    color: '#c4c4c4',
    fontSize: 12,
    marginRight: 4,
  },
  txtContent: {
    fontSize: 14,
    marginTop: 2,
     
  },
});

export default styles;
