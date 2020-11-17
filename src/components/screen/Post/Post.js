import { useTheme } from '@react-navigation/native';
import React, { useState } from 'react';
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
} from 'constants/colorCommon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Card } from 'react-native-elements';
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
const comment = {
  author: 'Võ Thanh Tâm',
  content: 'Đây là content',
  createdDate: '10 phut truoc',
  amountVote: 10,
  amountComment: 20,
};
function Comment(props) {
  const comment = props.comment;
  return (
    <View style={styles.containerComment}>
      <TouchableOpacity onPress={() => alert('avatar is clicked')}>
        <Image
          style={styles.imgAvatar}
          source={require('../../../assets/avatar.jpeg')}
        />
      </TouchableOpacity>
      <TouchableHighlight
        style={styles.btnBigComment}
        underlayColor={touch_color}
        onPress={() => alert('click')}
      >
        <View>
          <Text style={styles.txtAuthor}>{comment.author}</Text>
          <Text style={styles.txtContent}>{comment.content}</Text>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <View
              style={{
                marginRight: 24,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <FontAwesome name={'circle'} size={8} color={active_color} />
              <Text style={styles.txtCreateDate}>{comment.createdDate}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.rowFlexStart}>
                <Text style={{ marginHorizontal: 8, fontSize: 12 }}>10</Text>
                <TouchableOpacity>
                  <FontAwesome5
                    name={'thumbs-up'}
                    size={18}
                    color={main_color}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rowFlexStart}>
                <Text style={{ marginHorizontal: 8, fontSize: 12 }}>11</Text>
                <TouchableOpacity>
                  <FontAwesome5 name={'comment'} size={18} color={main_color} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
}
function Post(props) {
  const post = tmpPost;
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [isVote, setIsVote] = useState(false);

  const renderItem = ({ item }) => {
    return <Comment comment={item} />;
  };
  return (
    <ScrollView>
      <Card containerStyle={styles.container}>
        <View>
          <View style={styles.header}>
            <View style={styles.headerAvatar}>
              <TouchableOpacity onPress={() => alert('avatar is clicked')}>
                <Image
                  style={styles.imgAvatar}
                  source={require('../../../assets/avatar.jpeg')}
                />
              </TouchableOpacity>
              <View style={{ marginLeft: 8 }}>
                <TouchableOpacity>
                  <Text style={styles.txtAuthor}>{post.author}</Text>
                </TouchableOpacity>
                <View style={styles.rowFlexStart}>
                  <FontAwesome name={'circle'} size={8} color={active_color} />
                  <Text style={styles.txtCreateDate}>{post.createdDate}</Text>
                </View>
              </View>
            </View>

            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <TouchableHighlight
                activeOpacity={1}
                underlayColor={touch_color}
                style={{ borderRadius: 24 }}
                onPress={() => alert('avatar is clicked')}
              >
                <View style={styles.btnOption}>
                  <FontAwesome name={'bookmark'} size={24} color={main_color} />
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{ marginHorizontal: 8 }}>
            <View style={styles.rowFlexStart}>
              <FontAwesome
                style={{ marginLeft: 8 }}
                name={'angle-double-right'}
                size={20}
                color={main_color}
              />
              <Text style={styles.txtTitle}>{post.title}</Text>
            </View>
            <Text style={styles.txtContent}>{post.content}</Text>
          </View>

          <Image
            style={styles.imgContent}
            source={require('../../../assets/test.png')}
          />

          <View style={styles.containerTag}>
            <TouchableOpacity onPress={() => alert('tag screen')}>
              <View style={styles.btnTag}>
                <Text style={styles.txtTag}>Design pattern</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('tag screen')}>
              <View style={styles.btnTag}>
                <Text style={styles.txtTag}>Cơ sở dữ liệu</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={{ flex: 1 }}>
              <Pressable
                style={({ pressed }) => [
                  { backgroundColor: pressed ? touch_color : '#fff' },
                  styles.btnVote,
                ]}
                onLongPress={() => setIsVote(true)}
                on={() => setIsVote(false)}
              >
                <Text style={{ marginRight: 12, fontSize: 14 }}>10</Text>
                <FontAwesome5 name={'thumbs-up'} size={24} color={main_color} />
              </Pressable>
            </View>
            {isVote ? (
              <View
                style={{
                  borderRadius: 32,
                  backgroundColor: '#f0f0f0',
                  position: 'absolute',
                  flexDirection: 'row',
                  bottom: 40,
                }}
              >
                <FontAwesome5
                  style={{ marginHorizontal: 16, marginVertical: 8 }}
                  name={'thumbs-up'}
                  size={24}
                  color={main_color}
                />
                <FontAwesome5
                  style={{ margin: 16, marginVertical: 8 }}
                  name={'thumbs-down'}
                  size={24}
                  color={main_2nd_color}
                />
              </View>
            ) : null}
            <View style={{ flex: 1 }}>
              <Pressable
                onPress={() => alert('comment')}
                style={({ pressed }) => [
                  { backgroundColor: pressed ? touch_color : '#fff' },
                  styles.btnVote,
                ]}
                onPress={() => alert('Vote')}
              >
                <Text style={{ marginRight: 12, fontSize: 14 }}>10</Text>
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
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            marginLeft: 16,
            marginTop: 8,
          }}
        >
          Xem các bình luận trước ...
        </Text>
      </TouchableOpacity>
      
        <SafeAreaView>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={list}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </SafeAreaView>
      
    </ScrollView>
  );
}

export default Post;
