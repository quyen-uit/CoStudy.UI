import { StyleSheet } from 'react-native';
import { main_2nd_color, main_color } from 'constants/colorCommon';

const styles = StyleSheet.create({
  // container (view)
  container: {
    padding: 0,
    margin: 8,
    borderRadius: 8,
  },
  containerComment: { flexDirection: 'row', marginHorizontal: 8, marginVertical: 4 },
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
    flexShrink: 1
  },
  btnVote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,

    borderRadius: 8,
  },
  btnOption: {
    width: 28,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
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
});

export default styles;
