import { StyleSheet } from 'react-native';
import { main_color } from 'constants/colorCommon';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: main_color,
    fontSize: 10,
  },
  labelText: {
    fontSize: 8,
    marginTop: 2,
    marginBottom: 4,
  },
  tab: {
    margin: -4,
  },
  indicator: {
    backgroundColor: main_color,
  },
  headerLeft: {
    margin: 16,
  },
  headerRight: {
    margin: 16,
  },
  imgAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  btnSearch: {
    width: 40,
    height: 40,
  },
  //button
  btnRight: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: { position: 'absolute', right: -8, top: -4 },
});

export default styles;
