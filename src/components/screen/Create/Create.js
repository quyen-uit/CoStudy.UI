import {
  useTheme,
  useNavigation,
  CommonActions,
} from '@react-navigation/native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
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
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/Create/styles';
import { getUser, getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ImagePicker from 'react-native-image-crop-picker';
import 'react-native-get-random-values';
import UserService from 'controllers/UserService';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';

function Create() {
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

  const config = {
    headers: { Authorization: `Bearer ${ jwtToken}` },
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerRight: () => (
        <View style={styles.headerRight}>
          {isLoading ? (
            <View style={{ marginRight: 12 }}>
              <ActivityIndicator size="small" color="#fff" />
            </View>
          ) : (
            <TouchableOpacity onPress={() => upload()}>
              <Text style={{ color: '#fff', fontSize: 20, marginRight: 12 }}>
                Đăng
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, title, listImg, content, isLoading]);
  useLayoutEffect(() => {
    navigation.reset({
      routes: [{ name: navigationConstants.tabNav }],
    });
    return () => {};
  }, []);

  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await UserService.getCurrentUser( jwtToken)
        .then(response => {
          if (isRender) {
            setData(response.data.result);
            setIsLoading(false);
          }
        })
        .catch(error => console.log(error));
      await UserService.getAllField( jwtToken)
        .then(response => {
          if (isRender) {
            response.data.result.forEach(element => {
              element.isPick = false;
            });
            setIsLoading(false);
            setFieldPickers(response.data.result);
          }
        })
        .catch(error => console.log(error));
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

  React.useEffect(() => {
    console.log(listImg.length);
  }, [listImg]);
  const pickImage = () => {
    ImagePicker.openPicker({
      width: 800,
      height: 1000,
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 1,
    }).then(image => {
      if (image) {
        setListImg([...listImg, image]);
      }
    });
  };
  const cameraImage = () => {
    ImagePicker.openCamera({
      width: 800,
      height: 1000,
      mediaType: 'photo',
      cropping: true,
      compressImageQuality: 1,
    }).then(image => {
      if (image) {
        setListImg([...listImg, image]);
      }
    });
  };
  const upload = async () => {
    let temp = [];

    if (title == '') {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tiêu đề');
      return;
    } else if (content == '') {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập nội dung');
      return;
    }
    ToastAndroid.show('Bài viết đang đăng...', ToastAndroid.SHORT);
    fieldPickers.forEach(item => {
      if (item.isPick == true) temp.push(item.oid);
    });
    navigation.navigate(navigationConstants.tabNav, {
      screen: navigationConstants.newsfeed,
      params: {
        title: title,
        content: content,
        listImg: listImg,
        fields: temp,
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
    //   // set progress state
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
          <View style={styles.picker}>
            <Picker
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
              <Picker.Item label="Công khai" value="public" />
              <Picker.Item label="Riêng tư" value="private" />
            </Picker>
          </View>
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
            />
          </View>
          <View style={styles.listImage}>
            {listImg
              ? listImg.map((item, index) => {
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
                          alignSelf: 'flex-end',
                          borderRadius: 30,
                          margin: 8,
                          padding: 8,
                          backgroundColor: '#ccc',
                        }}
                      >
                        <Icon name={'times-circle'} size={30} color={'#fff'} />
                      </TouchableOpacity>

                      <TextInput
                        onChangeText={text => (item.discription = text)}
                        placeholder={'Nhập mô tả..'}
                      />
                    </View>
                  );
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
                <View style={styles.btnTag}>
                  <Text style={styles.txtTag}>{item.value}</Text>
                  <Icon name={'times'} size={10} color={'#fff'} />
                </View>
              </TouchableOpacity>
            ) : null
          )}
        </View>
        <View style={styles.option}>
          <TouchableHighlight
            style={styles.btnInputOption}
            onPress={() => setModalVisible(true)}
            underlayColor={touch_color}
          >
            <View style={styles.flex}>
              <Icon name={'plus-circle'} size={24} color={main_color} />
              <Text style={styles.txtField}>Lĩnh vực</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={touch_color}
            style={styles.btnInputOption}
           >
            <View style={styles.flex}>
              <Icon name={'square-root-alt'} size={24} color={main_color} />
              <Text style={styles.txtField}>Công thức</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={touch_color}
            style={styles.btnInputOption}
            onPress={() => setChosing(true)}
          >
            <View style={styles.flex}>
              <Icon name={'images'} size={24} color={main_color} />
              <Text style={styles.txtField}>Ảnh</Text>
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
                  style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}
                >
                  Xác nhận
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ModalContent>
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

export default Create;
