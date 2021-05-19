import { main_2nd_color, main_color } from 'constants/colorCommon';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: main_color,
    justifyContent: 'center',
  },
  otherContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  formContainer: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {},
  imgLogo: {
    marginLeft: -8,
    marginTop: -40,
    marginBottom: 20,
  },
  btnLogin: {
    borderRadius: 32,
    marginHorizontal: 56,
    backgroundColor: main_2nd_color,
    alignSelf: 'stretch',
    paddingVertical: 12,
    marginTop: 16,
    elevation: 10,
  },
  txtLogin: {
    fontSize: 20,
    alignSelf: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  txtForgot: {
    fontSize: 14,
    color: '#fff',
    marginTop: 8,
  },
  txtFooter: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default styles;