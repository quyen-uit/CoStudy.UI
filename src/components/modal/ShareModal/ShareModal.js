// import React, { useState, useEffect } from 'react';
// import { ToastAndroid, Text, View, Image } from 'react-native';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { main_color } from 'constants/colorCommon';
// import { getJwtToken, getUser } from 'selectors/UserSelectors';
// import { useSelector } from 'react-redux';
// // import Modal from 'react-native-modal';
// import { useNavigation } from '@react-navigation/native';
// import Modal, {
//   ModalContent,
//   BottomModal,
//   SlideAnimation,
// } from 'react-native-modals';
// import styles from './styles';
// import PostService from 'controllers/PostService';
// import navigationConstants from 'constants/navigation';
// import ChatService from 'controllers/ChatService';
// import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';

// // const chat = {
// //   title: 'Đây là title',
// //   author: 'Nguyễn Văn Nam',
// //   latestChat: 'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
// //   latestTime: '10 phut truoc',
// // }

// const ShareModal = ({ ...rest }) => {
//   const curUser = useSelector(getUser);
//   const jwtToken = useSelector(getJwtToken);
//   const [list, setList] = useState([]);

//   const navigation = useNavigation();
//   useEffect(() => {
//     if (rest.id != null) {
//       const fetch = await ChatService.getCurrentConversation(jwtToken).then(res => {
//         res.data.result.conversations.forEach(item => {
//           let tmp = {};
//           tmp.conversationId = item.conversation.oid;
//           if (item.conversation.participants[0].member_id == curUser.oid) {
//             tmp.name = item.conversation.participants[1].member_name;
//             tmp.avatar = item.conversation.participants[1].member_avatar;
//           } else {
//             tmp.name = item.conversation.participants[0].member_name;
//             tmp.avatar = item.conversation.participants[0].member_avatar;
//           }
//         });
//         setList([...list, tmp]);
//         // name, conversation_id, avatar,
//       });
//       await fetch();
//     }
//     return () => {};
//   }, [rest.id]);

//   const onShare = async (id) => {
//     await ChatService.createPostMessage(jwtToken,{conversation_id: id, post_id: item.id})
//   };
//   const renderItem = (item) => {
//     return (
//       <View style={styles.optionContainer}>
//           <View
//             style={{
//               flexDirection: 'row',
//               margin: 4,
//               justifyContent: 'space-around',
//               alignItems: 'center',
//             }}
//           >
//             <View style={{ flexDirection: 'row' }}>
//               <Image
//                 style={{
//                   width: 40,
//                   height: 40,
//                   borderRadius: 20,
//                   marginRight: 8,
//                 }}
//                 source={{uri: item.avatar}}
//               />
//               <Text>{item.name}</Text>
//             </View>
//             <TouchableOpacity
//               onPress={ async ()=> await onShare(item.conver)}
//               style={{
//                 padding: 4,
//                 backgroundColor: main_color,
//                 borderRadius: 8,
//               }}
//             >
//               <Text>Gửi</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
      
//     )
//   }
//   return (
//     <BottomModal
//       {...rest}
//       swipeDirection={['down']} // can be string or an array
//       swipeThreshold={100} // default 100
//       useNativeDriver={true}
//       modalAnimation={
//         new SlideAnimation({
//           slideFrom: 'bottom',
//         })
//       }
//       modalTitle={
//         <Icon
//           name={'chevron-down'}
//           color={main_color}
//           size={16}
//           style={styles.headerIcon}
//         />
//       }
//       modalAnimation={
//         new SlideAnimation({
//           initialValue: 0, // optional
//           slideFrom: 'bottom', // optional
//           useNativeDriver: true, // optional
//         })
//       }
//     >
//       <ModalContent style={styles.content}>
//         <View>
//           <FlatList
//             showsVerticalScrollIndicator={false}
//             data={list}
//             renderItem={renderItem}
//             keyExtractor={(item, index) => index.toString()}
//           />
//         </View>
//       </ModalContent>
//     </BottomModal>
//   );
// };

// export default ShareModal;
