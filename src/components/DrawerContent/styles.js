import { StyleSheet } from 'react-native';
import { main_2nd_color } from '../../constants/colorCommon';
const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 16,
  },
  title: {
    fontSize: 18,
    marginTop: 3,
    fontWeight: 'bold',
  },
  childHeader: {
    marginLeft: 10,
  },
  header: { flexDirection: 'row', marginTop: 15 },
  caption: {
    fontSize: 12,
    lineHeight: 14,
  },
  number: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 3,
    color: main_2nd_color,
  },
  row: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 15,
  },
  imgAvatar: { width: 56, height: 56, borderRadius: 28 },
});

export default styles;
