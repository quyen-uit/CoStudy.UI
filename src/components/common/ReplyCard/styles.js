import { StyleSheet } from 'react-native';
import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';

const styles = StyleSheet.create({
  shrink1: {
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
  },
  // container (view)
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerComment: {
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  containerCreatedTime: { 
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowFlexStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  // image
  imgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: '#c4c4c4',
  },
  imgChildAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderColor: '#c4c4c4',
  },
  imgContent: {
    marginTop: 8,

    width: '100%',
  },
  // button
  btnBigComment: {
    marginLeft: 8,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderColor: main_color,
    borderWidth: 0.5,
    flexShrink: 1,
  },
  btnChildComment: {
    marginLeft: 8,
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderColor: '#c4c4c4',
    borderWidth: 0.5,
    flexShrink: 1,
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
    marginHorizontal: 8,
    textAlign: 'left',
  },
  txtTag: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
  txtChildAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  txtChildContent: {
    fontSize: 12,
    marginHorizontal: 8,
    textAlign: 'left',
  },
  txtChildCreateDate: {
    color: '#c4c4c4',
    fontSize: 9,
    marginLeft: 4,
  },
  txtChildVoteNumber: { marginHorizontal: 8, fontSize: 9 },
  txtVoteNumber: { marginHorizontal: 8, fontSize: 12 },
});

export default styles;
