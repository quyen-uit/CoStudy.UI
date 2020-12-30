import { useTheme, useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
  Text,
  FlatList,
  View,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  RefreshControl,
  Alert,
  ToastAndroid,
  BackHandler,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from './styles';
import strings from 'localization';
import { getAPI } from '../../../apis/instance';
import { api } from 'constants/route';
import { getUser } from 'selectors/UserSelectors';
import { main_color, main_2nd_color, touch_color } from 'constants/colorCommon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';
import PostCard from '../../common/PostCard';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import navigationConstants from 'constants/navigation';

function UserCard({ item }) {
  const [loading, setLoading] = useState(false);
  const curUser = useSelector(getUser);
  const [following, setFollowing] = useState(item.following);
  const navigation = useNavigation();

  const onFollow = async () => {
    setLoading(true);
    if (following) {
      await getAPI(curUser.jwtToken)
        .post(api + 'User/follower/remove?followingId=' + item.oid, {
          followingId: item.oid,
        })
        .then(res => {
          setLoading(false);
          setFollowing(false);
        })
        .catch(error => alert(error));
    } else {
      await getAPI(curUser.jwtToken)
        .post(api + 'User/following', { followers: [item.oid] })
        .then(res => {
          setLoading(false);
          setFollowing(true);
        })
        .catch(error => alert(error));
    }
  };
  return (
    <Card containerStyle={styles.cardContainer}>
      <TouchableHighlight
        onPress={() =>
          navigation.push(navigationConstants.profile, { id: item.oid })
        }
        underlayColor={touch_color}
        style={styles.card}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity onPress={() => alert('avatar is clicked')}>
              <Image
                style={styles.imgAvatar}
                source={
                  item.avatar.image_hash != null
                    ? { uri: item.avatar.image_hash }
                    : require('../../../assets/avatar.jpeg')
                }
              />
            </TouchableOpacity>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.txtAuthor}>
                {item.first_name} {item.last_name}
              </Text>
              <Text style={styles.txtContent}>{item.address.city}</Text>
            </View>
          </View>
          <View style={{ alignSelf: 'center', width: 96 }}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color={main_color}
                style={{ alignSelf: 'center' }}
              />
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: following ? '#ccc':  main_color ,
                  padding: 4,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                }}
                onPress={() => {
                  onFollow();
                }}
              >
                <Text
                  style={{
                    color: following ?  main_color :'white' ,
                    alignSelf: 'center',
                  }}
                >
                  {following ? 'Hủy theo dõi' : 'Theo dõi'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableHighlight>
    </Card>
  );
}

