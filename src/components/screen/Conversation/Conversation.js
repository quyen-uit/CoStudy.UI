import { useTheme, useRoute } from '@react-navigation/native';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from 'components/screen/Conversation/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { color } from 'react-native-reanimated';
import {
  main_2nd_color,
  main_color,
  touch_color,
  active_color,
  background_gray_color,
} from 'constants/colorCommon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Card } from 'react-native-elements';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';
import { getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import { api } from 'constants/route';
import messaging from '@react-native-firebase/messaging';
import { getAPI } from '../../../apis/instance';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import ImageView from 'react-native-image-viewing';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const tmpConversation = {
  id: '1',
  title: 'Đây là title 1',
  author: 'Nguyễn Văn Nam',
  content:
    'Bọn mình sẽ sử dụng Python, Jupiter Notebook và Google Collab để phân tích, hiển thị dữ liệu, vẽ biểu đồ các kiểu con đà điểu và bình luận nhé. Bọn mình sẽ sử dụng Python, Jupiter Notebook và Google Collab để phân tích, hiển thị dữ liệu, vẽ biểu đồ các kiểu con đà điểu và bình luận nhé',
  createdDate: '10 phut truoc',
};
const list = [
  {
    author: 'Võ Thanh Tâm',
    content: 'Đây là content Đây là content Đây làaaaaa content Đây là content',
    createdDate: '10 phut truoc',
    amountVote: 10,
    amountComment: 20,
    userId: '1',
    id: '1',
  },
  {
    author: 'Võ Thanh Tâm',
    content: 'Đây là content',
    createdDate: '10 phut truoc',
    amountVote: 10,
    amountComment: 20,
    userId: '1',

    id: '2',
  },

  {
    author: 'Võ Thanh Tâm',
    content:
      'Đây là contentĐây là content Đây là content Đây là content Đây là contentsss',
    createdDate: '10 phut truoc',
    amountVote: 10,
    amountComment: 20,
    userId: '2',

    id: '3',
  },

  {
    author: 'Võ Thanh Tâm',
    content: 'Đây là content',
    createdDate: '10 phut truoc',
    amountVote: 10,
    amountComment: 20,
    userId: '1',

    id: '4',
  },
  {
    author: 'Võ Thanh Tâm',
    content: 'Đây là content',
    createdDate: '10 phut truoc',
    amountVote: 10,
    amountComment: 20,
    userId: '2',

    id: '6',
  },
];
const comment = {
  author: 'Võ Thanh Tâm',
  content: 'Đây là content',
  createdDate: '10 phut truoc',
  amountVote: 10,
  amountComment: 20,
};

function RightMessage({ item, onViewImage }) {
  const [showTime, setShowTime] = useState(false);

  return (
    <TouchableOpacity onPress={() => setShowTime(!showTime)}>
      <View style={styles.containerRightMessage}>
        <View
          style={[
            {
              alignSelf: 'flex-end',
              marginBottom: 4,
            },
            item.sending
              ? {
                  borderRadius: 8,
                  borderWidth: 1,
                  width: 10,
                  height: 10,
                  borderColor: '#000',
                }
              : {},
          ]}
        >
          {item.sending ? null : (
            <FontAwesome5 name={'check-circle'} size={12} color={main_color} />
          )}
        </View>

        <View>
          {item.media_content != null ? (
            <TouchableOpacity
              onPress={() => onViewImage(true, item.media_content.image_hash)}
            >
              <Image
                style={{ width: 200, height: 300, marginRight: 8 }}
                source={{ uri: item.media_content.image_hash }}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.boxRightMessage}>
              <Text style={{ color: '#ffffff' }}>{item.string_content}</Text>
            </View>
          )}
        </View>
      </View>
      {showTime ? (
        <View style={styles.timeRight}>
          <Text style={{ fontSize: 9, color: '#999' }}>
            {moment(new Date()).diff(moment(item.created_date), 'minutes') < 60
              ? moment(new Date()).diff(moment(item.created_date), 'minutes') +
                ' phút trước'
              : moment(new Date()).diff(moment(item.created_date), 'hours') < 24
              ? moment(new Date()).diff(moment(item.created_date), 'hours') +
                ' giờ trước'
              : moment(item.created_date).format('hh:mm DD-MM-YYYY')}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}
function LeftMessage({ item, onViewImage, avatar }) {
  const [showTime, setShowTime] = useState(false);

  return (
    <TouchableOpacity onPress={() => setShowTime(!showTime)}>
      <View>
        <View style={styles.containerLeftMessage}>
          <View>
            <Image style={styles.imgAvatar} source={{ uri: avatar }} />
          </View>

          {item.media_content != null ? (
            <TouchableOpacity
              onPress={() => onViewImage(true, item.media_content.image_hash)}
            >
              <Image
                style={{ width: 200, height: 300, marginLeft: 8 }}
                source={{ uri: item.media_content.image_hash }}
              />
            </TouchableOpacity>
          ) : (
            <View style={styles.shirk1}>
              <View style={styles.boxMessage}>
                <Text>{item.string_content}</Text>
              </View>
            </View>
          )}
        </View>
        {showTime ? (
          <View style={styles.timeLeft}>
            <Text style={{ fontSize: 9, color: '#999' }}>
              {moment(new Date()).diff(moment(item.created_date), 'minutes') <
              60
                ? moment(new Date()).diff(
                    moment(item.created_date),
                    'minutes'
                  ) + ' phút trước'
                : moment(new Date()).diff(moment(item.created_date), 'hours') <
                  24
                ? moment(new Date()).diff(moment(item.created_date), 'hours') +
                  ' giờ trước'
                : moment(item.created_date).format('hh:mm DD-MM-YYYY')}
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}
function Conversation(props) {
  const post = tmpConversation;
  const route = useRoute();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [showOption, setShowOption] = useState(true);
  const [listMes, setListMes] = useState([]);
  const [message, setMessage] = useState('');
  const curUser = useSelector(getUser);
  const flatListRef = useRef();
  const [chosing, setChosing] = useState(false);
  const [imgMessage, setImgMessage] = useState();
  const [isSending, setSending] = useState(false);
  const conversation_id = route.params.id;
  const [visible, setIsVisible] = useState(false);
  const onViewImage = useCallback((value, uri) => {
    setIsVisible(true);
    setImgMessage(uri);
  });

  //lazy
  const [isEnd, setIsEnd] = useState(false);
  const [skip, setSkip] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const config = {
    headers: { Authorization: `Bearer ${curUser.jwtToken}` },
  };
  // useEffect(() => {
  //   flatListRef.current.scrollToEnd({ animated: true, duration: 1000 });
  // }, [message]);
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const res = JSON.parse(
        JSON.parse(
          JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
        ).message
      );
      if (res.SenderId == curUser.oid) return;
      if (route.params?.callback)
        if (res.MediaContent == null) {
          route.params.callback(res.StringContent, new Date());
        } else {
          route.params.callback('Ảnh', new Date());
        }
      const tmp = {
        id: '',
        sender_id: res.SenderId,
        conversation_id: res.ConversationId,
        media_content: res.MediaContent,
        string_content: res.StringContent,
        status: res.Status,
        created_date: res.CreatedDate,
        modified_date: res.ModifiedDate,
        oid: res.OId,
      };
      setListMes([tmp, ...listMes]);

      // console.log(
      //   JSON.parse(
      //     JSON.parse(
      //       JSON.stringify(JSON.parse(JSON.stringify(remoteMessage)).data)
      //     ).message
      //   )
      // );
    });

    return unsubscribe;
  }, [listMes]);
  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await getAPI(curUser.jwtToken)
        .get(
          api +
            'Message/message/get/conversation/' +
            conversation_id +
            '/skip/' +
            skip +
            '/count/10'
        )
        .then(response => {
          response.data.result.messages.forEach(i => (i.sending = false));
          if (isRender) {
            setListMes(response.data.result.messages);
            setIsLoading(false);
            setSkip(skip + 10);
          }
        })
        .catch(err => alert(err));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

  const sendMessage = async () => {
    setSending(true);
    const tmp = {
      id: '',
      sender_id: curUser.oid,
      media_content: null,
      string_content: message,

      created_date: new Date(),
      modified_date: new Date(),
      sending: true,
    };
    setMessage('');
    setListMes([tmp, ...listMes]);

    await getAPI(curUser.jwtToken)
      .post(api + 'Message/message/add', {
        conversation_id: conversation_id,
        content: message,
      })
      .then(response => {
        // setListMes([...listMes, response.data.result]);
        listMes.forEach(i => {
          if (i.sending) is.sending = false;
        });
        if (route.params?.callback) {
          route.params.callback(
            'Bạn: ' + response.data.result.string_content,
            new Date()
          );
        }
        setListMes([
          {
            id: '',
            sender_id: curUser.oid,
            media_content: response.data.result.media_content,
            string_content: response.data.result.string_content,
            conversation_id: response.data.result.conversation_id,
            created_date: response.data.result.created_date,
            modified_date: response.data.result.modified_date,
            sending: false,
          },
          ...listMes,
        ]);
        setSending(false);
      })
      .catch(err => {
        alert(err);
        setSending(false);
      });
  };
 
  const renderItem = ({ item }) => {
    
    if (item.sender_id == curUser.oid)
      return <RightMessage item={item} onViewImage={onViewImage} />;
    else
      return (
        <LeftMessage
          item={item}
          onViewImage={onViewImage}
          avatar={route.params.avatar}
        />
      );
  };

  const pickImage = () => {
    setSending(true);
    if (route.params?.callback) route.params.callback('Bạn: Ảnh', new Date());

    ImagePicker.openPicker({
      width: 800,
      height: 1000,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        const tmp = {
          id: '',
          sender_id: curUser.oid,
          media_content: { image_hash: image.path },

          created_date: new Date(),
          modified_date: new Date(),
          sending: true,
        };
        setListMes([tmp, ...listMes]);
        ///
        if (image) {
          const uri = image.path;
          const filename = uuidv4();
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          const task = storage()
            .ref(
              'conversation/' +
                conversation_id +
                '/' +
                curUser.oid +
                '/' +
                filename
            )
            .putFile(uploadUri);
          // set progress state
          task.on('state_changed', snapshot => {
            console.log('uploading avatar..');
          });
          try {
            await task.then(async response => {
              await storage()
                .ref(response.metadata.fullPath)
                .getDownloadURL()
                .then(async url => {
                  await getAPI(curUser.jwtToken)
                    .post(api + 'Message/message/add', {
                      conversation_id: conversation_id,
                      image: {
                        image_url: url,
                        image_hash: url,
                      },
                    })
                    .then(response => {
                      const tmp = {
                        id: '',
                        sender_id: curUser.oid,
                        media_content: { image_hash: image.path },

                        created_date: new Date(),
                        modified_date: new Date(),
                        sending: false,
                      };
                      setListMes([tmp, ...listMes]);
                      setSending(false);

                      //setListMes([...listMes, response.data.result]);
                    })
                    .catch(err => console.log(err));
                });
            });
          } catch (e) {
            console.error(e);
            setSending(false);
          }
        }
      }
    });
  };
  const cameraImage = () => {
    setSending(true);
    if (route.params?.callback) route.params.callback('Bạn: Ảnh', new Date());
    ImagePicker.openCamera({
      width: 800,
      height: 1000,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        const tmp = {
          id: '',
          sender_id: curUser.oid,
          media_content: { image_hash: image.path },

          created_date: new Date(),
          modified_date: new Date(),
          sending: true,
        };
        setListMes([tmp, ...listMes]);
        ///
        if (image) {
          const uri = image.path;
          const filename = uuidv4();
          const uploadUri =
            Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
          const task = storage()
            .ref(
              'conversation/' +
                conversation_id +
                '/' +
                curUser.oid +
                '/' +
                filename
            )
            .putFile(uploadUri);
          // set progress state
          task.on('state_changed', snapshot => {
            console.log('uploading avatar..');
          });
          try {
            await task.then(async response => {
              await storage()
                .ref(response.metadata.fullPath)
                .getDownloadURL()
                .then(async url => {
                  await getAPI(curUser.jwtToken)
                    .post(api + 'Message/message/add', {
                      conversation_id: conversation_id,
                      image: {
                        image_url: url,
                        image_hash: url,
                      },
                    })
                    .then(response => {
                      const tmp = {
                        id: '',
                        sender_id: curUser.oid,
                        media_content: { image_hash: image.path },

                        created_date: new Date(),
                        modified_date: new Date(),
                        sending: false,
                      };
                      setListMes([tmp, ...listMes]);
                      setSending(false);

                      //setListMes([...listMes, response.data.result]);
                    })
                    .catch(err => console.log(err));
                });
            });
          } catch (e) {
            console.error(e);
            setSending(false);
          }
        }
      }
    });
  };
  const fetchData = async () => {
    await getAPI(curUser.jwtToken)
      .get(
        api +
          'Message/message/get/conversation/' +
          conversation_id +
          '/skip/' +
          skip +
          '/count/10'
      )
      .then(response => {
        response.data.result.messages.forEach(i => (i.sending = false));
        setListMes([...listMes, ...response.data.result.messages]);
        setSkip(skip + 10);
        setIsEnd(false);
      })
      .catch(err => alert(err));
  };
  return (
    <View style={styles.largeContainer}>
      <SafeAreaView>
        <FlatList
          style={{ marginBottom: 64 }}
          onEndReached={() => {
            console.log('end');
            if (isEnd) return;
            if (listMes.length > 9) {
              setIsEnd(true);

              fetchData();
            }
          }}
          onEndReachedThreshold={0.1}
          showsVerticalScrollIndicator={false}
          data={listMes}
          inverted={-1}
          ListFooterComponent={() =>
            isEnd ? (
              <View style={{ marginVertical: 12 }}>
                <ActivityIndicator size={'large'} color={main_color} />
              </View>
            ) : (
              <View style={{ margin: 4 }}></View>
            )
          }
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </SafeAreaView>
      <View style={styles.containerInput}>
        {showOption ? (
          <View style={styles.grOption}>
            <TouchableOpacity style={styles.btnInputOption}>
              <FontAwesome5 name={'plus-circle'} size={24} color={main_color} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnInputOption}>
              <FontAwesome5
                name={'square-root-alt'}
                size={24}
                color={main_color}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnInputOption}
              onPress={() => setChosing(true)}
            >
              <FontAwesome5 name={'images'} size={24} color={main_color} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.btnInputOption}
            onPress={() => setShowOption(true)}
          >
            <FontAwesome5 name={'angle-right'} size={24} color={main_color} />
          </TouchableOpacity>
        )}
        <TextInput
          multiline={true}
          style={styles.input}
          onTouchEnd={() => setShowOption(false)}
          placeholder="Nhập j đi tml.."
          value={message}
          onChangeText={text => setMessage(text)}
        />
        {isSending ? (
          <View style={styles.btnInputOption}>
            <FontAwesome5 name={'paper-plane'} size={24} color={'#ccc'} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.btnInputOption}
            onPress={() => {
              sendMessage();
            }}
          >
            <FontAwesome5 name={'paper-plane'} size={24} color={main_color} />
          </TouchableOpacity>
        )}
      </View>
      {chosing ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#ccc',
            height: deviceHeight,
            width: deviceWidth,
            opacity: 0.9,
          }}
        >
          <TouchableOpacity
            style={{ height: deviceHeight, width: deviceWidth }}
            onPress={() => setChosing(false)}
          >
            <View
              style={{
                marginTop: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 30, fontWeight: 'bold', color: main_color }}
              >
                Bạn muốn chọn ảnh từ
              </Text>
              <TouchableOpacity
                onPress={() => {
                  pickImage();
                  setChosing(false);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: main_2nd_color,
                    padding: 12,
                    borderRadius: 20,
                    paddingHorizontal: 32,
                    marginVertical: 40,
                  }}
                >
                  <Image
                    source={require('../../../assets/gallary.png')}
                    style={{ width: 48, height: 48 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginLeft: 20,
                      color: '#fff',
                    }}
                  >
                    Thư viện
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  cameraImage();
                  setChosing(false);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: main_2nd_color,
                    padding: 12,
                    borderRadius: 20,
                    paddingHorizontal: 32,
                  }}
                >
                  <Image
                    source={require('../../../assets/camera.png')}
                    style={{ width: 48, height: 48 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginLeft: 20,
                      color: '#fff',
                    }}
                  >
                    Máy ảnh
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}

      <ImageView
        images={[{ uri: imgMessage }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
      {isLoading ? (
        <View
          style={{
            position: 'absolute',
            justifyContent: 'center',
            backgroundColor: '#cccccc',
            opacity: 0.5,
            width: deviceWidth,
            height: deviceHeight - 20,
          }}
        >
          <ActivityIndicator
            size="large"
            color={main_color}
            style={{ marginBottom: 100 }}
          />
        </View>
      ) : null}
    </View>
  );
}

export default Conversation;
// <FlatList
//             inverted={-1}
//             initialScrollIndex={1}
//             showsVerticalScrollIndicator={false}
//             data={list}
//             renderItem={renderItem}
//             keyExtractor={item => item.id}
//           />
