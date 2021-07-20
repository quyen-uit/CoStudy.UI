import {
  useTheme,
  useNavigation,
  CommonActions,
  useRoute,
} from '@react-navigation/native';
import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  Alert,
  Dimensions,
  useWindowDimensions,
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/Create/styles';
import { getUser, getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import {
  main_2nd_color,
  main_color,
  touch_color,
  badge_level1,
  badge_level2,
  badge_level3,
  badge_level4,
  badge_level5,
} from 'constants/colorCommon';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import 'react-native-get-random-values';
import UserService from 'controllers/UserService';
import PostService from 'controllers/PostService';
import LevelService from 'controllers/LevelService';
import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import { createThumbnail } from 'react-native-create-thumbnail';

import Modal, {
  ModalContent,
  BottomModal,
  ModalFooter,
  ModalButton,
  SlideAnimation,
} from 'react-native-modals';
import Badge from 'components/common/Badge';
import Video from 'react-native-video';
function Create() {
  const deviceWidth = useWindowDimensions().width;
  const deviceHeight = useWindowDimensions().height;
  const jwtToken = useSelector(getJwtToken);

  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState();
  const [listImg, setListImg] = useState([]);

  const [data, setData] = useState([]);
  const [fieldPickers, setFieldPickers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [chosing, setChosing] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [levelList, setLevelList] = useState([]);
  const [currFieldId, setCurrFieldId] = useState('');
  const userInfo = useSelector(getBasicInfo);
  const [violenceWords, setViolenceWords] = useState([]);
  const route = useRoute();
  const onUpvoteCallback = useCallback(value => console.log('up vote'));
  const onDownvoteCallback = useCallback(value => console.log('down vote'));
  const onCommentCallback = useCallback(value => console.log('comment'));
  const onVoteCallback = useCallback(value => console.log('vote'));
  const [visibleAlert, setVisibleAlert] = useState(false);
  const [bodyAlert, setBodyAlert] = useState('');
  const [type, setType] = useState({ name: 'Câu hỏi', type: 0 });
  const [visibleMenu, setVisibleMenu] = useState(false);
  const [isImage, setIsImage] = useState(true);
  const showAlert = (title, body) => {
    setBodyAlert(body);
    setVisibleAlert(true);
  };
  const config = {
    headers: { Authorization: `Bearer ${jwtToken}` },
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: route.params.isEdit ? 'Sửa bài đăng' : 'Tạo bài đăng',
      headerRight: () => (
        <View style={styles.headerRight}>
          {isLoading ? (
            <View style={{ marginRight: 12 }}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <TouchableOpacity onPress={() => upload()}>
              <Text style={{ color: '#fff', fontSize: 20, marginRight: 12 }}>
                {route.params.isEdit ? 'Sửa' : 'Đăng'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, title, listImg, content, isLoading, type]);
  useLayoutEffect(() => {
    navigation.reset({
      routes: [{ name: navigationConstants.tabNav }],
    });
    return () => {};
  }, []);

  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await PostService.getViolenceWord(jwtToken)
        .then(res => setViolenceWords(res.data.result))
        .catch(err => console.log(err));
      const getCurrUser = await UserService.getCurrentUser(jwtToken)
        .then(response => {
          if (isRender) {
            setData(response.data.result);
          }
        })
        .catch(error => console.log(error));
      const getFields = await UserService.getAllField(jwtToken)
        .then(async response => {
          if (route.params.isEdit) {
            await PostService.getPostById(jwtToken, route.params.postId)
              .then(async resPost => {
                setTitle(resPost.data.result.title);
                setContent(resPost.data.result.string_contents[0].content);
                setType({
                  name: resPost.data.result.post_type_name,
                  type: resPost.data.result.post_type,
                });
                response.data.result.forEach(element => {
                  element.isPick = false;
                  element.level_id = '6031da2eba003751a1470d42';
                  element.level_name = 'Level 1';
                  if (resPost.data.result.field != null)
                    resPost.data.result.field.forEach(picked => {
                      if (element.oid == picked.field_id) {
                        element.isPick = true;
                        element.level_id = picked.level_id;
                        element.level_name = picked.level_name;
                      }
                    });
                });
                setFieldPickers(response.data.result);
                let listTmp = [];
                let number = 0;
                resPost.data.result.image_contents.forEach(item => {
                  listTmp.push({
                    path: item.image_hash,
                    discription: item.discription,
                    isEdit: true,
                    mediaType: item.media_type,
                    image_url: item.image_url ? item.image_url : '',
                    modificationDate: number++
                  });
                });
                setListImg(listTmp);
                 
              })
              .catch(error => console.log(error));
          } else {
            if (isRender) {
              response.data.result.forEach(element => {
                element.isPick = false;
                element.level_id = '6031da2eba003751a1470d42';
                element.level_name = 'Level 1';
              });
              setFieldPickers(response.data.result);
            }
          }
        })
        .catch(error => console.log(error));
      const getLevels = await LevelService.getLevels(jwtToken, 0, 5)
        .then(response => {
          setLevelList(response.data.result);
        })
        .catch(error => console.log(error));
      Promise.all([getCurrUser, getFields, getLevels]).then(() =>
        setIsLoading(false)
      );
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

  // React.useEffect(() => {
  //   console.log(listImg.length);
  // }, [listImg]);
  const pickImage = () => {
    if (isImage) {
      ImagePicker.openPicker({
        width: 800,
        height: 1100,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 1,
      }).then(image => {
        if (image) {
          image.isEdit = false;
          image.mediaType = 0;
          setListImg([...listImg, image]);
        }
      });
    } else {
      ImagePicker.openPicker({
        mediaType: 'video',
      }).then(image => {
        if (image) {
          image.isEdit = false;
          image.mediaType = 1;
          image.image_url = image.path;
          setListImg([...listImg, image]);
        }
      });
    }
  };
  const cameraImage = () => {
    if (isImage) {
      ImagePicker.openCamera({
        width: 800,
        height: 1100,
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 1,
      }).then(image => {
        if (image) {
          image.isEdit = false;
          image.mediaType = 0;
          setListImg([...listImg, image]);
        }
      });
    } else {
      ImagePicker.openCamera({
        mediaType: 'video',
      }).then(image => {
        image.isEdit = false;
        image.mediaType = 1;
        image.image_url = image.path;
        setListImg([...listImg, image]);
      });
    }
  };

  const upload = async () => {
    setIsLoading(true);
    if (title == '') {
      showAlert('Thiếu thông tin', 'Vui lòng nhập tiêu đề');
      setIsLoading(false);
      return;
    } else if (content == '') {
      showAlert('Thiếu thông tin', 'Vui lòng nhập nội dung');
      setIsLoading(false);
      return;
    }
    // if (violenceWords.length > 0) {
    //   if (violenceWords.filter(i => title.includes(i.value)).length > 0) {
    //     showAlert('Thiếu thông tin', 'Tiêu đề chứa từ ngữ không phù hợp.');
    //     setIsLoading(false);
    //     return;
    //   }
    //   if (violenceWords.filter(i => content.includes(i.value)).length > 0) {
    //     showAlert('Thiếu thông tin', 'Nội dung chứa từ ngữ không phù hợp.');
    //     setIsLoading(false);
    //     return;
    //   }
    // }
    ToastAndroid.show('Đang đăng bài...', ToastAndroid.SHORT);
    let list = [];
    // test edit
    if (route.params.isEdit) {
      let promises = listImg.map(async image => {
        if (!image.isEdit) {
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
                .then(async url => {
                  if (image.mediaType == 0) {
                    list = [
                      ...list,
                      {
                        discription: image.discription,
                        image_hash: url,
                        media_type: image.mediaType,
                      },
                    ];
                  } else {
                    await createThumbnail({
                      url: image.path,
                    })
                      .then(async response => {
                        const uri1 = response.path;
                        const filename1 = uuidv4();
                        const uploadUri1 =
                          Platform.OS === 'ios'
                            ? uri1.replace('file://', '')
                            : uri1;
                        const task1 = storage()
                          .ref('post/' + userInfo.id + '/thumb/' + filename1)
                          .putFile(uploadUri1);
                        // set progress state
                        task1.on('state_changed', snapshot => {});
                        try {
                          await task1.then(async response1 => {
                            await storage()
                              .ref(response1.metadata.fullPath)
                              .getDownloadURL()
                              .then(url1 => {
                                list = [
                                  ...list,
                                  {
                                    discription: image.discription,
                                    image_hash: url,
                                    media_type: image.mediaType,
                                    image_url: url1,
                                    modificationDate: image.modificationDate
                                  },
                                ];
                              });
                          });
                        } catch (e) {
                          console.error(e);
                        }
                      })
                      .catch(err => console.log({ err }));
                  }
                });
            });
          } catch (e) {
            console.error(e);
          }
        } else {
          list = [
            ...list,
            {
              discription: image.discription,
              image_hash: image.path,
              media_type: image.mediaType,
              image_url: image.image_url,
              modificationDate: image.modificationDate
            },
          ];
        }
      });
      let tempFields = [];
      fieldPickers.forEach(item => {
        if (item.isPick == true)
          tempFields.push({ field_id: item.oid, level_id: item.level_id });
      });
      Promise.all(promises).then(async () => {
        list = list.sort((a,b) => a.modificationDate - b.modificationDate);
        await PostService.updatePost(jwtToken, {
          oid: route.params.postId,
          title: title,
          content: content,
          list: list,
          fields: tempFields,
        })
          .then(response => {
            Toast.show({
              type: 'success',
              position: 'top',
              text1: 'Sửa bài thành công.',
              visibilityTime: 2000,
            });
            // console.log(post);
            // set vote
            let vote = 0;
            if (response.data.result.is_downvote_by_current) vote = -1;
            else if (response.data.result.is_vote_by_current) vote = 1;
            console.log(response.data.result);
            navigation.replace(navigationConstants.post, {
              post: response.data.result,
              vote: vote,
              upvote: response.data.result.upvote,
              downvote: response.data.result.downvote,
              commentCount: response.data.result.comments_count,
              onUpvote: onUpvoteCallback,
              onDownvote: onDownvoteCallback,
              onComment: onCommentCallback,
              onVote: onVoteCallback,
            });
          })
          .catch(error => console.log(error));
      });
      // PostService.updatePost(jwtToken, {
      //   oid: route.params.postId,
      //   title: title,
      //   content: content,
      // })
      //   .then(res => alert('updated'))
      //   .catch(error => console.log(error));
      return;
    }
    // test edit
    let tempFields = [];
    fieldPickers.forEach(item => {
      if (item.isPick == true)
        tempFields.push({ field_id: item.oid, level_id: item.level_id });
    });
   
    navigation.navigate(navigationConstants.tabNav, {
      screen: navigationConstants.newsfeed,
      params: {
        title: title.trim(),
        content: content.trim(),
        listImg: listImg,
        fields: tempFields,
        type: type.type,
      },
    });
    // return;
    // setIsLoading(true);
    // // add list image
    // let list = [];

    // let promises = listImg.map(async image => {
    //   const uri = image.path;
    //   const filename = uuidv4();
    //   const uploadUri =
    //     Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    //   const task = storage()
    //     .ref('post/' + curUser.id + '/' + filename)
    //     .putFile(uploadUri);
    //   // set progress statec
    //   task.on('state_changed', snapshot => {});
    //   try {
    //     await task.then(async response => {
    //       await storage()
    //         .ref(response.metadata.fullPath)
    //         .getDownloadURL()
    //         .then(url => {
    //           list = [
    //             ...list,
    //             { discription: image.discription, image_hash: url },
    //           ];
    //         });
    //     });
    //   } catch (e) {
    //     console.error(e);
    //   }
    // });
    // Promise.all(promises).then(async () => {
    //   await getAPI( jwtToken)
    //     .post(
    //       api + 'Post/add',
    //       {
    //         title: title,
    //         string_contents: [{ content_type: 0, content: content }],
    //         image_contents: list,
    //         fields: temp,
    //       },
    //
    //     )
    //     .then(response => {
    //       setIsLoading(false);
    //       Toast.show({
    //         type: 'success',
    //         position: 'top',
    //         text1: 'Đăng bài thành công.',
    //         visibilityTime: 2000,
    //       });
    //     })
    //     .catch(error => console.log(error));
    // });
    // navigation.navigate(navigationConstants.newsfeed);
  };
  const addField = val => {
    setListImg([...fieldPickers, val]);
  };
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.header}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={
                typeof data.avatar == 'undefined'
                  ? require('../../../assets/test.png')
                  : { uri: data.avatar.image_hash }
              }
              style={styles.imgAvatar}
            />
            <Text style={styles.txtName}>
              {data ? data.first_name : null} {data ? data.last_name : null}
            </Text>
          </View>
          <Menu
            visible={visibleMenu}
            onDismiss={() => setVisibleMenu(false)}
            anchor={
              <TouchableOpacity
                onPress={() => {
                  if (!route.params.isEdit) setVisibleMenu(true);
                }}
              >
                <View
                  style={{
                    ...styles.picker,
                    backgroundColor: route.params.isEdit
                      ? '#ccc'
                      : main_2nd_color,
                  }}
                >
                  <Text
                    style={{
                      color: route.params.isEdit ? '#000' : '#fff',
                      marginHorizontal: 4,
                    }}
                  >
                    {type.name}
                  </Text>
                  {route.params.isEdit ? null : (
                    <Icon
                      name={'sort-down'}
                      size={20}
                      style={{
                        marginHorizontal: 4,
                        alignSelf: 'center',
                        marginTop: -6,
                      }}
                      color={'#fff'}
                    />
                  )}
                  {/* <Picker
                dropdownIconColor={'#ffffff'}
                itemStyle={{ fontSize: 12 }}
                selectedValue={'a'}
                style={{
                  height: 50,
                  width: 140,
                  color: '#fff',
                }}
                //onValueChange={(itemValue, itemIndex) => alert(itemValue)}
              >
                <Picker.Item label="Câu hỏi" value="0" />
                <Picker.Item label="Hướng dẫn" value="1" />
              </Picker> */}
                </View>
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={() => {
                setType({ name: 'Câu hỏi', type: 0 });
                setVisibleMenu(false);
              }}
              title="Câu hỏi"
            />
            <Menu.Item
              onPress={() => {
                setType({ name: 'Chia sẻ', type: 1 });
                setVisibleMenu(false);
              }}
              title="Chia sẻ"
            />
          </Menu>
        </View>

        <View style={styles.title}>
          <Text style={styles.txtTitle}>Tiêu đề: </Text>
          <TextInput
            style={{
              borderColor: 'gray',
              borderWidth: 0,
              fontSize: 18,
              paddingVertical: -8,
              fontWeight: 'bold',
            }}
            multiline={true}
            onChangeText={text => setTitle(text)}
            value={title}
            placeholder={'...'}
          />
        </View>
        <ScrollView>
          <View style={styles.content}>
            <TextInput
              multiline={true}
              style={{
                borderColor: 'gray',
                borderWidth: 0,
                fontSize: 16,
                paddingVertical: -8,
              }}
              onChangeText={text => setContent(text)}
              placeholder={'Nhập nội dung...'}
              value={content}
            />
          </View>

          <View style={styles.listImage}>
            {listImg
              ? listImg.map((item, index) => {
                  if (item.mediaType == 0)
                    return (
                      <View
                        style={{
                          marginHorizontal: 16,
                          borderBottomColor: main_color,
                          borderBottomWidth: 0.5,
                        }}
                        key={index}
                      >
                        <Image
                          style={{
                            width: '100%',
                            height: 400,
                            alignSelf: 'center',
                            marginVertical: 8,
                          }}
                          source={{
                            uri: item.path,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setListImg(
                              listImg.filter(
                                item => listImg.indexOf(item) != index
                              )
                            );
                          }}
                          style={{
                            position: 'absolute',
                            borderRadius: 30,
                            margin: 8,
                            padding: 8,
                            top: 8,
                            right: 0,
                            backgroundColor: '#ccc',
                          }}
                        >
                          <Icon
                            name={'times-circle'}
                            size={30}
                            color={'#fff'}
                          />
                        </TouchableOpacity>

                        <TextInput
                          onChangeText={text =>
                            (item.discription = text != '' ? text.trim() : text)
                          }
                          placeholder={'Nhập mô tả..'}
                        />
                      </View>
                    );
                  else {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          navigation.navigate(navigationConstants.videoPlayer, {
                            video: item.path,
                          })
                        }
                        style={{
                          marginHorizontal: 16,
                          borderBottomColor: main_color,
                          borderBottomWidth: 0.5,
                          justifyContent: 'center',
                        }}
                      >
                        <Image
                          style={{
                            width: '100%',
                            height: 400,
                            alignSelf: 'center',
                            marginVertical: 8,
                          }}
                          source={{
                            uri: item.image_url,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setListImg(
                              listImg.filter(
                                item => listImg.indexOf(item) != index
                              )
                            );
                          }}
                          style={{
                            position: 'absolute',
                            alignSelf: 'flex-end',
                            borderRadius: 30,
                            padding: 8,
                            top: 16,
                            right: 8,
                            backgroundColor: '#ccc',
                          }}
                        >
                          <Icon
                            name={'times-circle'}
                            size={30}
                            color={'#fff'}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate(
                              navigationConstants.videoPlayer,
                              {
                                video: item.path,
                              }
                            )
                          }
                          style={{
                            position: 'absolute',
                            alignSelf: 'center',
                          }}
                        >
                          <Icon name={'play'} size={30} color={'#fff'} />
                        </TouchableOpacity>

                        <TextInput
                          onChangeText={text =>
                            (item.discription = text != '' ? text.trim() : text)
                          }
                          placeholder={'Nhập mô tả..'}
                        />
                      </TouchableOpacity>
                    );
                  }
                })
              : null}
          </View>
        </ScrollView>
      </View>
      <View>
        <View style={styles.field}>
          {fieldPickers.map((item, index) =>
            item.isPick ? (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  item.isPick = false;

                  setFieldPickers(fieldPickers.filter(item => item));
                }}
              >
                <Badge
                  item={{ name: item.level_name, description: item.value }}
                />
              </TouchableOpacity>
            ) : null
          )}
        </View>
        <View style={styles.option}>
          <TouchableHighlight
            style={styles.btnInputOption}
            //onPress={() => setModalVisible(true)}
            onPress={() => {
              setModalVisible(true);
              setModalIndex(1);
            }}
            underlayColor={touch_color}
          >
            <View style={styles.flex}>
              <Icon name={'plus-circle'} size={24} color={main_color} />
              <Text style={styles.txtField}>Lĩnh vực</Text>
            </View>
          </TouchableHighlight>
          {/* <TouchableHighlight
            underlayColor={touch_color}
            style={styles.btnInputOption}
          >
            <View style={styles.flex}>
              <Icon name={'square-root-alt'} size={24} color={main_color} />
              <Text style={styles.txtField}>Công thức</Text>
            </View>
          </TouchableHighlight> */}
          <TouchableHighlight
            underlayColor={touch_color}
            style={styles.btnInputOption}
            onPress={() => {
              setChosing(true);
              setIsImage(true);
            }}
          >
            <View style={styles.flex}>
              <Icon name={'images'} size={24} color={main_color} />
              <Text style={styles.txtField}>Ảnh</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={touch_color}
            style={styles.btnInputOption}
            onPress={() => {
              setChosing(true);
              setIsImage(false);
            }}
          >
            <View style={styles.flex}>
              <Icon name={'video'} size={24} color={main_color} />
              <Text style={styles.txtField}>Video</Text>
            </View>
          </TouchableHighlight>
        </View>
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

      <BottomModal
        visible={modalVisible}
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
          setModalVisible(false);
        }}
        onHardwareBackPress={() => {
          setModalVisible(false);

          return true;
        }}
        onTouchOutside={() => {
          setModalVisible(false);
        }}
      >
        {modalIndex == 1 ? (
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
                      if (item.isPick) {
                        setCurrFieldId(item.oid);
                        setModalIndex(2);
                      }
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
          </ModalContent>
        ) : modalIndex == 2 ? (
          <ModalContent style={{ marginHorizontal: -16 }}>
            <View>
              <View
                style={{ flexWrap: 'wrap', flexDirection: 'row', padding: 8 }}
              >
                {levelList.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      fieldPickers.forEach(field => {
                        if (field.oid == currFieldId) {
                          field.level_id = item.oid;
                          field.level_name = item.name;
                        }
                        setModalIndex(1);
                      });
                    }}
                    key={index}
                  >
                    <Badge item={item} />
                  </TouchableOpacity>
                ))}
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
          </ModalContent>
        ) : null}
      </BottomModal>

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
                marginTop: deviceHeight < deviceWidth ? 0 : 100,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{ fontSize: 30, fontWeight: 'bold', color: main_color }}
              >
                Bạn muốn chọn {isImage ? 'ảnh' : 'video'} từ
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
      <Modal
        visible={visibleAlert}
        width={deviceWidth - 56}
        footer={
          <ModalFooter>
            <ModalButton
              textStyle={{ fontSize: 14, color: main_color }}
              text="Hủy"
              onPress={() => setVisibleAlert(false)}
            />
          </ModalFooter>
        }
      >
        <ModalContent>
          <View>
            <Text style={{ fontSize: 16, alignSelf: 'center' }}>
              {bodyAlert}
            </Text>
          </View>
        </ModalContent>
      </Modal>
    </View>
  );
}

export default Create;
