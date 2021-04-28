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
  ActivityIndicator,
  StyleSheet,
  ToastAndroid,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/Report/styles';
import { getUser, getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import navigationConstants from 'constants/navigation';
import { main_2nd_color, main_color, touch_color } from 'constants/colorCommon';

import Icon from 'react-native-vector-icons/FontAwesome5';
import 'react-native-get-random-values';
import ReportService from 'controllers/ReportService';

import { v4 as uuidv4 } from 'uuid';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
import Modal, {
  ModalContent,
  BottomModal,
  SlideAnimation,
} from 'react-native-modals';
import Badge from 'components/common/Badge';

function Report() {
  const jwtToken = useSelector(getJwtToken);

  const navigation = useNavigation();
  const route = useRoute();
  const [content, setContent] = useState();
  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const userInfo = useSelector(getBasicInfo);

  useEffect(() => {
    let isRender = true;
    const fetchData = async () => {
      await ReportService.getAllReason(jwtToken).then(res => {
        res.data.result.forEach(item => {
          item.isPick = false;
        });
        setList(res.data.result);
        setIsLoading(false);
      });
    };
    fetchData();
    return () => {
      isRender = false;
    };
  }, []);

  const onReport = async () => {
    let listPicked = [];
    setIsLoading(true);
    list.forEach(item => {
      if (item.isPick) listPicked.push(item.oid);
    });
    if (listPicked.length > 0) {
      if (Object.keys(route.params)[0] == 'postId') {
        await ReportService.reportPost(jwtToken, {
          postId: route.params.postId,
          reasons: listPicked,
          content: content,
        });
      } else if (Object.keys(route.params)[0] == 'commentId') {
        await ReportService.reportComment(jwtToken, {
          commentId: route.params.commentId,
          reasons: listPicked,
          content: content,
        });
      } else {
        await ReportService.reportReply(jwtToken, {
          replyId: route.params.replyId,
          reasons: listPicked,
          content: content,
        });
      }
      setIsLoading(false);
      Toast.show({
        type: 'success',
        position: 'top',
        text1: 'Báo cáo thành công.',
        visibilityTime: 2000,
      });
      navigation.goBack();
    } else if (content == '') {
      Alert.alert('Không thể báo cáo', 'Vui lòng chọn một lí do báo cáo.');
      return;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Text style={{ margin: 8, marginBottom: 4 }}>
          Tại sao bạn muốn báo cáo nội dung này?
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingHorizontal: 4,
          }}
        >
          {list.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                item.isPick = item.isPick ? false : true;

                setList(list.filter(item => item));
              }}
            >
              <View
                style={{
                  borderColor: item.isPick ? '#fff' : main_2nd_color,
                  backgroundColor: item.isPick ? main_2nd_color : '#fff',
                  padding: 4,
                  paddingHorizontal: 16,
                  borderRadius: 100,
                  margin: 4,

                  borderWidth: 1,
                }}
              >
                <Text
                  style={{
                    color: item.isPick ? '#fff' : main_2nd_color,
                    fontSize: 14,
                  }}
                >
                  {item.detail}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ marginLeft: 8, marginBottom: 4 }}>
          Mô tả chi tiết lí do báo cáo:{' '}
        </Text>

        <View
          style={{ flex: 1, paddingHorizontal: 4, backgroundColor: '#fff' }}
        >
          <TextInput
            onChangeText={text => setContent(text)}
            placeholder={'Nhập mô tả chi tiết...'}
            multiline
          />
        </View>
        <TouchableOpacity
          style={{
            alignItems: 'center',
            padding: 8,
            margin: 8,
            backgroundColor: main_color,
            borderRadius: 8,
          }}
          onPress={() => onReport()}
        >
          <Text style={{ color: '#fff', fontSize: 20 }}>Báo cáo</Text>
        </TouchableOpacity>
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
    </View>
  );
}

export default Report;
