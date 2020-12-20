import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Pressable,
} from 'react-native';
import styles from 'components/common/PostCard/styles';
import { Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import PostOptionModal from 'components/modal/PostOptionModal/PostOptionModal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getUser } from 'selectors/UserSelectors';
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import {
  active_color,
  main_2nd_color,
  main_color,
  touch_color,
} from '../../../constants/colorCommon';
import moment from 'moment';

import { useState } from 'react';
import { func } from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { api } from 'constants/route';
function PostCard(props) {
  const post = props.post;
  const [isVote, setIsVote] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [author, setAuthor] = useState();
  const curUser = useSelector(getUser);
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${curUser.jwtToken}` },
    };
    const fetchData = async () => {};
    fetchData();
  }, []);
  const GoToPost = () => {
    navigation.navigate(navigationConstants.post, {
      post: post,
      author: author,
    });
  };
  const GoToProfile = () => {
    navigation.navigate(navigationConstants.profile);
  };
  return (
    <Card containerStyle={styles.container}>
      <TouchableHighlight
        onPress={() => GoToPost()}
        underlayColor={touch_color}
        style={styles.card}
      >
        <View>
          <View style={styles.header}>
            <View style={styles.headerAvatar}>
              <TouchableOpacity onPress={() => GoToProfile()}>
                <Image
                  style={styles.imgAvatar}
                  source={{
                    uri: `data:image/gif;base64,${post.author_avatar}`
                  }}
                />
              </TouchableOpacity>
              <View>
                <TouchableOpacity>
                  <Text style={styles.txtAuthor}>{post.author_name}</Text>
                </TouchableOpacity>
                <View style={styles.rowFlexStart}>
                  <FontAwesome name={'circle'} size={8} color={active_color} />
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
                style={styles.btn3Dot}
                onPress={() => setModalVisible(true)}
              >
                <View style={styles.btnOption}>
                  <FontAwesome name={'ellipsis-v'} size={24} color="#c4c4c4" />
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
            <Text style={styles.txtContent} numberOfLines={3}>
              {}
              {post.string_contents[0].content.length < 80
                ? `${post.string_contents[0].content}`
                : `${post.string_contents[0].content.substring(0, 200)}...`}
            </Text>
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
        </View>
      </TouchableHighlight>
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
            <FontAwesome5 name={'thumbs-down'} size={24} color={main_color} />
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
            <Text style={styles.txtVoteNumber}>10</Text>
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
            onLongPress={() => setIsVote(true)}
            on={() => setIsVote(false)}
          >
            <Text style={styles.txtVoteNumber}>{post.upvote}</Text>
            <FontAwesome5 name={'thumbs-up'} size={24} color={main_color} />
          </Pressable>
        </View>
      </View>
      <PostOptionModal
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
    </Card>
  );
}

export default PostCard;

// {isVote ? (
//   <View style={styles.containerPopupVote}>
//     <FontAwesome5
//       style={styles.btnVoteInPopup}
//       name={'thumbs-up'}
//       size={24}
//       color={main_color}
//     />
//     <FontAwesome5
//       style={styles.btnVoteInPopup}
//       name={'thumbs-down'}
//       size={24}
//       color={main_2nd_color}
//     />
//   </View>
// ) : null}
