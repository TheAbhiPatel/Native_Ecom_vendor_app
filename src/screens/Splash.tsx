import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {FC, useEffect} from 'react';
import {THEME_COLOR} from '../utils/theme';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../type';
import AsyncStorage from '@react-native-async-storage/async-storage';

type IProps = StackScreenProps<RootStackParamList, 'Splash'>;

const Splash: FC<IProps> = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      // navigation.replace('Login');
      checkLogin();
    }, 2000);
  }, []);

  const checkLogin = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    // console.log('------- userid --->', userId);
    if (userId !== null) {
      navigation.navigate('Main');
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={THEME_COLOR} barStyle={'light-content'} />
      <Text style={styles.title}>My E COM</Text>
      <Text style={[styles.title2]}>Vendor App</Text>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  title2: {
    fontSize: 16,
    color: '#fff',
    marginTop: 2,
  },
});
