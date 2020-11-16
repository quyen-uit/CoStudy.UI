import { StyleSheet } from 'react-native';
import { main_2nd_color, main_color } from 'constants/colorCommon';

const styles = StyleSheet.create({
  // container (view)
  container: {
    padding: 8,
    margin: 8,
    borderRadius: 8,
  },
  header: {
    flexDirection: 'row',
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
  containerTag: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 8,
    marginTop: 8,
  },
  footer: {
    alignItems: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginHorizontal: -8,
    paddingTop: 8,
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
  }
  ,
  // button
  btnVote: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOption: {
    width: 28,
    height: 32,
    alignItems: 'center',
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
    fontSize: 16,
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
  },
  txtContent: {
    fontSize: 14,
  },
  txtTag: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});

export default styles;
