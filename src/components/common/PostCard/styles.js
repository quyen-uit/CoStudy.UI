import { StyleSheet, Dimensions } from 'react-native';
import { main_2nd_color, main_color } from 'constants/colorCommon';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  // container (view)
  containerPopupVote: {
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    flexDirection: 'row',
    bottom: 40,
  },
  containerHeader: { flexWrap: 'wrap'},
  container: {
    padding: 0,
    margin: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    margin: 8,
    marginBottom: 4,
    width: deviceWidth - 34,
    justifyContent: 'space-between'
   },
  headerAvatar: {
    // borderWidth: 1, 
    // borderColor: main_2nd_color,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexShrink: 1
  },
  rowFlexStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  containerTag: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 8,
    marginLeft: 8,
  },
  footer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'center',
    borderTopColor: main_color,
    borderTopWidth: 0.5,
  },

  // image
  imgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: '#c4c4c4',
    marginRight: 8,
  },
  imgContent: {
    marginTop: 8,

    width: '100%',
    height: 200,
  },
  // button
  btn3Dot: {
    flex: 1,
    borderRadius: 16,
   },
  btnVote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,

    borderRadius: 8,
  },
  btnOption: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  btnTag: {
    backgroundColor: main_2nd_color,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  btnCard: { borderRadius: 8, paddingBottom: 8 },
  btnVoteInPopup: { marginHorizontal: 16, marginVertical: 8 },
  // text
  txtAuthor: {
    fontSize: 18,
    fontWeight: 'bold',
     marginRight: 48
   },
  txtCreateDate: {
    color: '#c4c4c4',
    fontSize: 12,
    marginLeft: 4,
  },
  txtTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
    marginRight: 8,
  },
  txtContent: {
    fontSize: 15,
    marginLeft: 16,
    marginRight: 8,
  },
  txtTag: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  txtVoteNumber: {
    marginRight: 12,
    fontSize: 14,
  },
  iconTitle: {
    marginLeft: 8,
    alignSelf: 'flex-start',
    marginTop: 4
  },
  flex1: {
    flex: 1,
  },
});

export default styles;
