import { useTheme, useRoute, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
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
  ToastAndroid,
  Pressable,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from 'components/screen/Comment/styles';
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
import CommentCard from 'components/common/CommentCard';
import { getAPI } from '../../../apis/instance';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import { getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import { api } from '../../../constants/route';
import navigationConstants from 'constants/navigation';

const tmpComment = {
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
    id: '1',
  },
  {
    author: 'Võ Thanh Tâm',
    content: 'Đây là content',
    createdDate: '10 phut truoc',
    amountVote: 10,
    amountComment: 20,
    id: '2',
  },

  {
    author: 'Võ Thanh Tâm',
    content: 'Đây là content',
    createdDate: '10 phut truoc',
    amountVote: 10,
    amountComment: 20,
    id: '3',
  },

  {
    author: 'Võ Thanh Tâm',
    content: 'Đây là content',
    createdDate: '10 phut truoc',
    amountVote: 10,
    amountComment: 20,
    id: '4',
  },
];
const mainComment = {
  author: 'Võ Thanh Tâm',
  content: 'Đây là child content Đây là child content Đây là child content',
  createdDate: '10 phut truoc',
  amountVote: 10,
  amountComment: 20,
};
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function Comment(props) {
  const route = useRoute();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [isVote, setIsVote] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const [data, setData] = useState(route.params.comment);
  const [isLoading, setIsLoading] = useState(false);
  const curUser = useSelector(getUser);
  const [replies, setReplies] = useState([]);

  //comment
  const [comment, setComment] = useState('');

  const [sending, setSending] = useState(false);
  const navigation = useNavigation();
  const GoToProfile = () => {
    navigation.push(navigationConstants.profile, { id: data.author_id });
  };
  const renderItem = ({ item }) => {
    return <CommentCard comment={item} />;
  };
  useEffect(() => {
    setIsLoading(true);
    let isOut = false;
    const fetchData = async () => {
      await getAPI(curUser.jwtToken)
        .get(api + 'Comment/get/replies/' + data.oid + '?skip=0&count=5', {
          skip: 0,
          count: 5,
        })
        .then(response => {
          if (!isOut) {
            response.data.result.forEach(i => {
              i.author_name = 'Lê Quốc Thắng';
              i.author_avatar =
                'https://firebasestorage.googleapis.com/v0/b/costudy-c5390.appspot.com/o/avatar%2Favatar.jpeg?alt=media&token=dbfd6455-9355-4b68-a711-111c18b0b243';
              i.image = '';
            });
            setIsLoading(false);
            setReplies(response.data.result);
          }
        })
        .catch(error => alert(error));
    };
    fetchData();
    return () => {
      isOut = true;
    };
  }, []);

  const fetchMore = async () => {
    return;
    await getAPI(curUser.jwtToken)
      .get(api + 'Comment/get/' + post.oid + '/skip/' + skip + '/count/5')
      .then(response => {
        if (response.data.result.length > 0) {
          setSkip(skip + 5);
          setComments(comments.concat(response.data.result));
        }
        setIsEnd(false);
      })
      .catch(error => alert(error));
  };
  const postComment = async () => {
    setSending(true);

    if (comment == '') {
      Alert.alert('Thông báo', 'Bạn chưa nhập bình luận..');
      return;
    }
    ToastAndroid.show('Đang trả lời..', ToastAndroid.SHORT);
    await getAPI(curUser.jwtToken)
      .post(api + 'Comment/reply', {
        content: comment,
        parent_id: data.oid,
      })
      .then(response => {
        setComment('');
        response.data.result.author_name = 'Lê Quốc Thắng';
        response.data.result.image = '';
        response.data.author_avatar =
          'https://firebasestorage.googleapis.com/v0/b/costudy-c5390.appspot.com/o/avatar%2Favatar.jpeg?alt=media&token=dbfd6455-9355-4b68-a711-111c18b0b243';
        setReplies(replies.concat(response.data.result));
        setSending(false);
        data.replies_count = data.replies_count + 1;
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Bình luận đã được đăng',
          visibilityTime: 2000,
        });
      })
      .catch(error => {
        setSending(false);
        alert(error);
      });
  };
   return (
    <View style={styles.largeContainer}>
      <SafeAreaView>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 50 }}
          data={replies}
          onEndReached={async () => {
            if (replies.length > 4) {
              setIsEnd(true);
              await fetchMore();
            }
          }}
          onEndReachedThreshold={0.5}
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={() => (
            <Card containerStyle={styles.container}>
              <View>
                <View style={styles.header}>
                  <View style={styles.headerAvatar}>
                    <TouchableOpacity onPress={() => GoToProfile()}>
                      <Image
                        style={styles.imgAvatar}
                        source={{ uri: data.author_avatar }}
                      />
                    </TouchableOpacity>
                    <View>
                      <TouchableOpacity>
                        <Text style={styles.txtAuthor}>{data.author_name}</Text>
                      </TouchableOpacity>
                      <View style={styles.rowFlexStart}>
                        <FontAwesome
                          name={'circle'}
                          size={8}
                          color={active_color}
                        />
                        <Text style={styles.txtCreateDate}>
                          {moment(new Date()).diff(
                            moment(data.modified_date),
                            'minutes'
                          ) < 60
                            ? moment(new Date()).diff(
                                moment(data.modified_date),
                                'minutes'
                              ) + ' phút trước'
                            : moment(new Date()).diff(
                                moment(data.modified_date),
                                'hours'
                              ) < 24
                            ? moment(new Date()).diff(
                                moment(data.modified_date),
                                'hours'
                              ) + ' giờ trước'
                            : moment(data.modified_date).format(
                                'hh:mm DD-MM-YYYY'
                              )}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <View style={styles.rowFlexStart}>
                    <Text style={styles.txtContent}>{data.content}</Text>
                  </View>
                </View>
              
                  {data.image  ? <Image
                    style={{
                      width: '100%',
                      height: 400,
                      alignSelf: 'center',
                      marginVertical: 8,
                    }}
                    source={{ uri: data.image }}
                  /> : null}

                  
 
                <View style={styles.footer}>
                  <View style={styles.flex1}>
                    <Pressable
                      style={({ pressed }) => [
                        { backgroundColor: pressed ? touch_color : '#fff' },
                        styles.btnVote,
                      ]}
                    >
                      <Text style={styles.txtVoteNumber}>
                        {data.upvote_count}
                      </Text>
                      <FontAwesome5
                        name={'thumbs-up'}
                        size={24}
                        color={main_color}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.flex1}>
                    <Pressable
                      onPress={() => alert('comment')}
                      style={({ pressed }) => [
                        { backgroundColor: pressed ? touch_color : '#fff' },
                        styles.btnVote,
                      ]}
                      onPress={() => alert('Vote')}
                    >
                      <Text style={styles.txtVoteNumber}>
                        {data.replies_count}
                      </Text>
                      <FontAwesome5
                        name={'comment-alt'}
                        size={24}
                        color={main_2nd_color}
                      />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Card>
          )}
          // ListFooterComponent={() =>
          //   isEnd ? (
          //     <View style={{ marginVertical: 12 }}>
          //       <ActivityIndicator size={'large'} color={main_color} />
          //     </View>
          //   ) : (
          //     <View style={{ margin: 4 }}></View>
          //   )
          // }
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
      </SafeAreaView>
      <View style={styles.containerInput}>
        {showOption ? (
          <View style={styles.row}>
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
            <TouchableOpacity style={styles.btnInputOption}>
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
          onChangeText={text => setComment(text)}
          placeholder="Nhập j đi tml.."
        />
        {sending ? (
          <View style={styles.btnInputOption}>
            <FontAwesome5 name={'paper-plane'} size={24} color={'#ccc'} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.btnInputOption}
            onPress={() => postComment()}
          >
            <FontAwesome5 name={'paper-plane'} size={24} color={main_color} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default Comment;
