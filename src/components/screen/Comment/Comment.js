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
  Keyboard,
  ToastAndroid,
  Pressable,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from 'components/screen/Comment/styles';

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
import ReplyCard from 'components/common/ReplyCard';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import { getBasicInfo, getJwtToken, getUser } from 'selectors/UserSelectors';
import { useSelector } from 'react-redux';
import navigationConstants from 'constants/navigation';
import CommentService from 'controllers/CommentService';
import UserService from 'controllers/UserService';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function Comment(props) {
  const route = useRoute();
  const userInfo = useSelector(getBasicInfo);
  const jwtToken = useSelector(getJwtToken);


  const [showOption, setShowOption] = useState(true);
  const [data, setData] = useState(route.params.comment);
  const [isLoading, setIsLoading] = useState(false);
  const [replies, setReplies] = useState([]);

  //comment
  const [comment, setComment] = useState('');
  const [vote, setVote] = useState(route.params.vote);
  console.log(route.params.vote);
  const [upvote, setUpvote] = useState(route.params.upvote);
  const [downvote, setDownvote] = useState(route.params.downvote);
  const [comment_count, setCommentCount] = useState(route.params.replies);

  const [sending, setSending] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    route.params.onUpvote(upvote);
    route.params.onVote(vote);
  }, [upvote]);
  useEffect(() => {
    route.params.onDownvote(downvote);
    route.params.onVote(vote);
  }, [downvote]);

  const GoToProfile = () => {
    navigation.push(navigationConstants.profile, { id: data.author_id });
  };
  const renderItem = ({ item }) => {
    return (
      <View style={{ opacity: item.opacity }}>
        <ReplyCard comment={item} />
      </View>
    );
  };
  useEffect(() => {
    setIsLoading(true);
    let isOut = false;
    const fetchData = async () => {
      await CommentService.getAllReply(jwtToken, {oid: data.oid, skip: 0, count: 100})
        .then(async response => {
          if (!isOut) {
            const a = response.data.result.map(async i => {
              await UserService.getUserById(i.author_id)
                .then(user => {
                  i.avatar = user.data.result.avatar.image_hash;
                  i.name =
                    user.data.result.first_name + ' ' + user.data.result.last_name;
                  i.opacity = 1;
                  if (i.is_vote_by_current) i.vote = 1;
                  else if (i.is_downvote_by_current) i.vote = -1;
                  else i.vote = 0;
                });
            });
            Promise.all(a).then(() => {
              setIsLoading(false);
              setReplies(response.data.result);
            });
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isOut = true;
    };
  }, []);

  const fetchMore = async () => {
    return;
    // await getAPI(jwtToken)
    //   .get(api + 'Comment/get/' + post.oid + '/skip/' + skip + '/count/5')
    //   .then(response => {
    //     if (response.data.result.length > 0) {
    //       setSkip(skip + 5);
    //       response.data.result.forEach(i => (i.opacity = 1));

    //       setComments(comments.concat(response.data.result));
    //     }
    //     setIsEnd(false);
    //   })
    //   .catch(error => console.log(error));
  };
  const onUpvote = async () => {
    if (vote == 1) {
      ToastAndroid.show('Bạn đã upvote cho bình luận này.', 1000);
      return;
    } else if (vote == 0) {
      setVote(1);
      setUpvote(upvote + 1);
    } else {
      setVote(1);
      setUpvote(upvote + 1);
      setDownvote(downvote - 1);
    }
    await CommentService.upVoteComment(jwtToken,data.oid)
      .then(response => ToastAndroid.show('Đã upvote', ToastAndroid.SHORT))
      .catch(err => console.log(err));
  };
  const onDownvote = async () => {
    if (vote == -1) {
      ToastAndroid.show('Bạn đã downvote cho bình luận này.', 1000);
      return;
    } else if (vote == 0) {
      setVote(-1);
      setDownvote(downvote + 1);
    } else {
      setVote(-1);
      setDownvote(downvote + 1);
      setUpvote(upvote - 1);
    }
    await CommentService.downVoteComment(jwtToken, data.oid)
      .then(response => ToastAndroid.show('Đã downvote', ToastAndroid.SHORT))
      .catch(err => console.log(err));
  };
  const postComment = async () => {
    Keyboard.dismiss();

    if (comment == '') {
      Alert.alert('Thông báo', 'Bạn chưa nhập bình luận..');
      return;
    }
    setSending(true);
    const tmp = {
      content: comment,
      author_id: userInfo.id,
      status: 0,
      created_date: new Date(),
      modified_date: new Date(),
      upvote_count: 0,
      downvote_count: 0,
      avatar: userInfo.avatar,
      name: userInfo.first_name + userInfo.last_name,
      vote: 0,
      opacity: 0.5,
    };
    setReplies(replies.concat(tmp));
    ToastAndroid.show('Đang trả lời..', ToastAndroid.SHORT);
    await CommentService.createReply(jwtToken, {comment: comment, oid: data.oid})
      .then(response => {
        setComment('');
        tmp.opacity = 1;
        setReplies(replies.concat(tmp));
        setSending(false);

        Toast.show({
          type: 'success',
          position: 'top',
          text1: 'Bình luận đã được đăng',
          visibilityTime: 2000,
        });
        route.params.onComment(comment_count + 1);
        setCommentCount(comment_count + 1);
      })
      .catch(error => {
        setSending(false);
        console.log(error);
      });
  };
  return (
    <View style={styles.largeContainer}>
      <SafeAreaView>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 54, paddingBottom: 12 }}
          data={replies}
          onEndReached={async () => {
            if (replies.length > 4) {
              // setIsEnd(true);
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

                {data.image ? (
                  <Image
                    style={{
                      width: '100%',
                      height: 400,
                      alignSelf: 'center',
                      marginVertical: 8,
                    }}
                    source={{ uri: data.image }}
                  />
                ) : null}

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
                        color={vote == -1 ? main_color : '#ccc'}
                      />
                    </Pressable>
                  </View>

                  <View style={styles.flex1}>
                    <Pressable
                      
                      style={({ pressed }) => [
                        { backgroundColor: pressed ? touch_color : '#fff' },
                        styles.btnVote,
                      ]}
                      
                    >
                      <Text style={styles.txtVoteNumber}>{comment_count}</Text>
                      <FontAwesome5
                        name={'comment-alt'}
                        size={24}
                        color={main_2nd_color}
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
                        color={vote == 1 ? main_color : '#ccc'}
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
          value={comment}
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
