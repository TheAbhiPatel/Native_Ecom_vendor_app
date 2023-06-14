import {
  Dimensions,
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {FC} from 'react';
import {THEME_COLOR} from '../utils/theme';
import {TextInput} from 'react-native-gesture-handler';

interface IProps {
  placeholder: string;
  value?: string;
  onChangeText: ((text: string) => void) | undefined;
  keyboardType?: KeyboardTypeOptions | undefined;
}

const Input: FC<IProps> = ({
  placeholder,
  onChangeText,
  keyboardType,
  value,
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 50,
    height: 40,
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: THEME_COLOR,
    alignSelf: 'center',
    paddingLeft: 20,
    marginTop: 20,
  },
});
