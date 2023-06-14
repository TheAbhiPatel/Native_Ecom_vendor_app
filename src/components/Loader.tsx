import {ActivityIndicator, Modal, StyleSheet, Text, View} from 'react-native';
import React, {FC} from 'react';
import {THEME_COLOR} from '../utils/theme';

// interface IProps {
//   visible: boolean;
// }

const Loader = () => {
  return (
    <Modal transparent>
      <View style={styles.container}>
        <ActivityIndicator size={50} color={THEME_COLOR} />
      </View>
    </Modal>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