function Search() {
  const { colors } = useTheme();
  const curUser = useSelector(getUser);
  const navigation = useNavigation();
  const [isFirst, setIsFirst] = useState(true);

  const [isPostSearch, setIsPostSearch] = useState(true);
  // query
  const [search, setSearch] = useState('');

  const [keyword, setKeyword] = useState('');
  const [filterTime, setFilterTime] = useState();
  const [filterVote, setFilterVote] = useState();
  const [filterComment, setFilterComment] = useState();
  const [amountField, setAmoutField] = useState(0);
  // data
  const [fieldPickers, setFieldPickers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  // show modal
  const [modalVisible, setModalVisible] = useState(false);
  // 0 main , 1 field, 2 time, 3 vote
  const [modalOrder, setModalOrder] = useState(0);

  const [modalFieldVisible, setModalFieldVisible] = useState(false);
  const [modalVoteVisible, setModalVoteVisible] = useState(false);

  // loading
  const [refreshing, setRefreshing] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [skip, setSkip] = useState(0);

  const backAction = () => {
    setModalVisible(false);
    return true;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
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
        .catch(error => alert(error));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

  useEffect(() => {
    if (isFirst) {
      setIsFirst(false);
      return;
    }
    let isRender = true;
    if (isPostSearch) {
      setIsLoading(true);
      const tmp = [];
      fieldPickers.forEach(item => {
        if (item.isPick) tmp.push(item);
      });

      const fetchData1 = async () => {
        await getAPI(curUser.jwtToken)
          .get(api + 'User/current')
          .then(async response => {
            await getAPI(curUser.jwtToken)
              .post(api + `Post/post/filter`, {
                skip: 0,
                count: 3,
                keyword: keyword,
              })
              .then(async res => {
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

                setIsLoading(false);
                setSkip(3);
              })
              .catch(error => alert(error));
          })
          .catch(error => alert(error));
      };

      fetchData1();
    } else {
      setIsLoading(true);
      const tmp = [];
      fieldPickers.forEach(item => {
        if (item.isPick) tmp.push(item);
      });

      const fetchData1 = async () => {
        await getAPI(curUser.jwtToken)
          .post(api + 'User/user/filter', {
            keyword: keyword,
            skip: 0,
            count: 99,
          })
          .then(async res => {
            await getAPI(curUser.jwtToken)
              .get(
                api +
                  'User/following?UserId=' +
                  curUser.oid +
                  '&Skip=0&Count=99'
              )
              .then(following => {
                if (isRender) {
                  res.data.result.forEach(er => {
                    er.following = false;
                    following.data.result.forEach(ing => {
                      if (er.oid == ing.toId) er.following = true;
                    });
                  });
                  setIsLoading(false);
                  setUsers(res.data.result);
                }
              });
          })
          .catch(error => alert(error));
      };

      fetchData1();
    }
    return () => {
      isRender = false;
    };
  }, [keyword]);

  const fetchMore = async () => {
    if (isEnd == true) return;
    await getAPI(curUser.jwtToken)
      .get(api + 'User/current')
      .then(async response => {
        await getAPI(curUser.jwtToken)
          .post(api + `Post/post/filter`, {
            skip: skip,
            count: 3,
            keyword: keyword,
          })
          .then(async res => {
            res.data.result.forEach(item => {
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

            setPosts(posts.concat(res.data.result));
            setIsLoading(false);
            setSkip(skip + 3);
            setIsEnd(false);
          })
          .catch(error => alert(error));
      })
      .catch(error => alert(error));
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
  const renderUserCard = ({ item }) => {
    return <UserCard item={item} />;
  };
  return (
    <View>
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
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={'arrow-left'} size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TextInput
            style={styles.inputSearch}
            onChangeText={text => setSearch(text)}
            value={search}
          />
          <View
            style={{ position: 'absolute', alignSelf: 'flex-end', right: 16 }}
          >
            <TouchableOpacity onPress={() => setKeyword(search)}>
              <Icon name={'search'} size={24} color={'#000'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.filter}>
        <TouchableOpacity
          style={isPostSearch ? styles.btnSelected : styles.btnNotSelected}
          onPress={() => setIsPostSearch(true)}
        >
          <Text style={styles.txtBtnSelected}>Bài viết</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={!isPostSearch ? styles.btnSelected : styles.btnNotSelected}
          onPress={() => setIsPostSearch(false)}
        >
          <Text style={styles.txtBtnNotSelected}>Mọi người</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Icon
            name={'sliders-h'}
            size={24}
            color={main_color}
            style={{ marginHorizontal: 8 }}
          />
        </TouchableOpacity>
      </View>
      <SafeAreaView>
        {isPostSearch ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={posts}
            style={{ flexGrow: 0, marginBottom: 200 }}
            onEndReached={async () => {
              if (posts.length > 2) {
                setIsEnd(true);
                await fetchMore();
              }
            }}
            onEndReachedThreshold={0.7}
            renderItem={item => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <View>
                {!isFirst && posts.length == 0 ? (
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 16,
                      color: '#616161',
                      marginTop: 100,
                    }}
                  >
                    Không có kết quả.
                  </Text>
                ) : (
                  <View></View>
                )}
              </View>
            )}
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
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={users}
            renderItem={item => renderUserCard(item)}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <View>
                { users.length == 0 ? (
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 16,
                      color: '#616161',
                      marginTop: 100,
                    }}
                  >
                    Không có kết quả.
                  </Text>
                ) : (
                  <View></View>
                )}
              </View>
            )}
          />
        )}
      </SafeAreaView>

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
      <BottomModal
        visible={modalFieldVisible}
        swipeDirection={['up', 'down']} // can be string or an array
        swipeThreshold={100} // default 100
        useNativeDriver={true}
        modalTitle={
          <View style={{ alignSelf: 'center', alignItems: 'center' }}>
            <Icon name={'grip-lines'} color={main_color} size={16} />
            <Text>Chọn lĩnh vực cho bài biết</Text>
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
          setModalFieldVisible(false);
        }}
      >
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
                setModalFieldVisible(false);
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
      </BottomModal>
    </View>
  );
}

export default Search;
