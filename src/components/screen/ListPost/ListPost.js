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
  useWindowDimensions,
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
import DateRangePicker from '../../common/DateRangePicker';
import moment from 'moment';
 

function ListPost() {
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height;
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
  const [stop, setStop] = useState(false);
  const [changeFilter, setChangeFilter] = useState(true);
  const [filterTime, setFilterTime] = useState(1);

  // 0 main , 1 datetime
  const [modalOrder, setModalOrder] = useState(0);
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [allowUp, setAllowUp] = useState(false);
  const [offset, setOffset] = useState(0);
  const [rangeDate, setRangeDate] = useState({
    startDate: moment(moment.now()).subtract(1, 'months'),
    endDate: moment(moment.now()),
  });
  const onUnsaveCallback = React.useCallback(id => {
    setPosts(posts.filter(i => i.oid != id));
  });
  const onDeleteCallback = React.useCallback(value => {
    // setVisibleDelete(true);
    PostService.deletePost(jwtToken, idModal)
      .then(res => {
        ToastAndroid.show('Xóa bài đăng thành công', 1000);

        setPosts(posts.filter(i => i.oid != idModal));
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.show('bài đăng chưa được xóa', 1000);
      });
    setModalVisible(false);
    //setTmp(value);
    //setIdModal(value);
  });
  const onNotExist = React.useCallback(id => {
    setPosts(posts.filter(i => i.oid != id));
  });
  React.useEffect(() => {
    console.log('dispatch update user');
    dispatch(update(jwtToken));
  }, []);

  // useEffect(() => {
  //   let isRender = true;
  //   const fetchData = async () => {
  //     await UserService.getAllField(jwtToken)
  //       .then(response => {
  //         if (isRender) {
  //           response.data.result.forEach(element => {
  //             element.isPick = false;
  //           });
  //           setFieldPickers(response.data.result);
  //           setIsLoading(false);
  //         }
  //       })
  //       .catch(error => console.log(error));
  //   };
  //   fetchData();
  //   return () => {
  //     isRender = false;
  //   };
  // }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsEnd(false);
    setStop(false);
    setFilterTime(1);
    const fetchData1 = async () => {
      // await UserService.getCurrentUser(jwtToken)
      //   .then(async response => {
      await PostService.getSavedPost(jwtToken, {
        skip: 0,
        count: 5,
        from: moment(rangeDate.startDate).format('YYYY-MM-DD'),
        to: moment(rangeDate.endDate).format('YYYY-MM-DD'),
        type: filterTime,
      })
        .then(res => {
          res.data.result.forEach(item => {
            // response.data.result.post_saved.forEach(i => {
            //   if (i == item.oid) {
            //     item.saved = true;
            //   } else item.saved = false;
            // });
            item.saved = item.is_save_by_current;
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
      // })
      // .catch(error => console.log(error));
    };

    fetchData1();
  }, []);
  useEffect(() => {
    let isRender = true;
    const fetchData1 = async () => {
      // await UserService.getCurrentUser(jwtToken)
      //   .then(async resUser => {
      await PostService.getSavedPost(jwtToken, {
        skip: 0,
        count: 5,
        from: moment(rangeDate.startDate).format('YYYY-MM-DD'),
        to: moment(rangeDate.endDate).format('YYYY-MM-DD'),
        type: filterTime,
      })
        .then(async resPost => {
          resPost.data.result.forEach(item => {
            // resUser.data.result.post_saved.forEach(i => {
            //   if (i == item.oid) {
            //     item.saved = true;
            //   } else item.saved = false;
            // });
            item.saved = item.is_save_by_current;

            // set vote
            item.vote = 0;
            if (item.is_downvote_by_current) item.vote = -1;
            else if (item.is_vote_by_current) item.vote = 1;
          });
          if (isRender) {
            setPosts(resPost.data.result);
            setIsLoading(false);

            setSkip(5);
          }
        })
        .catch(error => console.log(error));
      // })
      // .catch(error => console.log(error));
    };

    fetchData1();
    return () => {
      isRender = false;
    };
  }, [changeFilter]);

  // }, [route.params?.title]);
  const fetchData = async () => {
    if (stop) {
      setIsEnd(false);
      return;
    }
    // await UserService.getCurrentUser(jwtToken)
    //   .then(async resUser => {
    await PostService.getSavedPost(jwtToken, {
      skip: skip,
      count: 5,
      from: moment(rangeDate.startDate).format('YYYY-MM-DD'),
      to: moment(rangeDate.endDate).format('YYYY-MM-DD'),
      type: filterTime,
    })
      .then(res => {
        if (res.data.result.length < 1) {
          setStop(true);
          setIsEnd(false);
          return;
        }
        res.data.result.forEach(item => {
          // resUser.data.result.post_saved.forEach(i => {
          //   if (i == item.oid) {
          //     item.saved = true;
          //   } else item.saved = false;
          // });
          item.saved = item.is_save_by_current;

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
    // })
    // .catch(error => console.log(error));
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
    return (
      <PostCard
        onViewImage={onViewImage}
        post={item}
        onModal={onModal}
        onNotExist={onNotExist}
      />
    );
  };
  const flatList = React.useRef(null);
  const goToTop = () => {
    setAllowUp(false);
    setOffset(10000);
    flatList.current.scrollToOffset({ animated: true, offset: 0 });
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
            Danh sách quan tâm
          </Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => setModalFilterVisible(true)}>
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
            ref={flatList}
            onScroll={e => {
              if (
                e.nativeEvent.contentOffset.y > 500 &&
                e.nativeEvent.contentOffset.y > offset
              ) {
                setAllowUp(true);
              } else setAllowUp(false);
              setOffset(e.nativeEvent.contentOffset.y);
            }}
            extraData={posts}
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
              stop ? (
                <Text
                  style={{
                    alignSelf: 'center',
                    marginVertical: 4,
                    color: '#4f4f4f',
                  }}
                >
                  {' '}
                  Không còn bài đăng.{' '}
                </Text>
              ) : isEnd ? (
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
      {allowUp ? (
        <TouchableOpacity
          onPress={() => goToTop()}
          style={{ position: 'absolute', bottom: 80, right: 32 }}
        >
          <Icon name={'chevron-circle-up'} size={32} color={main_color} />
        </TouchableOpacity>
      ) : null}
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
        onDelete={onDeleteCallback}
        onNotExist={onNotExist}
        onUnsave={onUnsaveCallback}
      />
      <BottomModal
        visible={modalFilterVisible}
        swipeDirection={['up', 'down']} // can be string or an array
        swipeThreshold={100} // default 100
        useNativeDriver={true}
        modalTitle={
          <View
            style={{
              justifyContent: 'space-between',
              backgroundColor: main_color,
              flexDirection: 'row',
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            {modalOrder == 0 ? (
              <Text style={styles.md_txtHeader}>Lọc bài bài đăng</Text>
            ) : (
              <TouchableOpacity
                style={{ marginLeft: 4, alignSelf: 'center' }}
                onPress={() => setModalOrder(0)}
              >
                <Icon name={'arrow-left'} size={16} color={'#fff'} />
              </TouchableOpacity>
            )}
            {modalOrder == 0 ? null : (
              <Text style={styles.md_txtHeader}>Khoảng thời gian</Text>
            )}
          </View>
        }
        modalAnimation={
          new SlideAnimation({
            initialValue: 0, // optional
            slideFrom: 'bottom', // optional
            useNativeDriver: true, // optional
          })
        }
        onSwipeOut={event => {
          setModalFilterVisible(false);
        }}
        onHardwareBackPress={() => {
          setModalFilterVisible(false);

          return true;
        }}
        onTouchOutside={() => {
          setModalFilterVisible(false);
        }}
      >
        {modalOrder == 0 ? (
          <ModalContent style={{ marginHorizontal: -16 }}>
            <View>
              <View>
                <TouchableOpacity onPress={() => setModalOrder(1)}>
                  <View style={styles.md_field}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'question-circle'}
                        size={20}
                        color={main_color}
                      />
                      <Text style={styles.md_txtchoose}>
                        {' '}
                        Từ {moment(rangeDate.startDate).format(
                          'DD-MM-YYYY'
                        )}{' '}
                        đến {moment(rangeDate.endDate).format('DD-MM-YYYY')}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}></View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setFilterTime(1);
                    }}
                  >
                    <View style={styles.md_field}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name={'question-circle'}
                          size={20}
                          color={main_color}
                        />
                        <Text style={styles.md_txtfield}>
                          Thời gian giảm dần
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name={'dot-circle'}
                          size={24}
                          color={filterTime == 1 ? main_color : '#ccc'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setFilterTime(0);
                    }}
                  >
                    <View style={styles.md_field}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name={'question-circle'}
                          size={20}
                          color={main_color}
                        />
                        <Text style={styles.md_txtfield}>
                          Thời gian tăng dần
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name={'dot-circle'}
                          size={24}
                          color={filterTime == 0 ? main_color : '#ccc'}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setModalOrder(0);
                    setModalFilterVisible(false);
                    setChangeFilter(!changeFilter);
                  }}
                >
                  <View
                    style={{
                      justifyContent: 'center',
                      backgroundColor: main_color,
                      marginHorizontal: 16,
                      marginBottom: -8,
                      alignItems: 'center',
                      paddingVertical: 8,
                      borderRadius: 8,
                      marginTop: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#fff',
                        fontWeight: 'bold',
                      }}
                    >
                      Xác nhận
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </ModalContent>
        ) : modalOrder == 1 ? (
          <ModalContent>
            <DateRangePicker
              initialRange={['2018-04-01', '2018-04-10']}
              onSuccess={(s, e) => {
                setModalOrder(0);
                setRangeDate({ startDate: s, endDate: e });
              }}
              theme={{ markColor: 'red', markTextColor: 'white' }}
            />
          </ModalContent>
        ) : null}
      </BottomModal>
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
