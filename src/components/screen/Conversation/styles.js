import { StyleSheet } from 'react-native';
import {
  background_gray_color,
  main_2nd_color,
  main_color,
} from 'constants/colorCommon';

const styles = StyleSheet.create({
  timeLeft: {
    justifyContent: 'center',
    marginLeft: 60,
    marginTop: -6
  },
  shirk1: {
    flexShrink: 1,
  },
  timeRight: { justifyContent: 'center', alignSelf: 'flex-end', marginRight: 28 },
  // container (view)
  grOption: {
    flexDirection: 'row',
  },
  largeContainer: {
    flex: 1,
    backgroundColor: background_gray_color,
  },
  containerChat: {
    backgroundColor: background_gray_color,
    flexDirection: 'column-reverse',
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 12,
    paddingTop: 8,
    borderTopColor: main_color,
    borderTopWidth: 1,
    backgroundColor: '#fff',
    marginTop: 8,
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  container: {
    padding: 0,
    margin: 8,
    borderRadius: 8,
  },
  containerLeftMessage: {
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 4,
  },
  containerRightMessage: {
    flexDirection: 'row-reverse',
    marginHorizontal: 8,
    marginVertical: 4,
    justifyContent: 'flex-start',
  },

  rowFlexStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  boxMessage: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    marginRight: 60,
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  boxRightMessage: {
    backgroundColor: main_color,
    borderRadius: 24,
    padding: 8,
    flexShrink: 1,
    marginHorizontal: 8,
    marginLeft: 60,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  // image
  imgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 24,
    borderColor: '#c4c4c4',
  },

  // button
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

  txtContent: {
    fontSize: 15,
    marginHorizontal: 8,
    textAlign: 'left',
  },
});

export default styles;
