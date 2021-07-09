import { useTheme } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import {
  Text,
  View,
  FlatList,
  Pressable,
  TouchableHighlight,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  Keyboard,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import styles from 'components/screen/HelpPost/styles';
import { getJwtToken, getBasicInfo } from 'selectors/UserSelectors';
import Icon from 'react-native-vector-icons/FontAwesome5';
import navigationConstants from 'constants/navigation';
import { main_color, touch_color } from 'constants/colorCommon';
import moment from 'moment';
import ChatService from 'controllers/ChatService';
import { TextInput } from 'react-native';
import PostService from 'controllers/PostService';
const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

function UserCard({ item }) {
  const jwtToken = useSelector(getJwtToken);
  const userInfo = useSelector(getBasicInfo);
  const route = useRoute();
  const [following, setFollowing] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const onCallback = React.useCallback(value => {});
  const goToConversation = async item => {
    await ChatService.createConversation(jwtToken, item.oid).then(res => {
      navigation.navigate(navigationConstants.conversation, {
        id: res.data.result.oid,
        avatar: item.avatar_hash,
        name: item.name,
      });
    });
  };
  return (
    <Card containerStyle={styles.cardContainer}>
      <TouchableHighlight
        underlayColor={touch_color}
        style={styles.card}
        onPress={() =>
          navigation.push(navigationConstants.profile, {
            id: item.oid,
            callback: onCallback,
          })
        }
      >
        <View style={styles.header}>
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
                  item.avatar_hash
                    ? { uri: item.avatar_hash }
                    : require('../../../assets/avatar.jpeg')
                }
              />
            </TouchableOpacity>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.txtAuthor}>{item.name}</Text>
              {item.additional_infos.length > 0 &&
              item.additional_infos[0].information_value != '' ? (
                <Text style={styles.txtContent}>
                  {item.additional_infos[0].information_value}
                </Text>
              ) : (
                <Text style={styles.txtContent}>{item.address.city}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              goToConversation(item);
            }}
          >
            <Text
              style={{
                color: '#fff',
                alignSelf: 'center',
                backgroundColor: main_color,
                padding: 4,
                paddingHorizontal: 8,
                borderRadius: 8,
              }}
            >
              Nhắn tin
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    </Card>
  );
}
function HelpPost() {
  const [list, setList] = useState([]);
  const [user, setUser] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const jwtToken = useSelector(getJwtToken);
  const route = useRoute();
  const [search, setSearch] = useState('');
  const curUser = useSelector(getBasicInfo);
  const [isSearch, setIsSearch] = useState(false);
  useEffect(() => {
    let isOut = false;
    const fetch = async () => {
      await PostService.getHelpPostById(jwtToken, route.params?.id)
        .then(res => {
          if (!isOut) {
            res.data.result.forEach(
              i => (i.name = i.first_name + ' ' + i.last_name)
            );
            setList(res.data.result.filter(i => i.oid != curUser.id));
            setUser(res.data.result.filter(i => i.oid != curUser.id));
            setIsLoading(false);
            setIsSearch(false);
          }
        })
        .catch(error => console.log(error));
    };
    fetch();
    return () => {
      isOut = true;
    };
  }, [route.params.id]);
  useEffect(() => {
    if (list.length > 0) {
      setList(user.filter(i => i.name.includes(search)));
    }
  }, [search]);
  const renderItem = ({ item }) => {
    return <UserCard item={item} />;
  };
  return (
    <View style={[{ flex: 1, justifyContent: 'flex-end' }]}>
      <View style={{ justifyContent: 'center', marginBottom: 4 }}>
        <TextInput
          style={{
            alignSelf: 'stretch',
            backgroundColor: '#fff',
            borderRadius: 100,
            margin: 8,
            marginBottom: 0,
            paddingHorizontal: 12,
            paddingVertical: 4,
          }}
          onChangeText={text => setSearch(text)}
          value={search}
          placeholder={'Tìm theo tên...'}
        />
        <View
          style={{
            position: 'absolute',
            alignSelf: 'flex-end',
            right: 16,
            top: 16,
          }}
        >
          <TouchableOpacity
           
          >
            <Icon name={'search'} size={20} color={'#000'} />
          </TouchableOpacity>
        </View>
      </View>

      {list.length == 0 ? (
        <Text style={{ alignSelf: 'center', position: 'absolute', top: 100 }}>
          Không có người giúp đỡ phù hợp.
        </Text>
      ) : null}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={list}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
    </View>
  );
}
export default HelpPost;
