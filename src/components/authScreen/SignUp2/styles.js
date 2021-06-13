import { main_2nd_color, main_color } from 'constants/colorCommon';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: main_color,
    justifyContent: 'center'
  },
  otherContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  formContainer: {
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 56,

  },
  footer: {},
  imgLogo: {
    marginLeft: -8,
  },
  btnSignUp: {
    borderRadius: 32,
     backgroundColor: main_2nd_color,
    alignSelf: 'stretch',
    paddingVertical: 12,
    marginTop: 16,
    elevation: 10,
  },
  txtSignUp: {
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
  txtTitle: {
    fontSize: 48,
    color: '#fff',
    elevation: 10,
    fontWeight: 'bold',
    marginBottom: 40
   },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingLeft: 48,
    fontSize: 16,
    alignSelf: 'stretch',
    marginHorizontal: 56,
    justifyContent: 'center',
    marginVertical: 10,
  },
  icon: {
    paddingLeft: 12,
    position: 'absolute',
  },
});

export default styles;
