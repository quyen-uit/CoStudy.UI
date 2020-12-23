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
  Pressable,
  SafeAreaView,
  TextInput,
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
        .get(api + 'Post/comments/' + post.oid,config)
        .then(response => {
          
           console.log(response.data.result);
           setComments(response.data.result);
        })
        .catch(error => alert(error));
    };
    fetchData();
    return () => {
      isOut = true;
    };
  }, []);
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
                  onLongPress={() => setIsVote(true)}
                  on={() => setIsVote(false)}
                >
                  <Text style={styles.txtVoteNumber}>{post.upvote}</Text>
                  <FontAwesome5
                    name={'thumbs-up'}
                    size={24}
                    color={main_color}
                  />
                </Pressable>
              </View>
              {isVote ? (
                <View style={styles.containerPopupVote}>
                  <FontAwesome5
                    style={styles.btnVoteInPopup}
                    name={'thumbs-up'}
                    size={24}
                    color={main_color}
                  />
                  <FontAwesome5
                    style={styles.btnVoteInPopup}
                    name={'thumbs-down'}
                    size={24}
                    color={main_2nd_color}
                  />
                </View>
              ) : null}
              <View style={styles.flex1}>
                <Pressable
                  onPress={() => alert('comment')}
                  style={({ pressed }) => [
                    { backgroundColor: pressed ? touch_color : '#fff' },
                    styles.btnVote,
                  ]}
                  onPress={() => alert('Vote')}
                >
                  <Text style={styles.txtVoteNumber}>10</Text>
                  <FontAwesome5
                    name={'comment-alt'}
                    size={24}
                    color={main_color}
                  />
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
          data={list}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </ScrollView>
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
          placeholder="Nhập j đi tml.."
        />
        <TouchableOpacity style={styles.btnInputOption}>
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
