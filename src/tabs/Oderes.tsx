import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Oderes = () => {
  return (
    <View style={styles.container}>
      <Text>Oderes screen</Text>
    </View>
  );
};

export default Oderes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
