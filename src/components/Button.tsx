import {
  Dimensions,
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React, {FC} from 'react';
import {THEME_COLOR} from '../utils/theme';

interface IProps {
  title: string;
  onPress: ((event: GestureResponderEvent) => void) | undefined;
}

const Button: FC<IProps> = ({onPress, title}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width - 50,
    height: 40,
    borderRadius: 7,
    backgroundColor: THEME_COLOR,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
  },
});
