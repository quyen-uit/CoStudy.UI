import { StyleSheet } from 'react-native';
import {
  background_gray_color,
  main_2nd_color,
  main_color,
  touch_color,
} from 'constants/colorCommon';

const styles = StyleSheet.create({
  // container (view)
  flex1: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: main_2nd_color,
    fontSize: 14,
    padding: 4,
    paddingLeft: 12,
    marginBottom: -4,
  },
  containerPopupVote: {
    borderRadius: 32,
    backgroundColor: '#f0f0f0',
    position: 'absolute',
    flexDirection: 'row',
    bottom: 40,
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopColor: main_color,
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  largeContainer: {
    flex: 1,
    backgroundColor: background_gray_color,
  },
  container: {
    padding: 0,
    margin: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
    margin: 8,
  },
  headerAvatar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    flexWrap: 'wrap'
  },
  footer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 8,
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
  },
  // button
  btnBookmark: {
    flex: 1,
    alignItems: 'flex-end',
    borderRadius: 32,
    padding: 4,
  },
  btnVote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,

    borderRadius: 8,
  },
  btnVoteInPopup: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  btnOption: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  btnInputOption: {
    marginHorizontal: 6,
  },
  btnTag: {
    backgroundColor: main_2nd_color,
    marginRight: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginTop: 8
  },
  // text
  txtAuthor: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  txtCreateDate: {
    color: '#c4c4c4',
    fontSize: 12,
    marginLeft: 4,
  },
  txtTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 8,
  },
  txtContent: {
    fontSize: 15,
    marginLeft: 16,
    marginRight: 8,
    textAlign: 'left',
  },
  txtDes: {
    fontSize: 15,
    marginVertical: 8,
    textAlign: 'left',
  },
  txtTag: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  txtVoteNumber: { marginRight: 12, fontSize: 14 },
  txtPreviousComment: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 16,
    marginTop: 8,
  },
  //icon
  iconTitle: {
    marginLeft: 16,
  },
});

export default styles;
