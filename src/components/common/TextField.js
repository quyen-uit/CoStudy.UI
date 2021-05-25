import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@react-navigation/native';
import { View, TextInput, StyleSheet } from 'react-native';
import TextStyles from 'helpers/TextStyles';
import Icon  from 'react-native-vector-icons/FontAwesome5';
import { hint_color, main_2nd_color } from 'constants/colorCommon';
import { TouchableOpacity } from 'react-native-gesture-handler';

const styles = StyleSheet.create({
  container: {
   alignSelf: 'stretch',
   marginHorizontal: 56,
   marginVertical: 10,
   justifyContent: 'center',
   },
 
  input: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingRight: 16,
    paddingLeft: 48,
    fontSize: 16,
    color: '#000',
   },
  icon: {
    paddingLeft: 12,
    position: 'absolute'
  }
});

function TextField({ icon, ...rest }) {
  const { colors } = useTheme();
   return (
    <View style={styles.container}>
      <TextInput
        {...rest}
        window
        placeholderTextColor={hint_color}
        style={{...styles.input, backgroundColor: typeof(rest.editable) == 'undefined'  || rest.editable ?  '#fff' : '#ccc'}}
        underlineColorAndroid="transparent"
        editable={rest.editable}
       />
      <View style={styles.icon}>
        <Icon name={icon} size={22} color={main_2nd_color}/>
      </View>
     
    </View>
  );
}

TextField.propTypes = {
  style: PropTypes.object,
};

TextField.defaultProps = {
  style: null,
};

export default TextField;
