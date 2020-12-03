import React from 'react';
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
import {
  active_color,
  main_2nd_color,
  main_color,
  touch_color,
} from '../../../constants/colorCommon';
import { useState } from 'react';
import { func } from 'prop-types';
import { useNavigation } from '@react-navigation/native';

function PostCard(props) {
  const post = props.post;
  const [isVote, setIsVote] = useState(false);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const GoToPost = () => {
    navigation.navigate(navigationConstants.post);
  }
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
              <TouchableOpacity onPress={() => alert('avatar is clicked')}>
                <Image
                  style={styles.imgAvatar}
                  source={require('../../../assets/avatar.jpeg')}
                />
              </TouchableOpacity>
              <View>
                <TouchableOpacity>
                  <Text style={styles.txtAuthor}>{post.author}</Text>
                </TouchableOpacity>
                <View style={styles.rowFlexStart}>
                  <FontAwesome name={'circle'} size={8} color={active_color} />
                  <Text style={styles.txtCreateDate}>{post.createdDate}</Text>
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
            <Text style={styles.txtVoteNumber}>10</Text>
            <FontAwesome5 name={'thumbs-up'} size={24} color={main_color} />
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
            <FontAwesome5 name={'comment-alt'} size={24} color={main_color} />
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
