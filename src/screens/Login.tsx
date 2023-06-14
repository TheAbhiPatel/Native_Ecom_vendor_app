import {Image, StyleSheet, Text, View} from 'react-native';
import React, {FC, useState} from 'react';
import {THEME_COLOR} from '../utils/theme';
import Input from '../components/Input';
import Button from '../components/Button';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../type';
import MyModal from '../components/MyModal';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Iprops = StackScreenProps<RootStackParamList, 'Login'>;

const Login: FC<Iprops> = ({navigation}) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [isModalOpen, setIsModelOpen] = useState<boolean>(false);
  const [modalMsg, setModalMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      handleModalOpen(' All field must be required!');
    } else {
      setIsLoading(true);
      const user = await checkUserExists();
      if (!user) {
        setIsLoading(false);
        handleModalOpen('User not found');
      } else if (user.password !== password) {
        setIsLoading(false);
        handleModalOpen('Password incorrect');
      } else {
        setIsLoading(false);
        goToNextScreen(user);
      }
    }
  };

  const checkUserExists = async () => {
    return firestore()
      .collection('vendors')
      .where('email', '==', email)
      .get()
      .then(snapShot => {
        console.log(snapShot?.docs[0]?.data());

        return snapShot?.docs[0]?.data();
      })
      .catch(error => {
        console.log(error);
      });
  };

  const goToNextScreen = async (user: FirebaseFirestoreTypes.DocumentData) => {
    // handleModalOpen('user are success');
    await AsyncStorage.setItem('NAME', user.name);
    await AsyncStorage.setItem('EMAIL', user.email);
    await AsyncStorage.setItem('USERID', user.userId);
    await AsyncStorage.setItem('MOBILE', user.mobile);
    navigation.navigate('Main');
  };

  const handleModalOpen = (msg: string) => {
    setIsModelOpen(true);
    setModalMsg(msg);
  };

  return (
    <View style={styles.container}>
      {isLoading && <Loader />}
      <MyModal
        visible={isModalOpen}
        setIsModelOpen={setIsModelOpen}
        msg={modalMsg}
      />
      <Image source={require('../images/banner1.jpg')} style={styles.banner} />

      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <Input
          placeholder="Enter Email"
          onChangeText={txt => {
            setEmail(txt);
          }}
          keyboardType="email-address"
        />

        <Input
          placeholder="Enter Password"
          onChangeText={txt => {
            setPassword(txt);
          }}
        />
        <Button title="Login" onPress={handleLogin} />
        <Text
          onPress={() => navigation.navigate('Signup')}
          style={{alignSelf: 'center', marginTop: 10}}>
          Don't have an Account ? <Text style={styles.signupText}>Signup</Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    width: '100%',
    height: 230,
  },
  card: {
    position: 'absolute',
    top: 170,
    width: '97%',
    height: '100%',
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 5,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: THEME_COLOR,
    marginTop: 20,
  },
  signupText: {fontSize: 16, fontWeight: '500', color: THEME_COLOR},
});
