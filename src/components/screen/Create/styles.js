import { main_color, main_2nd_color } from 'constants/colorCommon';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
  },
  topContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    borderBottomColor: main_color,
    borderBottomWidth: 0.5,
    justifyContent: 'space-between',
  },
  title: {
    paddingHorizontal: 8,
    paddingBottom: 4,
    borderBottomColor: main_color,
    borderBottomWidth: 0.5,
  },
  content: {
    paddingHorizontal: 8,
    marginVertical: 4,
  },
  listImage: {},
  field: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 8,
    flexWrap: 'wrap',
    marginVertical: 4,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopColor: main_color,
    borderTopWidth: 1,

    backgroundColor: '#fff',
  },
  picker: {
    padding: 4,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  //img
  imgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: '#ccc',
  },
  //text
  txtName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  txtTitle: {
    fontSize: 16,
    color: '#ccc',
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
  btnInputOption: { flex: 1, paddingVertical: 8 },
  flex: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  txtField: {
    marginLeft: 8,
    fontSize: 16,
    color: main_color,
    fontWeight: 'bold',
  },
});

export default styles;
