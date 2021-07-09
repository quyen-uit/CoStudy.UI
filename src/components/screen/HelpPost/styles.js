import { StyleSheet } from 'react-native';
import { main_2nd_color, main_color } from 'constants/colorCommon';

const styles = StyleSheet.create({
  // container (view)
  container: {
    padding: 0,
    margin: 4,
    borderRadius: 8,
    borderWidth: 0, // Remove Border
    elevation: 0,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
   },
  headerTime: { flex: 1, alignItems: 'flex-end' },
  headerAvatar: {
     flexDirection: 'row',
    justifyContent: 'flex-start',
    flexShrink: 1,
    

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
  cardContainer: {
    padding: -8,
    margin: 8,
    borderRadius: 8,
    borderWidth: 0, // Remove Border
    elevation: 0,
    backgroundColor: '#fff',
  },
  card: {
    borderRadius: 8,
    padding: 12
  },
  // image
  imgAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderColor: '#c4c4c4',
    marginRight: 8,
  },

  // text
  txtAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  txtCreateDate: {
    color: '#c4c4c4',
    fontSize: 12,
    marginRight: 4,
  },
  txtContent: {
    fontSize: 14,
    marginTop: 2,
     
  },
  row: {
    flexDirection: 'row',
  },
  btnCard: {
    borderRadius: 8,
  },
  btnCancel: { flex: 1, alignItems: 'flex-end' },
});

export default styles;
