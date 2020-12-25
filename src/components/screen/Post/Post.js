import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
  Pressable,
  SafeAreaView,
  TextInput,
  ToastAndroid,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from 'components/screen/Post/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { color } from 'react-native-reanimated';
import {
  main_2nd_color,
  main_color,
  touch_color,
  active_color,
  btn_not_selected,
  btn_selected,
  background_gray_color,
} from 'constants/colorCommon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Card } from 'react-native-elements';
import CommentCard from 'components/common/CommentCard';
import { useRoute } from '@react-navigation/native';
import { getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { api } from 'constants/route';
import moment from 'moment';
import ImagePicker from 'react-native-image-crop-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';

const tmpPost = {
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
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function Post(props) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [isVote, setIsVote] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const route = useRoute();
  const [post, setPost] = useState(route.params.post);
  const [author, setAuthor] = useState([]);
  const curUser = useSelector(getUser);
  const [isLoading, setIsLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [upvote, setUpvote] = useState(route.params.upvote);
  const [downvote, setDownvote] = useState(route.params.downvote);
  const [vote, setVote] = useState(route.params.vote);

  const [imgComment, setImgComment] = useState('');
  const [comment, setComment] = useState('');

  const renderItem = ({ item }) => {
    return <CommentCard comment={item} isInPost={true} />;
  };
  const config = {
    headers: { Authorization: `Bearer ${curUser.jwtToken}` },
  };

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${curUser.jwtToken}` },
    };
    const fetchData = async () => {};
    fetchData();
  }, []);
  useEffect(() => {
    let isOut = false;
    const fetchData = async () => {
      await axios
        .get(api + 'Post/comments/' + post.oid, config)
        .then(response => {
          setComments(response.data.result);
        })
        .catch(error => alert(error));
    };
    fetchData();
    return () => {
      isOut = true;
    };
  }, []);
  const onUpvote = async () => {
    if (vote == 1) {
      ToastAndroid.show('Bạn đã upvote cho bài viết này.')
      return;
    } else if (vote == 0) {
      setVote(1);
      setUpvote(upvote + 1);
    } else 
    {
      setVote(1);
      setUpvote(upvote + 1);
      setDownvote(downvote - 1);
    }
    await axios
      .post(api + 'Post/post/upvote/' + post.oid, { id: post.oid }, config)
      .then(response => ToastAndroid.show('Đã upvote', ToastAndroid.SHORT));
  };
  const onDownvote = async () => {
    if (vote == -1) {
      ToastAndroid.show('Bạn đã downvote cho bài viết này.')
      return;
    } else if (vote == 0) {
      setVote(-1);
      setDownvote(downvote + 1);
    } else 
    {
      setVote(-1);
      setDownvote(downvote + 1);
      setUpvote(upvote - 1);
    }
    await axios
      .post(api + 'Post/post/downvote/' + post.oid, { id: post.oid }, config)
      .then(response => ToastAndroid.show('Đã downvote', ToastAndroid.SHORT));
  };
  const pickImage = () => {
 

    ImagePicker.openPicker({
      width: 800,
      height: 1000,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        setImgComment(image);
      }
    });
  };
  const postComment = async () => {
    let img = '';
     if (comment == '') {
      Alert.alert('Thông báo', 'Bạn chưa nhập bình luận..');
      return;
    }

    if (imgComment) {
      image = imgComment;
      const uri = image.path;
      const filename = uuidv4();
      const uploadUri =
        Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const task = storage()
        .ref('comment/' + post.oid + '/' + filename)
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
              img = url;
            });
        });
      } catch (e) {
        console.error(e);
      }
    }
    
    await axios
      .post(
        api + 'Post/comment/add',
        { content: comment, image_hash: img, post_id: post.oid },
        config
      )
      .then(response => {
        setImgComment('');
        setComment('');
        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Bình luận đã được đăng',
          visibilityTime: 2000,
        });
      })
      .catch(error => alert(error));
  };

  return (
    <View style={styles.largeContainer}>
      <ScrollView>
        <Card containerStyle={styles.container}>
          <View>
            <View style={styles.header}>
              <View style={styles.headerAvatar}>
                <TouchableOpacity onPress={() => alert('avatar is clicked')}>
                  <Image
                    style={styles.imgAvatar}
                    source={{
                      uri: post.author_avatar,
                    }}
                  />
                </TouchableOpacity>
                <View>
                  <TouchableOpacity>
                    <Text style={styles.txtAuthor}>{post.author_name}</Text>
                  </TouchableOpacity>
                  <View style={styles.rowFlexStart}>
                    <FontAwesome
                      name={'circle'}
                      size={8}
                      color={active_color}
                    />
                    <Text style={styles.txtCreateDate}>
                      {moment(new Date()).diff(
                        moment(post.created_date),
                        'minutes'
                      ) < 60
                        ? moment(new Date()).diff(
                            moment(post.created_date),
                            'minutes'
                          ) + ' phút trước'
                        : moment(new Date()).diff(
                            moment(post.created_date),
                            'hours'
                          ) < 24
                        ? moment(new Date()).diff(
                            moment(post.created_date),
                            'hours'
                          ) + ' giờ trước'
                        : moment(post.created_date).format('hh:mm MM-DD-YYYY')}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <TouchableHighlight
                  activeOpacity={1}
                  underlayColor={touch_color}
                  style={styles.btnBookmark}
                  onPress={() => alert('avatar is clicked')}
                >
                  <View style={styles.btnOption}>
                    <FontAwesome
                      name={'bookmark'}
                      size={32}
                      color={main_color}
                    />
                  </View>
                </TouchableHighlight>
              </View>
            </View>
            <View>
              <View style={styles.rowFlexStart}>
                <FontAwesome
                  style={styles.iconTitle}
                  name={'angle-double-right'}
                  size={20}
                  color={main_color}
                />
                <Text style={styles.txtTitle}>{post.title}</Text>
              </View>
              <Text style={styles.txtContent}>
                {post.string_contents[0].content}
              </Text>
            </View>

            <View>
              {post.image_contents
                ? post.image_contents.map((item, index) => {
                    return (
                      <View
                        style={{
                          marginHorizontal: 16,
                          borderBottomColor: main_color,
                          borderBottomWidth: 0.5,
                        }}
                        key={index}
                      >
                        <Image
                          style={{
                            width: '100%',
                            height: 400,
                            alignSelf: 'center',
                            marginVertical: 8,
                          }}
                          source={{ uri: item.image_hash }}
                        />

                        <Text style={styles.txtDes}>{item.discription}</Text>
                      </View>
                    );
                  })
                : null}
            </View>

            <View style={styles.containerTag}>
              {post.fields.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => alert('tag screen')}
                >
                  <View style={styles.btnTag}>
                    <Text style={styles.txtTag}>{item.value}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.footer}>
              <View style={styles.flex1}>
                <Pressable
                  style={({ pressed }) => [
                    { backgroundColor: pressed ? touch_color : '#fff' },
                    styles.btnVote,
                  ]}
                  onPress={() => onDownvote()}
                >
                  <Text style={styles.txtVoteNumber}>{downvote}</Text>
                  <FontAwesome5
                    name={'thumbs-down'}
                    size={24}
                    color={vote == -1 ? btn_selected : btn_not_selected}
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
                >
                  <Text style={styles.txtVoteNumber}>
                    {post.comments_countd}
                  </Text>
                  <FontAwesome5
                    name={'comment-alt'}
                    size={22}
                    color={main_color}
                  />
                </Pressable>
              </View>
              <View style={styles.flex1}>
                <Pressable
                  style={({ pressed }) => [
                    { backgroundColor: pressed ? touch_color : '#fff' },
                    styles.btnVote,
                  ]}
                  onPress={() => onUpvote()}
                >
                  <Text style={styles.txtVoteNumber}>{upvote}</Text>
                  <FontAwesome5
                    name={'thumbs-up'}
                    size={24}
                    color={vote == 1 ? btn_selected : btn_not_selected}                  />
                </Pressable>
              </View>
            </View>
          </View>
        </Card>
        <TouchableOpacity>
          <Text style={styles.txtPreviousComment}>
            Xem các bình luận trước ...
          </Text>
        </TouchableOpacity>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={comments}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </ScrollView>

      {imgComment != '' ? (
        <View style={{ position: 'absolute', right: 0, bottom: 60 }}>
          <Image
            style={{
              height: 100,
              width: 80,
              alignSelf: 'flex-end',
              margin: 4,
              marginRight: 16,
            }}
            source={{ uri: imgComment.path }}
          />
          <TouchableOpacity
            onPress={() => {
              setImgComment('');
            }}
            style={{
              position: 'absolute',
              alignSelf: 'flex-end',
              borderRadius: 30,
              right: 10,
              backgroundColor: '#ccc',
            }}
          >
            <FontAwesome5 name={'times-circle'} size={20} color={'#fff'} />
          </TouchableOpacity>
        </View>
      ) : null}
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
            <TouchableOpacity
              style={styles.btnInputOption}
              onPress={() => pickImage()}
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
          onChangeText={text => setComment(text)}
          placeholder="Nhập j đi tml.."
        />
        <TouchableOpacity
          style={styles.btnInputOption}
          onPress={() => postComment()}
        >
          <FontAwesome5 name={'paper-plane'} size={24} color={main_color} />
        </TouchableOpacity>
      </View>

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

export default Post;
