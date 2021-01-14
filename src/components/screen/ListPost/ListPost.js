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

function ListPost() {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const user = useSelector(getUser);
  const navigation = useNavigation();
  const route = useRoute();
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

  // show modal
  const [modalVisible, setModalVisible] = useState(false);
  // 0 main , 1 field, 2 time, 3 vote
  const [modalOrder, setModalOrder] = useState(0);
  const [filterTime, setFilterTime] = useState();
  const [filterVote, setFilterVote] = useState();
  const [filterComment, setFilterComment] = useState();
  const [amountField, setAmoutField] = useState(0);
  const [fieldPickers, setFieldPickers] = useState([]);

  React.useEffect(() => {
    console.log('dispatch update user');
    dispatch(update(user.jwtToken));
  }, []);

  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await getAPI(curUser.jwtToken)
        .get(api + 'User/field/all')
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
      await getAPI(curUser.jwtToken)
        .get(api + 'User/current')
        .then(async response => {
          await getAPI(curUser.jwtToken)
            .get(api + `Post/post/save?skip=0&count=5`, { skip: 0, count: 5 })
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
      await getAPI(curUser.jwtToken)
        .get(api + 'User/current')
        .then(async resUser => {
          await getAPI(curUser.jwtToken)
            .get(api + `Post/post/save?skip=0&count=5`, { skip: 0, count: 5 })
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
    await getAPI(curUser.jwtToken)
      .get(api + 'User/current')
      .then(async resUser => {
        await getAPI(curUser.jwtToken)
          .get(api + `Post/post/save?skip=${skip}&count=5`, {
            skip: skip,
            count: 5,
          })
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
      )}
      <BottomModal
        visible={modalVisible}
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
              <Text style={styles.md_txtHeader}>Lọc bài viết</Text>
            ) : (
              <TouchableOpacity
                style={{ marginLeft: 4, alignSelf: 'center' }}
                onPress={() => setModalOrder(0)}
              >
                <Icon name={'arrow-left'} size={16} color={'#fff'} />
              </TouchableOpacity>
            )}
            {modalOrder == 0 ? (
              <TouchableOpacity onPress={() => reset()}>
                <Text style={styles.md_txtHeader}>Đặt lại</Text>
              </TouchableOpacity>
            ) : modalOrder == 1 ? (
              <Text style={styles.md_txtHeader}>Lĩnh vực</Text>
            ) : modalOrder == 2 ? (
              <Text style={styles.md_txtHeader}>Thời gian</Text>
            ) : modalOrder == 3 ? (
              <Text style={styles.md_txtHeader}>Lượt upvote</Text>
            ) : (
              <Text style={styles.md_txtHeader}>Lượt comment</Text>
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
        onHardwareBackPress={() => {
          setModalVisible(false);
          setAmoutField(
            fieldPickers.filter(item => item.isPick == true).length
          );
          return true;
        }}
        onTouchOutside={() => {
          setModalVisible(false);
          setAmoutField(
            fieldPickers.filter(item => item.isPick == true).length
          );
        }}
        onSwipeOut={event => {
          setModalVisible(false);
          setAmoutField(
            fieldPickers.filter(item => item.isPick == true).length
          );
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
                      <Text style={styles.md_txtfield}>Lĩnh vực</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.md_txtchoose}>
                        {fieldPickers.filter(i => i.isPick == true).length}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.fieldPicked}>
                    {fieldPickers.map((item, index) =>
                      item.isPick ? (
                        <TouchableOpacity
                          key={index}
                          onPress={() => {
                            item.isPick = false;

                            setFieldPickers(fieldPickers.filter(item => item));
                          }}
                        >
                          <View style={styles.btnTag}>
                            <Text style={styles.txtTag}>{item.value}</Text>
                          </View>
                        </TouchableOpacity>
                      ) : null
                    )}
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => setModalOrder(2)}>
                  <View style={styles.md_field}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'question-circle'}
                        size={20}
                        color={main_color}
                      />
                      <Text style={styles.md_txtfield}>Thời gian</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.md_txtchoose}>
                        {filterTime == 1
                          ? 'Mới nhât'
                          : filterTime == 0
                          ? 'Cũ nhất'
                          : 'Chưa chọn'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => setModalOrder(3)}>
                  <View style={styles.md_field}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'question-circle'}
                        size={20}
                        color={main_color}
                      />
                      <Text style={styles.md_txtfield}>Số lượt vote</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.md_txtchoose}>
                        {filterVote == 1
                          ? 'Giảm dần'
                          : filterVote == 0
                          ? 'Tăng dần'
                          : 'Chưa chọn'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => setModalOrder(3)}>
                  <View style={styles.md_field}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'question-circle'}
                        size={20}
                        color={main_color}
                      />
                      <Text style={styles.md_txtfield}>Số lượt trả lời</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={styles.md_txtchoose}>
                        {filterVote == 1
                          ? 'Giảm dần'
                          : filterVote == 0
                          ? 'Tăng dần'
                          : 'Chưa chọn'}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
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
                    style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
                  >
                    Hiển thị kết quả
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ModalContent>
        ) : modalOrder == 1 ? (
          <ModalContent style={{ marginHorizontal: -16 }}>
            <View>
              <View
                style={{ flexWrap: 'wrap', flexDirection: 'row', padding: 8 }}
              >
                {fieldPickers.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      item.isPick = item.isPick ? false : true;

                      setFieldPickers(fieldPickers.filter(item => item));
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: item.isPick ? main_2nd_color : '#ccc',
                        padding: 8,
                        borderRadius: 100,
                        margin: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: item.isPick ? '#fff' : main_2nd_color,
                          fontSize: 16,
                        }}
                      >
                        {item.value}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalOrder(0);
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
                  }}
                >
                  <Text
                    style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
                  >
                    Xác nhận
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ModalContent>
        ) : modalOrder == 2 ? (
          <ModalContent>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFilterTime(1);
                    setModalOrder(0);
                  }}
                >
                  <View style={styles.md_field}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'question-circle'}
                        size={20}
                        color={main_color}
                      />
                      <Text style={styles.md_txtfield}>Bài đăng mới nhất</Text>
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
                    setModalOrder(0);
                  }}
                >
                  <View style={styles.md_field}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'question-circle'}
                        size={20}
                        color={main_color}
                      />
                      <Text style={styles.md_txtfield}>Bài đăng cũ nhất</Text>
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
                    style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
                  >
                    Xác nhận
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ModalContent>
        ) : modalOrder == 3 ? (
          <ModalContent>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFilterVote(1);
                    setModalOrder(0);
                  }}
                >
                  <View style={styles.md_field}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'question-circle'}
                        size={20}
                        color={main_color}
                      />
                      <Text style={styles.md_txtfield}>Số upvote giảm dần</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'dot-circle'}
                        size={24}
                        color={filterVote == 1 ? main_color : '#ccc'}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFilterVote(0);
                    setModalOrder(0);
                  }}
                >
                  <View style={styles.md_field}>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'question-circle'}
                        size={20}
                        color={main_color}
                      />
                      <Text style={styles.md_txtfield}>Số upvote tăng dần</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'dot-circle'}
                        size={24}
                        color={filterVote == 0 ? main_color : '#ccc'}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setModalOrder(0);
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
                    style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
                  >
                    Xác nhận
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ModalContent>
        ) : modalOrder == 4 ? (
          <ModalContent>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFilterComment(1);
                    setModalOrder(0);
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
                        Số comment giảm dần
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'dot-circle'}
                        size={24}
                        color={filterComment == 1 ? main_color : '#ccc'}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFilterComment(0);
                    setModalOrder(0);
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
                        Số comment tăng dần
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'dot-circle'}
                        size={24}
                        color={filterComment == 0 ? main_color : '#ccc'}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  setModalOrder(0);
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
                    style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
                  >
                    Xác nhận
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
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
