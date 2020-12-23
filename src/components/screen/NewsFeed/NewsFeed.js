import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  TouchableHighlight,
  RefreshControl,
  ToastAndroid,
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
  const [isEnd, setIsEnd] = useState(false);
  const [skip, setSkip] = useState(0);
  const config = {
    headers: { Authorization: `Bearer ${curUser.jwtToken}` },
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsEnd(false);
    const fetchData1 = async () => {
      await axios
        .get(api + `Post/timeline/skip/0/count/5`, config)
        .then(res => {
          setPosts(res.data.result);
          setSkip(5);
          setRefreshing(false);
           ToastAndroid.show('Dữ liệu đã được cập nhật.', ToastAndroid.SHORT);
        })
        .catch(error => alert(error));
    };
    fetchData1();
  }, []);
  useEffect(() => {
    const fetchData1 = async () => {
      await axios
        .get(api + `Post/timeline/skip/${skip}/count/5`, config)
        .then(res => {
          setPosts(res.data.result);
          setIsLoading(false);

          setSkip(5);
        })
        .catch(error => alert(error));
    };
    fetchData1();
  }, []);
  const fetchData = async () => {
    await axios
      .get(api + `Post/timeline/skip/${skip}/count/5`, config)
      .then(res => {
        if (isEnd == false) return;
        setPosts(posts.concat(res.data.result));
        setIsEnd(false);
        setSkip(skip + 5);
        ToastAndroid.show('Dữ liệu đã được cập nhật.', ToastAndroid.SHORT);
      })
      .catch(error => alert(error));
  };
  const renderItem = ({ item }) => {
    return <PostCard post={item} />;
  };
  return (
    <View>
      <SafeAreaView>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          onEndReached={async () => {
            setIsEnd(true);
            if (refreshing) {
              setIsEnd(false);
              return;
            };
           
            await fetchData();
          }}
          onEndReachedThreshold={0.1}
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              colors={[main_color]}
              refreshing={refreshing}
              onRefresh={()=>onRefresh()}
            />
          }
          ListFooterComponent={() =>
            isEnd ? (
              <View style={{ marginVertical: 12 }}>
                <ActivityIndicator size={'large'} color={main_color} />
              </View>
            ) : (
              <View style={{ margin: 4 }}></View>
            )
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
