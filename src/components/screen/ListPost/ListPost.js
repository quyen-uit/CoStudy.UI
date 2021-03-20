import { useTheme, DrawerActions } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
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
import styles from 'components/screen/ListPost/styles';
import { getBasicInfo, getJwtToken } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import PostCard from '../../common/PostCard';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImageView from 'react-native-image-viewing';
import { actionTypes, update } from 'actions/UserActions';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';
import PostOptionModal from 'components/modal/PostOptionModal/PostOptionModal';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function ListPost() {
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);

  const dispatch = useDispatch();
  
 ///image view
 const [imgView, setImgView] = useState();
 const [visible, setIsVisible] = useState(false);
 const onViewImage = React.useCallback((value, uri) => {
   setIsVisible(true);
   setImgView(uri);
 });
 
 const navigation = useNavigation();
  const route = useRoute();
  const GoToPost = () => {
    navigation.navigate(navigationConstants.post);
  };
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [skip, setSkip] = useState(0);

  // 0 main , 1 field, 2 time, 3 vote
  const [modalOrder, setModalOrder] = useState(0);
  const [filterTime, setFilterTime] = useState();
  const [filterVote, setFilterVote] = useState();
  const [filterComment, setFilterComment] = useState();
  const [amountField, setAmountField] = useState(0);
  const [fieldPickers, setFieldPickers] = useState([]);

  React.useEffect(() => {
    console.log('dispatch update user');
    dispatch(update(jwtToken));
  }, []);

  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await UserService.getAllField(jwtToken)
        .then(response => {
          if (isRender) {
            response.data.result.forEach(element => {
              element.isPick = false;
            });
            setFieldPickers(response.data.result);
            setIsLoading(false);
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsEnd(false);
    const fetchData1 = async () => {
      await UserService.getCurrentUser(jwtToken)
        .then(async response => {
          await PostService.getSavedPost(jwtToken, {skip: 0, count: 5})
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
              setIsLoading(false);
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
          await PostService.getSavedPost(jwtToken, {skip: 0, count: 5})
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
                // if (route.params?.title) {
                //   let list = [];

                //   let promises = route.params.listImg.map(async image => {
                //     const uri = image.path;
                //     const filename = uuidv4();
                //     const uploadUri =
                //       Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
                //     const task = storage()
                //       .ref('post/' + userInfo.id + '/' + filename)
                //       .putFile(uploadUri);
                //     // set progress state
                //     task.on('state_changed', snapshot => {});
                //     try {
                //       await task.then(async response => {
                //         await storage()
                //           .ref(response.metadata.fullPath)
                //           .getDownloadURL()
                //           .then(url => {
                //             list = [
                //               ...list,
                //               {
                //                 discription: image.discription,
                //                 image_hash: url,
                //               },
                //             ];
                //           });
                //       });
                //     } catch (e) {
                //       console.error(e);
                //     }
                //   });
                //   Promise.all(promises).then(async () => {
                //     await getAPI(jwtToken)
                //       .post(api + 'Post/add', {
                //         title: route.params.title,
                //         string_contents: [
                //           { content_type: 0, content: route.params.content },
                //         ],
                //         image_contents: list,
                //         fields: route.params.fields,
                //       })
                //       .then(response1 => {
                //         Toast.show({
                //           type: 'success',
                //           position: 'top',
                //           text1: 'Đăng bài thành công.',
                //           visibilityTime: 2000,
                //         });
                //         let tmp = response1.data.result.post;
                //         tmp.vote = 0;
                //         response.data.result.post_upvote.forEach(i => {
                //           if (i == tmp.oid) {
                //             item.vote = 1;
                //           }
                //         });
                //         response.data.result.post_downvote.forEach(i => {
                //           if (i == tmp.oid) {
                //             item.vote = -1;
                //           }
                //         });
                //         if (isRender) setPosts([tmp, ...res.data.result]);
                //       })
                //       .catch(error => console.log(error));
                //   });
                // }
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
  }, []);

  
// }, [route.params?.title]);
  const fetchData = async () => {
    await UserService.getCurrentUser(jwtToken)
      .then(async resUser => {
        await PostService(jwtToken, {skip: skip, count: 5})
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
            });
            if (isEnd == false) return;
            if (res.data.result.length > 0) {
              setPosts(posts.concat(res.data.result));

              setSkip(skip + 5);
              setIsEnd(false);
            }
            // setIsEnd(false);
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
  const reset = () => {
    setFilterComment();
    setAmoutField(0);
    setFilterTime();
    setFilterVote();

    //??
    fieldPickers.forEach(element => {
      element.isPick = false;
    });
    setFieldPickers(fieldPickers.filter(item => item));
  };

 //modal
 const [modalVisible, setModalVisible] = useState(false);
 const [idModal, setIdModal] = useState();
 const [savedModal, setSavedModal] = useState();
 const onModal = React.useCallback((value, id, saved) => {
   setModalVisible(value);
   setIdModal(id);
   setSavedModal(saved);
 });
 const onVisibleCallBack = React.useCallback(value => {
   setModalVisible(value);
 });
  const renderItem = ({ item }) => {
    return <PostCard onViewImage={onViewImage} post={item}  onModal={onModal}/>;
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
              source={{ uri: userInfo.avatar }}
            />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ffffff' }}>
            Danh sách quan tâm
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Icon name={'sliders-h'} size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
      </View>
      {posts.length == 0 ? (
        <TouchableOpacity
          onPress={() => {
            onRefresh();
            setIsLoading(true);
          }}
        >
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 16,
              color: '#616161',
              marginTop: 200,
            }}
          >
            Bạn chưa quan tâm bài đăng nào. Nhấn để làm mới.
          </Text>
        </TouchableOpacity>
      ) : (
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
      )}
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
        saved={savedModal}
        id={idModal}
        onVisible={onVisibleCallBack}
      />
      </View>
  );
}

export default ListPost;

// <FlatList
//         showsVerticalScrollIndicator={false}
//         data={list}
//         renderItem={renderItem}
//         keyExtractor={item => item.id}
//       />
