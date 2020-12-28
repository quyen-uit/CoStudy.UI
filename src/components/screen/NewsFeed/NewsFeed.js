import { useTheme, DrawerActions } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  RefreshControl,
  ToastAndroid,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector , useDispatch} from 'react-redux';
import styles from 'components/screen/NewsFeed/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { getUser } from 'selectors/UserSelectors';
import { Card } from 'react-native-elements';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import PostCard from '../../common/PostCard';
import Button from 'components/common/Button';
import { useNavigation, useRoute } from '@react-navigation/native';
import { api } from 'constants/route';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import { getAPI } from '../../../apis/instance';
import { actionTypes, update } from 'actions/UserActions';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function NewsFeed() {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const navigation = useNavigation();
  const route = useRoute();
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
  React.useEffect(() => {
    console.log('dispatch update user')
    dispatch(update(user.jwtToken));
  },[]);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsEnd(false);
    const fetchData1 = async () => {
      await getAPI(curUser.jwtToken)
        .get(api + 'User/current')
        .then(async response => {
          await getAPI(curUser.jwtToken)
            .get(api + `Post/timeline/skip/0/count/5`)
            .then(res => {
              res.data.result.forEach(item => {
                response.data.result.post_saved.forEach(i => {
                  if (i == item.oid) {
                    item.saved = true;
                  } else item.saved = false;
                });
                item.vote = 0;
                response.data.result.post_upvote.forEach(i => {
                  if (i == item.oid) {
                    item.vote = 1;
                  }
                });
                response.data.result.post_downvote.forEach(i => {
                  if (i == item.oid) {
                    item.vote = -1;
                  }
                });
              });

              setPosts(res.data.result);
              setRefreshing(false);

              setSkip(5);
            })
            .catch(error => alert(error));
        })
        .catch(error => alert(error));
    };

    fetchData1();
  }, []);
  useEffect(() => {
    let isRender = true;
    const fetchData1 = async () => {
      await getAPI(curUser.jwtToken)
        .get(api + 'User/current')
        .then(async resUser => {
          await getAPI(curUser.jwtToken)
            .get(api + `Post/timeline/skip/0/count/5`)
            .then(async resPost => {
              resPost.data.result.forEach(item => {
                resUser.data.result.post_saved.forEach(i => {
                  if (i == item.oid) {
                    item.saved = true;
                  } else item.saved = false;
                });
                item.vote = 0;
                resUser.data.result.post_upvote.forEach(i => {
                  if (i == item.oid) {
                    item.vote = 1;
                  }
                });
                resUser.data.result.post_downvote.forEach(i => {
                  if (i == item.oid) {
                    item.vote = -1;
                  }
                });
              });
              if (isRender) {
                setPosts(resPost.data.result);
                setIsLoading(false);

                setSkip(5);
                if (route.params?.title) {
                  let list = [];

                  let promises = route.params.listImg.map(async image => {
                    const uri = image.path;
                    const filename = uuidv4();
                    const uploadUri =
                      Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                    const task = storage()
                      .ref('post/' + curUser.id + '/' + filename)
                      .putFile(uploadUri);
                    // set progress state
                    task.on('state_changed', snapshot => {});
                    try {
                      await task.then(async response => {
                        await storage()
                          .ref(response.metadata.fullPath)
                          .getDownloadURL()
                          .then(url => {
                            list = [
                              ...list,
                              {
                                discription: image.discription,
                                image_hash: url,
                              },
                            ];
                          });
                      });
                    } catch (e) {
                      console.error(e);
                    }
                  });
                  Promise.all(promises).then(async () => {
                    await getAPI(curUser.jwtToken)
                      .post(api + 'Post/add', {
                        title: route.params.title,
                        string_contents: [
                          { content_type: 0, content: route.params.content },
                        ],
                        image_contents: list,
                        fields: route.params.fields,
                      })
                      .then(response1 => {
                        Toast.show({
                          type: 'success',
                          position: 'top',
                          text1: 'Đăng bài thành công.',
                          visibilityTime: 2000,
                        });
                        let tmp = response1.data.result.post;
                        tmp.vote = 0;
                        response.data.result.post_upvote.forEach(i => {
                          if (i == tmp.oid) {
                            item.vote = 1;
                          }
                        });
                        response.data.result.post_downvote.forEach(i => {
                          if (i == tmp.oid) {
                            item.vote = -1;
                          }
                        });
                        if (isRender) setPosts([tmp, ...res.data.result]);
                      })
                      .catch(error => alert(error));
                  });
                }
              }
            })
            .catch(error => alert(error));
        })
        .catch(error => alert(error));
    };

    fetchData1();
    return () => {
      isRender = false;
    };
  }, [route.params?.title]);

  const fetchData = async () => {
    await getAPI(curUser.jwtToken)
      .get(api + 'User/current')
      .then(async resUser => {
        await getAPI(curUser.jwtToken)
          .get(api + `Post/timeline/skip/${skip}/count/5`)
          .then(res => {
            res.data.result.forEach(item => {
              resUser.data.result.post_saved.forEach(i => {
                 if (i == item.oid) {
                  item.saved = true;
                } else item.saved = false;
              });
              item.vote = 0;
              resUser.data.result.post_upvote.forEach(i => {
                if (i == item.oid) {
                  item.vote = 1;
                }
              });
              resUser.data.result.post_downvote.forEach(i => {
                if (i == item.oid) {
                  item.vote = -1;
                }
              });
            });
            if (isEnd == false) return;
            if (res.data.result.length > 0) {
              setPosts(posts.concat(res.data.result));

              setSkip(skip + 5);
            }
            setIsEnd(false);
          })
          .catch(error => alert(error));
      })
      .catch(error => alert(error));
    // await axios
    //   .get(api + `Post/timeline/skip/${skip}/count/5`, config)
    //   .then(res => {
    //     if (isEnd == false) return;
    //     setPosts(posts.concat(res.data.result));
    //     setIsEnd(false);
    //     setSkip(skip + 5);
    //   })
    //   .catch(error => alert(error));
  };
  const renderItem = ({ item }) => {
    return <PostCard post={item} />;
  };
  return (
    <View>
      <View
        style={{
          height: 56,
          backgroundColor: main_color,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Image
              style={styles.imgAvatar}
              source={{ uri: curUser.avatar.image_hash }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>
            Bảng tin
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => navigation.navigate(navigationConstants.search)}
          >
            <Icon name={'search'} size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
      <SafeAreaView>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={posts}
          style={{ marginBottom: 110 }}
          onEndReached={async () => {
            if (posts.length > 2) {
              setIsEnd(true);
              if (refreshing) {
                setIsEnd(false);
                return;
              }
              await fetchData();
            }
          }}
          onEndReachedThreshold={0.7}
          renderItem={item => renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl
              colors={[main_color]}
              refreshing={refreshing}
              onRefresh={() => {
                onRefresh();
              }}
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
