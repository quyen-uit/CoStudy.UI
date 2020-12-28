import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  alignItemCenter: {
    alignItems: 'center'
  },
  container: {
    flex: 1,

    backgroundColor: touch_color,
  },
  
  containerButton: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  containerProfile: {
    backgroundColor: '#fff',
    margin: 8,
    marginTop: -56,
    paddingBottom: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  containerAmount: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 8,
    marginBottom: 8,
  },
  containerNew: {
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 8,
    paddingBottom: 0,
  },
  //group
 
  grInfor: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 16,
    marginVertical: 4,
  },
  grNew: {
    flexDirection: 'row',
  },
  grOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderTopColor: main_color,
    borderTopWidth: 0.5,
  },
  // image
  imgCover: {
    width: '100%',
    height: 180,
  },
  imgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: touch_color,
  },
  imgBigAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 0.5,
    borderColor: touch_color,
    position: 'absolute',
    top: -60,
    alignSelf: 'center',
  },
  //
  btnFollow: {
    backgroundColor: main_color,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    flex: 1,
  },
  btnUnFollow: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    flex: 1,
  },
  btnBoxNew: {
    flex: 8,
    borderRadius: 24,
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: touch_color,
  },
  btnOption: {
    borderRadius: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
  },
  //text
  txtName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 68,
    alignSelf: 'center',
  },
  txtAmount: {
    color: main_2nd_color,
    fontSize: 20,
    fontWeight: 'bold',
  },
  txtTitleAmount: {
    fontSize: 16,
    color: main_color,
  },
  txtInfor: {
    fontSize: 17,
    marginHorizontal: 8,
  },
  txtOption: {
    color: main_color,
    fontSize: 16,
    marginLeft: 8,
  },
  txtNew: {
    fontSize: 16,
    marginHorizontal: 8,
    color: '#c4c4c4',
  },
  txtFollow: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  txtUnFollow: {
    fontSize: 16,
    color: main_color,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
});

export default styles;
