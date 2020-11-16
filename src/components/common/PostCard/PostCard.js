import React from 'react';
import { Text, View, TouchableOpacity, Image, Pressable } from 'react-native';
import styles from 'components/common/PostCard/styles';
import { Card } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { active_color } from '../../../constants/colorCommon';

function PostCard(props) {
  const post = props.post;

  return (
    <View>
      <Card containerStyle={styles.container} onPress={() => alert('hihi')}>
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity onPress={() => alert('avatar is clicked')}>
              <Image
                style={styles.imgAvatar}
                source={require('../../../assets/avatar.jpeg')}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: 8 }}>
              <Text style={styles.txtAuthor}>{post.author}</Text>
              <View style={styles.headerAuthor}>
                <FontAwesome name={'circle'} size={8} color={active_color} />
                <Text style={styles.txtCreateDate}>{post.createdDate}</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <TouchableOpacity onPress={() => alert('avatar is clicked')}>
              <View style={styles.btnOption}>
                <FontAwesome name={'ellipsis-v'} size={24} color="#c4c4c4" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ marginHorizontal: 8 }}>
          <Text style={styles.txtTitle}>{post.title}</Text>
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
            <Pressable onPress={() => alert('like')}>
              <View style={styles.btnVote}>
                <Text style={{ marginRight: 12, fontSize: 14 }}>10</Text>
                <FontAwesome5 name={'thumbs-up'} size={24} color="#c4c4c4" />
              </View>
            </Pressable>
          </View>

          <View style={{ flex: 1 }}>
            <Pressable onPress={() => alert('comment')}>
              <View style={styles.btnVote}>
                <Text style={{ marginRight: 12, fontSize: 14 }}>10</Text>
                <FontAwesome5 name={'comment-alt'} size={24} color="#c4c4c4" />
              </View>
            </Pressable>
          </View>
        </View>
      </Card>
    </View>
  );
}

export default PostCard;
