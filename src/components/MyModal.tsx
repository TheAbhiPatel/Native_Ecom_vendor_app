import {Modal, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {FC} from 'react';
import {THEME_COLOR} from '../utils/theme';

interface IProps {
  visible: boolean;
  msg: string;
  setIsModelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyModal: FC<IProps> = ({visible, setIsModelOpen, msg}) => {
  return (
    <Modal animationType="fade" visible={visible} transparent>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={{height: '80%'}}>
            <Text style={styles.title}>{msg}</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsModelOpen(false)}
            style={styles.okBox}>
            <Text style={styles.ok}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MyModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: '80%',
    height: 150,
    borderRadius: 10,
    padding: 10,
  },
  title: {
    fontSize: 25,
    textAlign: 'center',
    color: THEME_COLOR,
  },
  okBox: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  ok: {
    fontSize: 20,
    color: 'green',
    fontWeight: '500',
    // alignSelf: 'flex-end',
    paddingRight: 15,
  },
});
