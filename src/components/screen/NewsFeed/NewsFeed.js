import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/NewsFeed/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import { Card } from 'react-native-elements';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import PostCard from '../../common/PostCard';
import Button from 'components/common/Button';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { api } from 'constants/route';

const list = [
  {
    id: '1',
    title: 'Đây là title 1',
    author: 'Nguyễn Văn Nam',
    content:
      'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    createdDate: '10 phut truoc',
  },
  {
    id: '2',
    title: 'Đây là title',
    author: 'Nguyễn Văn Nam',
    content:
      'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    createdDate: '10 phut truoc',
  },
  {
    title: 'Đây là title 2',
    author: 'Nguyễn Văn Nam',
    content:
      'Đây là contentttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt',
    createdDate: '10 phut truoc',
    id: '3',
  },
];
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function NewsFeed() {
  const { colors } = useTheme();
  const user = useSelector(getUser);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const GoToPost = () => {
    navigation.navigate(navigationConstants.post);
  };
  const [isLoading, setIsLoading] = useState(true);
  const curUser = useSelector(getUser);
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const config = {
    headers: { Authorization: `Bearer ${curUser.jwtToken}` },
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    const fetchData = async () => {
      await axios
        .get(api + 'Post/timeline', config)
        .then(res => {
          setPosts(res.data.result);
          setRefreshing(false);
        })

        .catch(error => alert(error));
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get(api + 'Post/timeline', config)
        .then(res => {
          setPosts(res.data.result);
          setIsLoading(false);
        })
        .catch(error => alert(error));
    };
    fetchData();
  }, []);
  const renderItem = ({ item }) => {
    return <PostCard post={item} />;
  };
  return (
    <View>
      <SafeAreaView>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl colors={[main_color]} refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
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

export default NewsFeed;

// <FlatList
//         showsVerticalScrollIndicator={false}
//         data={list}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//       />
