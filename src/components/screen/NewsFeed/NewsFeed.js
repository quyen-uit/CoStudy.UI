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
import { useSelector, useDispatch } from 'react-redux';
import styles from 'components/screen/NewsFeed/styles';
import { getBasicInfo, getJwtToken, getUser } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import PostCard from '../../common/PostCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import { actionTypes, update } from 'actions/UserActions';
import ImageView from 'react-native-image-viewing';
import PostOptionModal from 'components/modal/PostOptionModal/PostOptionModal';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';
import GetLocation from 'react-native-get-location';
import {
  Modal,
  ModalFooter,
  ModalButton,
  ModalContent,
} from 'react-native-modals';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function NewsFeed() {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const GoToPost = () => {
    navigation.navigate(navigationConstants.post);
  };
  const [isLoading, setIsLoading] = useState(true);
  const userInfo = useSelector(getBasicInfo);
  const jwtToken = useSelector(getJwtToken);
  const [pickFieldVisible, setPickFieldVisible] = useState(false);
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [skip, setSkip] = useState(0);

  ///image view
  const [imgView, setImgView] = useState();
  const [visible, setIsVisible] = useState(false);
  const onViewImage = React.useCallback((value, uri) => {
    setIsVisible(true);
    setImgView(uri);
  });
  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [idModal, setIdModal] = useState(null);
  const [savedModal, setSavedModal] = useState();
  const onModal = React.useCallback((value, id, saved) => {
    setModalVisible(value);
    setIdModal(id);
    setSavedModal(saved);
  });
  const onVisibleCallBack = React.useCallback(value => {
    setModalVisible(value);
  });
  React.useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log(location);
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      });

    const fetch = async () => {
      await UserService.getFieldByUserId(jwtToken, userInfo.id)
        .then(res => {
          if (res.data.result.length < 1) setPickFieldVisible(true);
        })
        .catch(err => console.log(err));
      await UserService.getNewToken(jwtToken)
        .then(res => dispatch(update(res.data.result.jwtToken)))
        .catch(err => console.log(err));
    };
    fetch();
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsEnd(false);
    const fetchData1 = async () => {
      await UserService.getCurrentUser(jwtToken)
        .then(async response => {
          await PostService.getTimeline(jwtToken, 0, 5)
            .then(res => {
              res.data.result.forEach(item => {
                response.data.result.post_saved.forEach(i => {
                  if (i == item.oid) {
                    item.saved = true;
                  } else item.saved = false;
                });
                // set vote
                item.vote = 0;
                if (item.is_downvote_by_current) item.vote = -1;
                else if (item.is_vote_by_current) item.vote = 1;
              });

              setPosts(res.data.result);
              setRefreshing(false);

              setSkip(5);
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    };

    fetchData1();
  }, []);
  useEffect(() => {
    let isRender = true;
    const fetchData1 = async () => {
      await UserService.getCurrentUser(jwtToken)
        .then(async resUser => {
          await PostService.getTimeline(jwtToken, 0, 5)
            .then(async resPost => {
              resPost.data.result.forEach(item => {
                resUser.data.result.post_saved.forEach(i => {
                  if (i == item.oid) {
                    item.saved = true;
                  } else item.saved = false;
                });
                // set vote
                item.vote = 0;
                if (item.is_downvote_by_current) item.vote = -1;
                else if (item.is_vote_by_current) item.vote = 1;
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
                      .ref('post/' + userInfo.id + '/' + filename)
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
                    await PostService.createPost(jwtToken, {
                      title: route.params.title,
                      content: route.params.content,
                      list: list,
                      fields: route.params.fields,
                    })
                      .then(response1 => {
                        Toast.show({
                          type: 'success',
                          position: 'top',
                          text1: 'Đăng bài thành công.',
                          visibilityTime: 2000,
                        });
                        let tmp = response1.data.result;
                        tmp.vote = 0;
                        tmp.saved = false;

                        if (isRender) setPosts([tmp, ...resPost.data.result]);
                      })
                      .catch(error => console.log(error));
                  });
                }
              }
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    };

    fetchData1();
    return () => {
      isRender = false;
    };
  }, [route.params?.title]);

  const fetchData = async () => {
    await UserService.getCurrentUser(jwtToken)
      .then(async resUser => {
        await PostService.getTimeline(jwtToken, skip, 5)
          .then(res => {
            res.data.result.forEach(item => {
              resUser.data.result.post_saved.forEach(i => {
                if (i == item.oid) {
                  item.saved = true;
                } else item.saved = false;
              });
              // set vote
              item.vote = 0;
              if (item.is_downvote_by_current) item.vote = -1;
              else if (item.is_vote_by_current) item.vote = 1;

              // resUser.data.result.post_upvote.forEach(i => {
              //   if (i == item.oid) {
              //     item.vote = 1;
              //   }
              // });
              // resUser.data.result.post_downvote.forEach(i => {
              //   if (i == item.oid) {
              //     item.vote = -1;
              //   }
              // });
            });
            if (isEnd == false) return;
            if (res.data.result.length > 0) {
              setPosts(posts.concat(res.data.result));

              setSkip(skip + 5);
              setIsEnd(false);
            }
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
    // await axios
    //   .get(api + `Post/timeline/skip/${skip}/count/5`, config)
    //   .then(res => {
    //     if (isEnd == false) return;
    //     setPosts(posts.concat(res.data.result));
    //     setIsEnd(false);
    //     setSkip(skip + 5);
    //   })
    //   .catch(error => console.log(error));
  };
  const renderItem = ({ item }) => {
    return <PostCard post={item} onViewImage={onViewImage} onModal={onModal} />;
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
            <Image style={styles.imgAvatar} source={{ uri: userInfo.avatar }} />
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
          onEndReachedThreshold={0.1}
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
        <ImageView
          images={[{ uri: imgView }]}
          imageIndex={0}
          visible={visible}
          onRequestClose={() => setIsVisible(false)}
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
      <PostOptionModal
        visible={modalVisible}
        saved={savedModal}
        id={idModal}
        onVisible={onVisibleCallBack}
      />
      <Modal
        visible={pickFieldVisible}
         footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ fontSize: 14, color: 'red' }}
              text="Chọn ngay"
              onPress={() => {
                setPickFieldVisible(false);

                navigation.navigate(navigationConstants.pickField);
              }}
            />
          </ModalFooter>
        }
      >
        <ModalContent>
          <View>
            <Text style={{ fontSize: 16, alignSelf: 'center' }}>
              Bạn chưa chọn lĩnh vực quan tâm nào
            </Text>
          </View>
        </ModalContent>
      </Modal>
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
