import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import DateRangePicker from '../../common/DateRangePicker';
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
  Keyboard,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from './styles';

import { getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import { main_color, main_2nd_color, touch_color } from 'constants/colorCommon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { TextInput } from 'react-native-gesture-handler';
import PostCard from '../../common/PostCard';
import { Badge } from 'react-native-elements';
import ImageView from 'react-native-image-viewing';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import navigationConstants from 'constants/navigation';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';
import FollowService from 'controllers/FollowService';
import PostOptionModal from 'components/modal/PostOptionModal/PostOptionModal';
import { Menu } from 'react-native-paper';

function UserCard({ item }) {
  const [loading, setLoading] = useState(false);
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);

  const [following, setFollowing] = useState(item.following);
  const onCallback = React.useCallback(value => {
    setFollowing(value);
  });
  const navigation = useNavigation();

  const onFollow = async () => {
    setLoading(true);
    if (following) {
      await FollowService.unfollower(jwtToken, item.oid)
        .then(res => {
          setLoading(false);
          setFollowing(false);
        })
        .catch(error => console.log(error));
    } else {
      await FollowService.follow(jwtToken, item.oid)
        .then(res => {
          setLoading(false);
          setFollowing(true);
        })
        .catch(error => console.log(error));
    }
  };
  return (
    <Card containerStyle={styles.cardContainer}>
      <TouchableHighlight
        onPress={() =>
          navigation.push(navigationConstants.profile, {
            id: item.oid,
            callback: onCallback,
          })
        }
        underlayColor={touch_color}
        style={styles.card}
      >
        <View style={styles.headerCard}>
          <View style={styles.headerAvatar}>
            <TouchableOpacity
              onPress={() =>
                navigation.push(navigationConstants.profile, {
                  id: item.oid,
                  callback: onCallback,
                })
              }
            >
              <Image
                style={styles.imgAvatar}
                source={
                  item.avatar.image_hash != null
                    ? { uri: item.avatar.image_hash }
                    : require('../../../assets/avatar.jpeg')
                }
              />
            </TouchableOpacity>
            <View style={{ flexShrink: 1, justifyContent: 'center' }}>
              <Text style={styles.txtAuthor}>
                {item.first_name} {item.last_name}
              </Text>
              {item.address.city ? (
                <Text style={styles.txtContent}>{item.address.city}</Text>
              ) : null}
            </View>
          </View>
          {item.oid == userInfo.id ? null : (
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
                    backgroundColor: following ? '#ccc' : main_color,
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
                      color: following ? main_color : 'white',
                      alignSelf: 'center',
                    }}
                  >
                    {following ? 'Hủy theo dõi' : 'Theo dõi'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </TouchableHighlight>
    </Card>
  );
}

function Search() {
  const { colors } = useTheme();
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);
  const route = useRoute();
  const navigation = useNavigation();
  const [isFirst, setIsFirst] = useState(true);
  const [stop, setStop] = useState(false);

  const [isPostSearch, setIsPostSearch] = useState(true);
  // query
  const [search, setSearch] = useState('');
  const [countFilter, setCountFilter] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [filterTime, setFilterTime] = useState(-1);
  const [filterVote, setFilterVote] = useState(-1);
  const [filterComment, setFilterComment] = useState(-1);
  const [filterType, setFilterType] = useState(2);
  const [listHistory, setListHistory] = useState([]);

  const [amountField, setAmoutField] = useState(0);
  const [countResult, setCountResult] = useState(0);
  // data
  const [fieldPickers, setFieldPickers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  // date
  const [rangeDate, setRangeDate] = useState({
    startDate: moment(moment.now()).subtract(1, 'months'),
    endDate: moment(moment.now()),
  });
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

  //modal
  const [modalPostVisible, setModalPostVisible] = useState(false);
  const [idModal, setIdModal] = useState(null);
  const [savedModal, setSavedModal] = useState();
  ///image view
  const [imgView, setImgView] = useState();
  const [visible, setIsVisible] = useState(false);
  const [visibleMenu, setVisibleMenu] = useState(false);

  const onViewImage = React.useCallback((value, uri) => {
    setIsVisible(true);
    setImgView(uri);
  });
  const onDelete = () => {
    PostService.deletePost(jwtToken, idModal)
      .then(res => {
        ToastAndroid.show('Xóa bài đăng thành công', 1000);

        setPosts(posts.filter(i => i.oid != idModal));
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.show('bài đăng chưa được xóa', 1000);
      });
  };
  const onNotExist = React.useCallback(id => {
    setPosts(posts.filter(i => i.oid != id));
  });
  const onDeleteCallback = React.useCallback(value => {
    // setVisibleDelete(true);
    onDelete();
    setModalVisible(false);
    //setTmp(value);
    //setIdModal(value);
  });
  const onModal = React.useCallback((value, id, saved) => {
    setModalPostVisible(value);
    setIdModal(id);
    setSavedModal(saved);
  });
  const onVisibleCallBack = React.useCallback(value => {
    setModalPostVisible(value);
  });
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
    reset();
    const fetch = async () => {
      if (isPostSearch)
        await PostService.getSearchHistory(jwtToken)
          .then(res => {
            res.data.result = res.data.result.filter(
              i => i.post_value.content_filter != ''
            );
            setListHistory(
              res.data.result.map(i => {
                return {
                  key: i.oid,
                  value: i.post_value.content_filter,
                };
              })
            );
          })
          .catch(err => console.log(err));
      else
        await UserService.getSearchHistory(jwtToken)
          .then(res => {
            res.data.result = res.data.result.filter(
              i => i.user_value.keyword != ''
            );
            setListHistory(
              res.data.result.map(i => {
                return {
                  key: i.oid,
                  value: i.user_value.keyword,
                };
              })
            );
          })
          .catch(err => console.log(err));
    };
    fetch();
    return () => {};
  }, [isPostSearch]);
  useEffect(() => {
    return () => {};
  }, []);
  useEffect(() => {
    if (typeof route.params?.fieldId != 'undefined') {
      setIsLoading(true);
    } else setVisibleMenu(true);

    return () => {};
  }, [route.params?.fieldId]);
  useEffect(() => {
    let isRender = true;
    if (route.params?.fieldId) setIsLoading(true);
    const fetchData = async () => {
      await UserService.getAllField(jwtToken)
        .then(async response => {
          if (isRender) {
            response.data.result.forEach(element => {
              element.isPick = false;
              if (route.params?.fieldId) {
                if (element.oid == route.params.fieldId) element.isPick = true;
              }
            });

            if (
              fieldPickers.length > 0 ||
              typeof route.params?.fieldId == 'undefined'
            ) {
              setIsLoading(false);
              setFieldPickers(response.data.result);
              return;
            }

            setFieldPickers(response.data.result);
            //onsearchresponse.data.result
            setStop(false);
            let temp = [];
            response.data.result.forEach(x => {
              if (x.isPick) temp.push({ field_id: x.oid });
            });

            let sortObject = getSortObject();
            let sortType = getSortType();
            setIsLoading(true);
            // const tmp = [];
            // fieldPickers.forEach(item => {
            //   if (item.isPick) tmp.push(item);
            // });
            //let fields = getFieldPick();
            //console.log(rangeDate);
            // await UserService.getCurrentUser(jwtToken)
            //   .then(async response => {

            await PostService.filterPost(jwtToken, {
              skip: 0,
              count: 5,
              search: search,
              // startDate: moment(rangeDate.startDate).format('YYYY-MM-DD'),
              // endDate: moment(rangeDate.endDate).format('YYYY-MM-DD'),
              startDate: rangeDate.startDate,
              endDate: rangeDate.endDate,
              sortObject: sortObject,
              sortType: sortType,
              fields: temp,
              post_type: 2,
            })
              .then(async res => {
                if (res.data.result.data.length == 0) {
                  setIsLoading(false);
                  return;
                }

                res.data.result.data.forEach(item => {
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
                setCountResult(
                  res.data.result.record_remain + res.data.result.data.length
                );
                setPosts(res.data.result.data);
                setIsLoading(false);
                setSkip(5);
              })
              .catch(error => console.log(error));
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, [route.params?.fieldId]);
  useEffect(() => {
    let count = 0;
    if (filterComment != -1) count += 1;
    else if (filterVote != -1) count += 1;
    else if (filterTime != -1) count += 1;
    fieldPickers.forEach(i => {
      if (i.isPick) count += 1;
    });
    if (filterType != 2) count += 1;
    setCountFilter(count);
    return () => {};
  }, [
    filterComment,
    filterTime,
    filterVote,
    fieldPickers,
    countFilter,
    filterType,
  ]);

  const getSortObject = () => {
    if (filterComment != -1) return 2;
    else if (filterVote != -1) return 1;
    else if (filterTime != -1) return 0;
  };

  const getSortType = () => {
    if (filterComment != -1) return filterComment;
    else if (filterVote != -1) return filterVote;
    else if (filterTime != -1) return filterTime;
  };
  const getFieldPick = () => {
    let temp = [];
    fieldPickers.forEach(x => {
      if (x.isPick) temp.push({ field_id: x.oid });
    });
    return temp;
  };
  const getStringFieldPick = () => {
    let temp = [];
    fieldPickers.forEach(x => {
      if (x.isPick) temp.push(x.oid);
    });
    return temp;
  };
  const onSearch = async () => {
    setStop(false);
    let sortObject = getSortObject();
    let sortType = getSortType();
    if (isPostSearch) {
      setIsLoading(true);
      // const tmp = [];
      // fieldPickers.forEach(item => {
      //   if (item.isPick) tmp.push(item);
      // });
      let fields = getFieldPick();
      //console.log(rangeDate);
      // await UserService.getCurrentUser(jwtToken)
      //   .then(async response => {
      await PostService.filterPost(jwtToken, {
        skip: 0,
        count: 5,
        search: search,
        // startDate: moment(rangeDate.startDate).format('YYYY-MM-DD'),
        // endDate: moment(rangeDate.endDate).format('YYYY-MM-DD'),
        startDate: rangeDate.startDate,
        endDate: rangeDate.endDate,
        sortObject: sortObject,
        sortType: sortType,
        fields: fields,
        post_type: filterType,
      })
        .then(async res => {
          if (res.data.result.data.length == 0) {
            setIsLoading(false);
            return;
          }

          res.data.result.data.forEach(item => {
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
          setCountResult(
            res.data.result.record_remain + res.data.result.data.length
          );
          setPosts(res.data.result.data);
          setIsLoading(false);
          setSkip(5);
        })
        .catch(error => console.log(error));
      // })
      // .catch(error => console.log(error));
    } else {
      setIsLoading(true);
      let fields = getStringFieldPick();

      // const tmp = [];
      // fieldPickers.forEach(item => {
      //   if (item.isPick) tmp.push(item);
      // });
      await UserService.filterUser(jwtToken, {
        skip: 0,
        count: 10,
        search: search,

        sortObject: sortObject,
        sortType: sortType,
        fields: fields,
      })
        .then(async res => {
          await FollowService.getFollowingByUserId(jwtToken, {
            skip: 0,
            count: 99,
            id: userInfo.id,
          }).then(following => {
            res.data.result.forEach(er => {
              er.following = false;
              following.data.result.forEach(ing => {
                if (er.oid == ing.to_id) er.following = true;
              });
            });
            setIsLoading(false);

            setUsers(res.data.result.filter(i => i.oid != userInfo.id));
            setSkip(10);
          });
        })
        .catch(error => console.log(error));
    }
  };
  const fetchMore = async () => {
    if (isEnd == true) return;
    let sortObject = getSortObject();
    let sortType = getSortType();
    if (isPostSearch) {
      let fields = getFieldPick();
      // await UserService.getCurrentUser(jwtToken)
      //   .then(async response => {
      await PostService.filterPost(jwtToken, {
        skip: skip,
        count: 5,
        search: search,
        // startDate: moment(rangeDate.startDate).format('YYYY-MM-DD'),
        // endDate: moment(rangeDate.endDate).format('YYYY-MM-DD'),
        startDate: rangeDate.startDate,
        endDate: rangeDate.endDate,
        sortObject: sortObject,
        sortType: sortType,
        fields: fields,
        post_type: filterType,
      })
        .then(async res => {
          if (res.data.result.data.length < 1) {
            setStop(true);
            setIsEnd(false);
            return;
          }
          res.data.result.data.forEach(item => {
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
          //setCountResult(res.data.result.record_remain);
          setPosts(posts.concat(res.data.result.data));
          setIsLoading(false);
          setSkip(skip + 5);
          setIsEnd(false);
        })
        .catch(error => console.log(error));
      // })
      // .catch(error => console.log(error));
    } else {
      setIsLoading(true);
      let fields = getStringFieldPick();

      const tmp = [];
      fieldPickers.forEach(item => {
        if (item.isPick) tmp.push(item);
      });
      await UserService.filterUser(jwtToken, {
        skip: skip,
        count: 10,
        search: search,

        sortObject: sortObject,
        sortType: sortType,
        fields: fields,
      })
        .then(async res => {
          await FollowService.getFollowingByUserId(jwtToken, {
            skip: 0,
            count: 99,
            id: userInfo.id,
          }).then(following => {
            res.data.result.forEach(er => {
              er.following = false;
              following.data.result.forEach(ing => {
                if (er.oid == ing.to_id) er.following = true;
              });
            });
            setIsLoading(false);
            setUsers(res.data.result.filter(i => i.oid != userInfo.id));
            setSkip(skip + 10);
          });
        })
        .catch(error => console.log(error));
    }
  };
  const reset = () => {
    setFilterComment(-1);
    setAmoutField(0);
    setFilterTime(-1);
    setFilterVote(-1);
    setCountFilter(0);
    setFilterType(2);
    //??
    fieldPickers.forEach(element => {
      element.isPick = false;
    });
    setFieldPickers(fieldPickers.filter(item => item));
  };

  const renderItem = ({ item }) => {
    return (
      <PostCard
        onNotExist={onNotExist}
        onViewImage={onViewImage}
        post={item}
        onModal={onModal}
      />
    );
  };
  const renderUserCard = ({ item }) => {
    return <UserCard item={item} />;
  };
  return (
    <View>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name={'arrow-left'} size={24} color={'#fff'} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Menu
            visible={visibleMenu}
            style={{
              marginTop: 40,
              marginLeft: 16,
              width: deviceWidth - 80,
              alignItems: 'stretch',
            }}
            onDismiss={() => setVisibleMenu(false)}
            anchor={
              <View style={{ justifyContent: 'center' }}>
                <TextInput
                  style={styles.inputSearch}
                  pointerEvents="none"
                  onTouchStart={() => setVisibleMenu(true)}
                  onChangeText={text => {
                    if (text == '') setVisibleMenu(true);
                    else setVisibleMenu(false);
                    setSearch(text);
                  }}
                  value={search}
                />
                <View
                  style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    right: 16,
                  }}
                >
                  <TouchableOpacity
                    onPress={async () => {
                      Keyboard.dismiss();
                      setKeyword(search);
                      setVisibleMenu(false);
                      await onSearch();
                    }}
                  >
                    <Icon name={'search'} size={24} color={'#000'} />
                  </TouchableOpacity>
                </View>
              </View>
            }
          >
            {listHistory.map(item => (
              <Menu.Item
                key={item.key}
                style={{
                  alignSelf: 'center',
                  width: '100%',
                  marginVertical: -8,
                }}
                title={item.value}
                onPress={() => {
                  setSearch(item.value);
                  setVisibleMenu(false);
                }}
              />
            ))}
          </Menu>
        </View>
      </View>
      <View style={styles.filter}>
        <TouchableOpacity
          style={isPostSearch ? styles.btnSelected : styles.btnNotSelected}
          onPress={() => setIsPostSearch(true)}
        >
          <Text style={styles.txtBtnSelected}>Bài đăng</Text>
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
          {countFilter > 0 ? (
            <Badge
              status="success"
              value={countFilter}
              containerStyle={styles.badge}
            />
          ) : null}
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
                {posts.length == 0 ? (
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
                ) : isPostSearch ? (
                  // <View style={{marginLeft: 8, marginBottom: -8}}>
                  <Text
                    style={{
                      alignSelf: 'center',
                      marginBottom: -8,
                      color: '#545454',
                    }}
                  >
                    Có {countResult} bài đăng được tìm thấy
                  </Text>
                ) : // </View>
                null}
              </View>
            )}
            ListFooterComponent={() =>
              stop ? (
                <Text
                  style={{
                    alignSelf: 'center',
                    marginTop: 4,
                    color: '#4f4f4f',
                    marginBottom: 8,
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
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={users}
            style={{ flexGrow: 0, marginBottom: 200 }}
            renderItem={item => renderUserCard(item)}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <View>
                {users.length == 0 ? (
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
              <Text style={styles.md_txtHeader}>Lọc bài bài đăng</Text>
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
            ) : modalOrder == 6 ? (
              <Text style={styles.md_txtHeader}>Loại bài đăng</Text>
            ) : modalOrder == 4 ? (
              <Text style={styles.md_txtHeader}>Khoảng thời gian</Text>
            ) : modalOrder == 2 ? (
              <View>
                {isPostSearch ? (
                  <Text style={styles.md_txtHeader}>Thời gian</Text>
                ) : (
                  <Text style={styles.md_txtHeader}>Số bài đăng</Text>
                )}
              </View>
            ) : modalOrder == 3 ? (
              <View>
                {isPostSearch ? (
                  <Text style={styles.md_txtHeader}>Lượt upvote</Text>
                ) : (
                  <Text style={styles.md_txtHeader}>Số lượt theo dõi</Text>
                )}
              </View>
            ) : (
              <Text style={styles.md_txtHeader}>Số lượt trả lời</Text>
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
      >
        {/* {<ModalContent style={{ marginHorizontal: -16 }}>
            <DateRangePicker
        initialRange={['2018-04-01', '2018-04-10']}
        onSuccess={(s, e) => alert(s + '||' + e)}
        theme={{ markColor: 'red', markTextColor: 'white' }}
      /></ModalContent>} */}
        {modalOrder == 0 ? (
          <ModalContent style={{ marginHorizontal: -16 }}>
            <View>
              {isPostSearch ? (
                <View>
                  <TouchableOpacity onPress={() => setModalOrder(4)}>
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
                  <TouchableOpacity onPress={() => setModalOrder(6)}>
                    <View style={styles.md_field}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name={'question-circle'}
                          size={20}
                          color={main_color}
                        />
                        <Text style={styles.md_txtfield}>Loại bài đăng</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.md_txtchoose}>
                          {filterType == 1
                            ? 'Chia sẻ'
                            : filterType == 0
                            ? 'Câu hỏi'
                            : 'Tất cả'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}
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
              <View
                style={{
                  backgroundColor: main_2nd_color,
                  marginTop: -4,
                  paddingLeft: 4,
                  paddingBottom: 2,
                }}
              >
                <Text style={{ color: '#fff' }}>Sắp xếp theo</Text>
              </View>
              {isPostSearch ? (
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
                            ? 'Giảm dần'
                            : filterTime == 0
                            ? 'Tăng dần'
                            : 'Chưa chọn'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <TouchableOpacity onPress={() => setModalOrder(2)}>
                    <View style={styles.md_field}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name={'question-circle'}
                          size={20}
                          color={main_color}
                        />
                        <Text style={styles.md_txtfield}>Số bài đăng</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <Text style={styles.md_txtchoose}>
                          {filterTime == 1
                            ? 'Giảm dần'
                            : filterTime == 0
                            ? 'Tăng dần'
                            : 'Chưa chọn'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              {isPostSearch ? (
                <View>
                  <TouchableOpacity onPress={() => setModalOrder(3)}>
                    <View style={styles.md_field}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name={'question-circle'}
                          size={20}
                          color={main_color}
                        />
                        <Text style={styles.md_txtfield}>Số lượt upvote</Text>
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
              ) : (
                <View>
                  <TouchableOpacity onPress={() => setModalOrder(3)}>
                    <View style={styles.md_field}>
                      <View style={{ flexDirection: 'row' }}>
                        <Icon
                          name={'question-circle'}
                          size={20}
                          color={main_color}
                        />
                        <Text style={styles.md_txtfield}>Số lượt theo dõi</Text>
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
              )}
              {isPostSearch ? (
                <View>
                  <TouchableOpacity onPress={() => setModalOrder(5)}>
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
                          {filterComment == 1
                            ? 'Giảm dần'
                            : filterComment == 0
                            ? 'Tăng dần'
                            : 'Chưa chọn'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  onSearch();
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
                    setFilterVote(-1);
                    setFilterComment(-1);
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
                      {isPostSearch ? (
                        <Text style={{ ...styles.md_txtfield, color: '#000' }}>
                          Bài đăng mới nhất
                        </Text>
                      ) : (
                        <Text style={{ ...styles.md_txtfield, color: '#000' }}>
                          Số bài đăng giảm dần
                        </Text>
                      )}
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
                    setFilterVote(-1);
                    setFilterComment(-1);
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
                      {isPostSearch ? (
                        <Text style={styles.md_txtfield}>Bài đăng cũ nhất</Text>
                      ) : (
                        <Text style={styles.md_txtfield}>
                          Số bài đăng tăng dần
                        </Text>
                      )}
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
                    setFilterTime(-1);
                    setFilterComment(-1);
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
                      {isPostSearch ? (
                        <Text style={{ ...styles.md_txtfield, color: '#000' }}>
                          Số upvote giảm dần
                        </Text>
                      ) : (
                        <Text style={{ ...styles.md_txtfield, color: '#000' }}>
                          Lượt theo dõi giảm dần
                        </Text>
                      )}
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

                    setFilterTime(-1);
                    setFilterComment(-1);
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
                      {isPostSearch ? (
                        <Text style={styles.md_txtfield}>
                          Số upvote tăng dần
                        </Text>
                      ) : (
                        <Text style={styles.md_txtfield}>
                          Lượt theo dõi tăng dần
                        </Text>
                      )}
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
            <DateRangePicker
              initialRange={['2018-04-01', '2018-04-10']}
              onSuccess={(s, e) => {
                setModalOrder(0);
                setRangeDate({ startDate: s, endDate: e });
              }}
              theme={{ markColor: 'red', markTextColor: 'white' }}
            />
          </ModalContent>
        ) : modalOrder == 5 ? (
          <ModalContent>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFilterComment(1);

                    setFilterTime(-1);
                    setFilterVote(-1);
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
                      <Text style={{ ...styles.md_txtfield, color: '#000' }}>
                        Số lượt trả lời giảm dần
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

                    setFilterTime(-1);
                    setFilterVote(-1);
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
                        Số lượt trả lời tăng dần
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
        ) : modalOrder == 6 ? (
          <ModalContent>
            <View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFilterType(0);
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
                      <Text style={{ ...styles.md_txtfield, color: '#000' }}>
                        Câu hỏi
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'dot-circle'}
                        size={24}
                        color={filterType == 0 ? main_color : '#ccc'}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setFilterType(1);
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
                      <Text style={styles.md_txtfield}>Chia sẻ</Text>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Icon
                        name={'dot-circle'}
                        size={24}
                        color={filterType == 1 ? main_color : '#ccc'}
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
        onHardwareBackPress={() => {
          setModalFieldVisible(false);

          return true;
        }}
        onTouchOutside={() => {
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
      <PostOptionModal
        visible={modalPostVisible}
        saved={savedModal}
        id={idModal}
        onVisible={onVisibleCallBack}
        onDelete={onDeleteCallback}
        onNotExist={onNotExist}
      />

      <ImageView
        images={[{ uri: imgView }]}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  );
}

export default Search;
