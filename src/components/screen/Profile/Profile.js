import React, { useEffect, useState } from 'react';
import {
  Image,
  Text,
  FlatList,
  View,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { logout } from 'actions/UserActions';
import Button from 'components/common/Button';
import styles from 'components/screen/Profile/styles';
import TextStyles from 'helpers/TextStyles';
import strings from 'localization';
import { color } from 'react-native-reanimated';
import {
  badge_level1,
  badge_level2,
  badge_level3,
  badge_level4,
  badge_level5,
  main_2nd_color,
  main_color,
  touch_color,
} from 'constants/colorCommon';
import Icon from 'react-native-vector-icons/FontAwesome5';
import PostCard from '../../common/PostCard';
import { api } from 'constants/route';
import { getUser } from 'selectors/UserSelectors';
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { useTheme, useNavigation, useRoute } from '@react-navigation/native';
import navigationConstants from 'constants/navigation';
import Toast from 'react-native-toast-message';
import storage from '@react-native-firebase/storage';
import { actionTypes, update } from 'actions/UserActions';
import FollowService from 'controllers/FollowService';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';
import ChatService from 'controllers/ChatService';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
function GroupAmount(props) {
  return (
    <View>
      <View style={styles.alignItemCenter}>
        <Text style={styles.txtAmount}>{props.amount}</Text>
        <Text style={styles.txtTitleAmount}>{props.title}</Text>
      </View>
    </View>
  );
}

function GroupInfor(props) {
  return (
    <View style={styles.grInfor}>
      <Icon name={props.icon} size={18} />
      <Text style={styles.txtInfor}>{props.name}</Text>
    </View>
  );
}
function GroupOption(props) {
  return (
    <View style={styles.flex1}>
      <TouchableHighlight underlayColor={touch_color}>
        <View style={styles.btnOption}>
          <Icon name={props.icon} size={22} color={main_color} />
          <Text style={styles.txtOption}>{props.option}</Text>
        </View>
      </TouchableHighlight>
    </View>
  );
}
const user = {
  name: 'Nguyễn Văn Nam',
  follower: 20,
  following: 21,
  amountPost: 10,
  school: 'Đại học Công nghệ thông tin - ĐHQG TPHCM',
  specialized: 'Ngành kỹ thuật phần mềm',
  graduation: 'Đã tốt nghiệp',
};
const fields = [
  {
    id: 1,
    name: 'Cơ sở dữ liệu',
    level: 3,
    badge: require('../../../assets/level3.png'),
  },
  {
    id: 2,
    name: 'Giải tích',
    level: 5,
    badge: require('../../../assets/level5.png'),
  },
];
function Profile({ userId }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const [isLoading, setIsLoading] = useState(true);
  const curUser = useSelector(getUser);
  const [data, setData] = useState(curUser);

  const [avatar, setAvatar] = useState('');
  const [bg, setBg] = useState();
  const [chosing, setChosing] = useState(false);
  //loading
  const [refreshing, setRefreshing] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [skip, setSkip] = useState(0);
  //check me or not
  const [isMe, setIsMe] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const onFollow = async () => {
    setLoading(true);
    if (isFollowing) {
      await FollowService.unfollow(curUser.jwtToken, { from_id: data.oid })
        .then(res => {
          setLoading(false);
          setIsFollowing(false);
          route.params.callback(false);
        })
        .catch(error => console.log(error));
    } else {
      await FollowService.follow(curUser.jwtToken, data.oid)
        .then(res => {
          setLoading(false);
          setIsFollowing(true);
          route.params.callback(true);
        })
        .catch(error => console.log(error));
    }
  };
  useEffect(() => {
    if (route.params?.update) {
      setIsLoading(true);
      ToastAndroid.show('Đang cập nhật ...', ToastAndroid.SHORT);
      if (route.params.update) {
        const postAPI = async () => {
          await UserService.updateUser(curUser.jwtToken, route.params.data)
            .then(res => {
              setData(res.data.result);
              setIsLoading(false);
              dispatch(update(curUser.jwtToken));
            })
            .catch(error => console.log(error));
          await UserService.updateFieldOfUser(curUser.jwtToken, {
            fields: route.params.data.fields,
          }).catch(error => console.log(error));
        };
        postAPI();
      }
    }
    // else console.log('update cc');
  }, [route.params?.update, route.params?.data]);
  useEffect(() => {
    let isRender = true;
    let url = 'User/get/' + curUser.oid;
    if (route.params?.id)
      if (route.params.id != curUser.oid) {
        setIsMe(false);
        url = 'User/get/' + route.params.id;
      }
    if (isMe) dispatch(update(curUser.jwtToken));

    const fetchData1 = async () => {
      await UserService.getUser(curUser.jwtToken, url)
        .then(async resUser => {
          setData(resUser.data.result);
          setAvatar(resUser.data.result.avatar.image_hash);
          if (route.params?.id) {
            await FollowService.getFollowingByUserId(curUser.jwtToken, {
              id: curUser.oid,
              skip: 0,
              count: 99,
            })
              .then(res => {
                res.data.result.forEach(i => {
                  if (resUser.data.result.oid == i.toId)
                    if (isRender) {
                      setIsFollowing(true);
                    }
                });

                setLoading(false);
              })
              .catch(error => console.log(error));
          }
          await PostService.getPostByUserId(curUser.jwtToken, {
            oid: resUser.data.result.oid,
            skip: 0,
            count: 5,
          })
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
  }, [route.params?.id]);

  const fetchMore = async () => {
    await UserService.getUserById(curUser.jwtToken, data.oid)
      .then(async resUser => {
        await PostService.getPostByUserId(curUser.jwtToken, {
          oid: resUser.data.result.oid,
          skip: skip,
          count: 5,
        })
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
            if (resPost.data.result.length > 0) {
              setSkip(skip + 5);
              setPosts(posts.concat(resPost.data.result));
            }
            setIsEnd(false);
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log(error));
  };

  const renderItem = ({ item }) => {
    return <PostCard post={item} />;
  };
  const renderBadge = item => {
    return (
      <View
        style={{
          borderColor: item.color,
          ...styles.badgeContainer,
        }}
      >
        <Image style={{ width: 20, height: 24 }} source={item.badge} />
        <Text style={{ color: item.color, ...styles.badgeText }}>
          {item.name}
        </Text>
      </View>
    );
  };
  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        const uri = image.path;
        const filename = 'avatar_' + curUser.oid;
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
          .ref('avatar/' + filename)
          .putFile(uploadUri);
        // set progress state
        task.on('state_changed', snapshot => {
          console.log('uploading avatar..');
        });
        ToastAndroid.show('Đang tải ảnh lên...', ToastAndroid.SHORT);
        try {
          await task.then(async response => {
            await storage()
              .ref(response.metadata.fullPath)
              .getDownloadURL()
              .then(async url => {
                setAvatar(url);
                await UserService.updateAvatar(curUser.jwtToken, url)
                  .then(response => {
                    Toast.show({
                      type: 'success',
                      position: 'top',
                      text1: 'Ảnh đại diện đã được thay đổi.',
                      visibilityTime: 2000,
                    });
                    dispatch(update(curUser.jwtToken));
                  })
                  .catch(error => console.log(error));
              });
          });
        } catch (e) {
          console.error(e);
        }
      }
    });
  };
  const cameraImage = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      mediaType: 'photo',
      cropping: true,

      compressImageQuality: 1,
    }).then(async image => {
      if (image) {
        const uri = image.path;
        const filename = 'avatar_' + curUser.oid;
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
          .ref('avatar/' + filename)
          .putFile(uploadUri);
        // set progress state
        task.on('state_changed', snapshot => {
          console.log('uploading avatar..');
        });
        ToastAndroid.show('Đang tải ảnh lên...', ToastAndroid.SHORT);

        try {
          await task.then(async response => {
            await storage()
              .ref(response.metadata.fullPath)
              .getDownloadURL()
              .then(async url => {
                setAvatar(url);
                await UserService.updateAvatar(curUser.jwtToken, url)
                  .then(response => {
                    Toast.show({
                      type: 'success',
                      position: 'top',
                      text1: 'Ảnh đại diện đã được thay đổi.',
                      visibilityTime: 2000,
                    });
                    dispatch(update(curUser.jwtToken));
                  })
                  .catch(error => console.log(error));
              });
          });
        } catch (e) {
          console.error(e);
        }
      }
    });
  };

  const uploadImage = async () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 0.5,
    }).then(async image => {
      if (image) {
        const uri = image.path;
        const filename = 'avatar_' + curUser.oid;
        const uploadUri =
          Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
        const task = storage()
          .ref('avatar/' + filename)
          .putFile(uploadUri);
        // set progress state
        task.on('state_changed', snapshot => {
          console.log(
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
          );
        });
        try {
          await task.then(response => console.log(response));
        } catch (e) {
          console.error(e);
        }
      }
    });
  };
  const goToConversation = async () => {
    await ChatService.createConversation(curUser.jwtToken, data.oid).then(
      res => {
        console.log(res.data.result.oid);
        navigation.navigate(navigationConstants.conversation, {
          id: res.data.result.oid,
          avatar: data.avatar.image_hash,
          name: data.first_name + ' ' + data.last_name,
        });
      }
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <SafeAreaView>
          <FlatList
            style={{ flexGrow: 0 }}
            onEndReached={async () => {
              if (posts.length > 4 && !isEnd) {
                setIsEnd(true);
                await fetchMore();
              }
            }}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            data={posts}
            renderItem={item => renderItem(item)}
            keyExtractor={(item, index) => index.toString()}
            ListHeaderComponent={() => (
              <View style={styles.container}>
                <View>
                  <Image
                    style={styles.imgCover}
                    source={require('../../../assets/test.png')}
                  />
                </View>
                <View style={styles.containerProfile}>
                  <Image
                    style={styles.imgBigAvatar}
                    source={
                      avatar == ''
                        ? require('../../../assets/test.png')
                        : { uri: avatar }
                    }
                  />
                  {isMe ? (
                    <TouchableOpacity
                      onPress={() => setChosing(true)}
                      style={{
                        alignSelf: 'center',
                        top: 24,
                        left: deviceWidth / 2 + 12,
                        position: 'absolute',
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: main_2nd_color,
                          padding: 8,
                          borderRadius: 30,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Icon name={'edit'} size={20} color={'#fff'} />
                      </View>
                    </TouchableOpacity>
                  ) : null}
                  <Text style={styles.txtName}>
                    {data ? data.first_name : null}{' '}
                    {data ? data.last_name : null}
                  </Text>
                  <View style={styles.containerAmount}>
                    <View style={styles.flex1}>
                      <GroupAmount
                        amount={
                          typeof data.posts === 'undefined'
                            ? 0
                            : data.post_count
                        }
                        title={'Bài đăng'}
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.push(navigationConstants.follower, {
                          id: data.oid,
                        })
                      }
                      style={styles.flex1}
                    >
                      <GroupAmount
                        amount={data.followers}
                        title={'Người theo dõi'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.push(navigationConstants.following, {
                          id: data.oid,
                        })
                      }
                      style={styles.flex1}
                    >
                      <GroupAmount
                        amount={data.followings}
                        title={'Đang theo dõi'}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginLeft: 16,
                    }}
                  >
                    {fields.map((item, index) => (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate(navigationConstants.listField)
                        }
                        key={index}
                      >
                        {item.level == 1
                          ? renderBadge({
                              name: item.name,
                              badge: item.badge,
                              color: badge_level1,
                            })
                          : item.level == 2
                          ? renderBadge({
                              name: item.name,
                              badge: item.badge,
                              color: badge_level2,
                            })
                          : item.level == 3
                          ? renderBadge({
                              name: item.name,
                              badge: item.badge,
                              color: badge_level3,
                            })
                          : item.level == 4
                          ? renderBadge({
                              name: item.name,
                              badge: item.badge,
                              color: badge_level4,
                            })
                          : renderBadge({
                              name: item.name,
                              badge: item.badge,
                              color: badge_level5,
                            })}
                      </TouchableOpacity>
                    ))}
                  </View>
                  <GroupInfor name={user.school} icon={'school'} />
                  <GroupInfor name={user.specialized} icon={'user-cog'} />
                  <GroupInfor name={user.graduation} icon={'graduation-cap'} />
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(navigationConstants.profileDetail, {
                        data: data,
                      })
                    }
                  >
                    <GroupInfor
                      name={'Xem chi tiết thông tin'}
                      icon={'ellipsis-h'}
                    />
                  </TouchableOpacity>
                  {isMe ? null : (
                    <View style={styles.containerButton}>
                      {loading ? (
                        <View style={styles.btnFollow}>
                          <ActivityIndicator
                            size={'small'}
                            color={'#fff'}
                            style={{ alignSelf: 'center' }}
                          />
                        </View>
                      ) : (
                        <TouchableHighlight
                          style={
                            isFollowing ? styles.btnUnFollow : styles.btnFollow
                          }
                          underlayColor={touch_color}
                          onPress={() => {
                            onFollow();
                          }}
                        >
                          <Text
                            style={
                              isFollowing
                                ? styles.txtUnFollow
                                : styles.txtFollow
                            }
                          >
                            {isFollowing ? 'Hủy theo dõi' : 'Theo dõi'}
                          </Text>
                        </TouchableHighlight>
                      )}
                      <TouchableHighlight
                        style={styles.btnFollow}
                        underlayColor={touch_color}
                        onPress={() => goToConversation()}
                      >
                        <Text style={styles.txtFollow}>Nhắn tin</Text>
                      </TouchableHighlight>
                    </View>
                  )}
                </View>
                <View style={styles.containerNew}>
                  <View style={styles.grNew}>
                    <View style={styles.flex1}>
                      <Image
                        style={styles.imgAvatar}
                        source={
                          avatar == ''
                            ? require('../../../assets/test.png')
                            : { uri: avatar }
                        }
                      />
                    </View>
                    <TouchableHighlight
                      onPress={() =>
                        navigation.navigate(navigationConstants.create)
                      }
                      underlayColor={touch_color}
                      style={styles.btnBoxNew}
                    >
                      <Text style={styles.txtNew}>
                        Bạn có câu hỏi gì mới, {data ? data.first_name : null}{' '}
                        {data ? data.last_name : null}?
                      </Text>
                    </TouchableHighlight>
                  </View>
                  <View style={styles.grOption}>
                    <GroupOption icon={'plus-circle'} option={'Lĩnh vực'} />
                    <GroupOption
                      icon={'square-root-alt'}
                      option={'Công thức'}
                    />
                    <GroupOption icon={'images'} option={'Hình ảnh'} />
                  </View>
                </View>
                {posts.length == 0 ? (
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 16,
                      color: '#616161',
                      marginTop: 16,
                      height: 140,
                    }}
                  >
                    Bạn chưa có bài đăng nào. Đặt câu hỏi ngay!
                  </Text>
                ) : null}
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
        </SafeAreaView>
      </View>
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
      {chosing ? (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#ccc',
            height: deviceHeight,
            width: deviceWidth,
            opacity: 0.9,
          }}
        >
          <TouchableOpacity
            style={{ height: deviceHeight, width: deviceWidth }}
            onPress={() => setChosing(false)}
          >
            <View
              style={{
                marginTop: 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 30, fontWeight: 'bold', color: main_color }}
              >
                Bạn muốn chọn ảnh từ
              </Text>
              <TouchableOpacity
                onPress={() => {
                  pickImage();
                  setChosing(false);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: main_2nd_color,
                    padding: 12,
                    borderRadius: 20,
                    paddingHorizontal: 32,
                    marginVertical: 40,
                  }}
                >
                  <Image
                    source={require('../../../assets/gallary.png')}
                    style={{ width: 48, height: 48 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginLeft: 20,
                      color: '#fff',
                    }}
                  >
                    Thư viện
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  cameraImage();
                  setChosing(false);
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: main_2nd_color,
                    padding: 12,
                    borderRadius: 20,
                    paddingHorizontal: 32,
                  }}
                >
                  <Image
                    source={require('../../../assets/camera.png')}
                    style={{ width: 48, height: 48 }}
                  />
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      marginLeft: 20,
                      color: '#fff',
                    }}
                  >
                    Máy ảnh
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

export default Profile;
