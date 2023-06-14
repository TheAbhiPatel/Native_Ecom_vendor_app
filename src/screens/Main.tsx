import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {FC, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Products from '../tabs/Products';
import Oderes from '../tabs/Oderes';
import {THEME_COLOR} from '../utils/theme';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../type';

type IProps = StackScreenProps<RootStackParamList, 'Main'>;

const Main: FC<IProps> = ({navigation}) => {
  const [setselectedTab, setSetselectedTab] = useState(0);
  // const logoutUser = async () => {
  //   const userid = await AsyncStorage.removeItem('USERID');
  //   console.log('--- main userid ---->');
  // };
  return (
    <View style={styles.container}>
      {setselectedTab === 0 ? <Products /> : <Oderes />}
      <View style={styles.bottomView}>
        <TouchableOpacity
          style={[
            styles.selectedTab,
            {borderColor: setselectedTab === 0 ? THEME_COLOR : '#fff'},
          ]}
          onPress={() => setSetselectedTab(0)}>
          <Image
            source={require('../images/products.png')}
            style={styles.icons}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddProduct', {type: 'new'})}>
          <Image
            source={require('../images/plus.png')}
            style={[styles.plusIcons]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.selectedTab,
            {borderColor: setselectedTab === 1 ? THEME_COLOR : '#fff'},
          ]}
          onPress={() => setSetselectedTab(1)}>
          <Image source={require('../images/oders.png')} style={styles.icons} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    elevation: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  icons: {
    width: 30,
    height: 30,
  },
  plusIcons: {
    width: 50,
    height: 50,
  },
  selectedTab: {
    paddingBottom: 5,
    paddingHorizontal: 3,
    borderBottomWidth: 3,
  },
});
