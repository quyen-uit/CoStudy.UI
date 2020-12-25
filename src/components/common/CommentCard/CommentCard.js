import { useTheme, useNavigation } from '@react-navigation/native';
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
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import styles from 'components/common/CommentCard/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { color } from 'react-native-reanimated';
import moment from 'moment';

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
import navigationConstants from 'constants/navigation';
import CommentOptionModal from 'components/modal/CommentOptionModal/CommentOptionModal';

const tmpComment = {
  id: '1',
  title: 'Đây là title 1',
  author: 'Nguyễn Văn Nam',
  content:
    'Bọn mình sẽ sử dụng Python, Jupiter Notebook và Google Collab để phân tích, hiển thị dữ liệu, vẽ biểu đồ các kiểu con đà điểu và bình luận nhé. Bọn mình sẽ sử dụng Python, Jupiter Notebook và Google Collab để phân tích, hiển thị dữ liệu, vẽ biểu đồ các kiểu con đà điểu và bình luận nhé',
  createdDate: '10 phut truoc',
};

const comment = {
  author: 'Võ Thanh Tâm',
  content: 'Đây là child content Đây là child content Đây là child content',
  createdDate: '10 phut truoc',
  amountVote: 10,
  amountComment: 20,
};
function ChildComment(props) {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.containerComment}>
      <TouchableOpacity onPress={() => alert('avatar is clicked')}>
        <Image
          style={styles.imgChildAvatar}
          source={require('../../../assets/avatar.jpeg')}
        />
      </TouchableOpacity>
      <TouchableHighlight
        style={styles.btnChildComment}
        underlayColor={touch_color}
        onPress={() => alert('click')}
        onLongPress={()=>setModalVisible(true)} 
      >
        <View>
          <Text style={styles.txtChildAuthor}>{comment.author}</Text>
          <Text style={styles.txtChildContent}>{comment.content}</Text>
          <View style={styles.footer}>
            <View style={styles.containerCreatedTime}>
              <FontAwesome name={'circle'} size={6} color={active_color} />
              <Text style={styles.txtChildCreateDate}>
                {comment.createdDate}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={styles.rowFlexStart}>
                <Text style={styles.txtChildVoteNumber}>10</Text>
                <TouchableOpacity>
                  <FontAwesome5
                    name={'thumbs-up'}
                    size={14}
                    color={main_color}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.rowFlexStart}>
                <Text style={styles.txtChildVoteNumber}>11</Text>
                <TouchableOpacity>
                  <FontAwesome5 name={'comment'} size={14} color={main_color} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
      <CommentOptionModal
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

function CommentCard(props) {
  const post = tmpComment;
  const navigation = useNavigation();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [isVote, setIsVote] = useState(false);
  const [showOption, setShowOption] = useState(true);
  const comment = props.comment;
  const isInPost = props.isInPost;
  const [modalVisible, setModalVisible] = useState(false);
  
  const GoToComment = () => {
    if (isInPost) {
      navigation.navigate(navigationConstants.comment);
    }
  };
  return (
    <View>
      <View style={styles.containerComment}>
        <TouchableOpacity onPress={() => alert('avatar is clicked')}>
          <Image
            style={styles.imgAvatar}
            source={{uri: comment.author_avatar}}
          />
        </TouchableOpacity>
        <View style={styles.shrink1}>
          <TouchableHighlight
            style={styles.btnBigComment}
            underlayColor={touch_color}
            onPress={() => GoToComment()}
            onLongPress={()=>setModalVisible(true)} 
          >
            <View>
              <Text style={styles.txtAuthor}>{comment.author_name}</Text>
              <Text style={styles.txtContent}>{comment.content}</Text>
              <View style={styles.footer}>
                <View style={styles.containerCreatedTime}>
                  <FontAwesome name={'circle'} size={8} color={active_color} />
                  <Text style={styles.txtCreateDate}>
                  {moment(new Date()).diff(
                    moment(comment.created_date),
                    'minutes'
                  ) < 60
                    ? moment(new Date()).diff(
                        moment(comment.created_date),
                        'minutes'
                      ) + ' phút trước'
                    : moment(new Date()).diff(
                        moment(comment.created_date),
                        'hours'
                      ) < 24
                    ? moment(new Date()).diff(
                        moment(comment.created_date),
                        'hours'
                      ) + ' giờ trước'
                    : moment(comment.created_date).format('hh:mm MM-DD-YYYY')}
                  </Text>
                </View>
                <View style={styles.row}>
                  <View style={styles.rowFlexStart}>
                    <Text style={styles.txtVoteNumber}>10</Text>
                    <TouchableOpacity>
                      <FontAwesome5
                        name={'thumbs-up'}
                        size={18}
                        color={main_color}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.rowFlexStart}>
                    <Text style={styles.txtVoteNumber}>11</Text>
                    <TouchableOpacity>
                      <FontAwesome5
                        name={'comment'}
                        size={18}
                        color={main_color}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableHighlight>
          {comment.image !='' ? <Image  source={{uri: comment.image}} style={{width: 150, height: 200, alignSelf: 'flex-start', margin: 4}}/>: null}
          
        </View>
      </View>
      <CommentOptionModal
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

export default CommentCard;

// {isInPost ? <ChildComment /> : null}