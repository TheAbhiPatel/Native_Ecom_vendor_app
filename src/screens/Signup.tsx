import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import {THEME_COLOR} from '../utils/theme';
import Input from '../components/Input';
import Button from '../components/Button';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../type';
import MyModal from '../components/MyModal';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import Loader from '../components/Loader';

type IProps = StackScreenProps<RootStackParamList, 'Signup'>;

const Signup: FC<IProps> = ({navigation}) => {
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [mobile, setMobile] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [cPassword, setCPassword] = useState<string>();
  const [isModalOpen, setIsModelOpen] = useState<boolean>(false);
  const [modalMsg, setModalMsg] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignup = async () => {
    if (!name || !email || !mobile || !password || !cPassword) {
      handleModalOpen(' All field must be required!');
    } else if (password !== cPassword) {
      handleModalOpen('Password must be match!');
    } else {
      setIsLoading(true);
      const user = await checkUserAlreadyExists();
      if (user) {
        setIsLoading(false);
        handleModalOpen('User registered already!');
      } else {
        const userId: string = uuid.v4();
        firestore()
          .collection('vendors')
          .doc(userId)
          .set({
            name,
            email,
            mobile,
            password,
            userId,
          })
          .then(res => {
            setIsLoading(false);
            handleModalOpen('User registered Successfully');
            console.log(res);
          })
          .catch(error => {
            setIsLoading(false);
            console.log('error', error);
          });
      }
    }
  };

  const checkUserAlreadyExists = async () => {
    return firestore()
      .collection('vendors')
      .where('email', '==', email)
      .get()
      .then(snapShot => {
        return snapShot?.docs[0]?.data();
      })
      .catch(error => {
        console.log(error);
      });
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
      <Image source={require('../images/banner2.jpg')} style={styles.banner} />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}>
        <Image
          source={require('../images/back.png')}
          style={{height: 35, width: 35}}
        />
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.title}>Sign up</Text>
        <Input
          placeholder="Enter Name"
          onChangeText={txt => {
            setName(txt);
          }}
        />
        <Input
          placeholder="Enter Email"
          onChangeText={txt => {
            setEmail(txt);
          }}
          keyboardType="email-address"
        />
        <Input
          placeholder="Enter Mobile No."
          onChangeText={txt => {
            setMobile(txt);
          }}
          keyboardType="number-pad"
        />
        <Input
          placeholder="Enter Password"
          onChangeText={txt => {
            setPassword(txt);
          }}
        />
        <Input
          placeholder="Confirm Password"
          onChangeText={txt => {
            setCPassword(txt);
          }}
        />
        <Button title="Sign up" onPress={handleSignup} />
        <Text
          onPress={() => navigation.goBack()}
          style={{alignSelf: 'center', marginTop: 10}}>
          Already have an Account ? <Text style={styles.loginText}>Login</Text>
        </Text>
      </View>
    </View>
  );
};

export default Signup;

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
    marginTop: 10,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME_COLOR,
  },
  backBtn: {
    height: 40,
    width: 40,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 20,
    left: 20,
  },
});
