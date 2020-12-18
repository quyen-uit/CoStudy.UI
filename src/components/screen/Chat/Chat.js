import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import {
  Text,
  View,
  FlatList,
  Pressable,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/Chat/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import ChatCard from '../../common/ChatCard';
import Icon from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import ChatOptionModal from 'components/modal/ChatOptionModal/ChatOptionModal';
import { touch_color } from 'constants/colorCommon';
import * as signalR from '@microsoft/signalr';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const list = [
  {
    id: '1',
    title: 'Đây là title',
    author: 'Nguyễn Văn Nam',
    latestChat: 'Đây là tin nhanw cuoi',
    latestTime: '10 phut truoc',
  },
  {
    id: '2',
    title: 'Đây là title',
    author: 'Nguyễn Văn Nam',
    latestChat: 'Đây là tin nhanw cuoi',
    latestTime: '10 phut truoc',
  },
  {
    id: '3',
    title: 'Đây là title',
    author: 'Nguyễn Văn Nam',
    latestChat: 'Đây là tin nhanw cuoi',
    latestTime: '10 phut truoc',
  },
];

function Chat() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [listMes,setListMes] = useState([])
  const user = useSelector(getUser);

  
  
  function isClose() {
    setModalVisible(true);
  }
  function callbackVisibleModal(isVisible) {
    setModalVisible(false);
  }
  const GoToConversation = () => {
    navigation.navigate(navigationConstants.conversation);
  };
  const renderItem = ({ item }) => {
    return (
      <Card containerStyle={styles.cardContainer}>
        <TouchableHighlight
          onPress={() => GoToConversation()}
          onLongPress={() => setModalVisible(true)}
          underlayColor={touch_color}
          style={styles.card}
        >
          <ChatCard chat={item} />
        </TouchableHighlight>
      </Card>
    );
  };
  return (
    <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />

      <ChatOptionModal
        visible={modalVisible}
        onSwipeOut={event => {
          setModalVisible(false);
        }}
        onHardwareBackPress={() => {
          setModalVisible(false);
          return true;
        }}
        onTouchOutside={() => {
          setModalVisible(false);
        }}
      />
    </View>
  );
}
export default Chat;

// <BottomModal
//         visible={modalVisible}
//         swipeDirection={['up', 'down']} // can be string or an array
//         swipeThreshold={100} // default 100
//         useNativeDriver={true}
//         modalTitle={<Icon name={'chevron-down'} color={main_color} size={16} style={{alignSelf: 'center', marginTop: 2}}/>}

//         modalAnimation={
//           new SlideAnimation({
//             initialValue: 0, // optional
//             slideFrom: 'bottom', // optional
//             useNativeDriver: true, // optional
//           })
//         }
//         useNativeDriver={true}
//         onSwipeOut={event => {
//           setModalVisible(false);
//         }}
//         onTouchOutside={() => setModalVisible(false)}
//       >
//         <ModalContent style={{ marginHorizontal: -16 }}>
//           <TouchableHighlight underlayColor={'#000'} onPress={()=>alert('a')}>
//           <View
//             style={{
//               flexDirection: 'row',
//               alignItems: 'center',
//               paddingVertical: 12,
//               backgroundColor: '#fff',
//             }}
//           >
//             <Icon
//               style={{ marginHorizontal: 12 }}
//               name={'home'}
//               color={main_color}
//               size={24}
//             />
//             <Text style={{ fontSize: 16 }}>Xóa hội thoại</Text>
//           </View>
//           </TouchableHighlight>
//           <TouchableHighlight
//             underlayColor={'#000'}
//             onPress={() => alert('a')}
//           >
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',

//                 paddingVertical: 12,
//                 backgroundColor: '#fff',
//               }}
//             >
//               <Icon
//                 style={{ marginHorizontal: 12 }}
//                 name={'home'}
//                 color={main_color}
//                 size={24}
//               />
//               <Text style={{ fontSize: 16 }}>Đánh dấu chưa đọc</Text>
//             </View>
//           </TouchableHighlight>
//           <TouchableHighlight
//             underlayColor={'#000'}
//             onPress={() => {
//               setModalVisible(false);
//             }}
//           >
//             <View
//               style={{
//                 flexDirection: 'row',
//                 alignItems: 'center',

//                 paddingVertical: 12,
//                 backgroundColor: '#fff',
//               }}
//             >
//               <Icon
//                 style={{ marginHorizontal: 12 }}
//                 name={'home'}
//                 color={main_color}
//                 size={24}
//               />
//               <Text style={{ fontSize: 16 }}>Báo cáo</Text>
//             </View>
//           </TouchableHighlight>
//         </ModalContent>
//       </BottomModal>
