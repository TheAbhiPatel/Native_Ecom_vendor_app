import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../type';
import {StackScreenProps} from '@react-navigation/stack';

const Products = () => {
  const [products, setProducts] = useState();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('-------> i am in useEffect');

    getProducts();
  }, [isFocused]);

  const getProducts = async () => {
    const userId = await AsyncStorage.getItem('USERID');
    firestore()
      .collection('products')
      .where('userId', '==', userId)
      .get()
      .then(snapShot => {
        if (snapShot.docs) {
          setProducts(snapShot.docs);
        }
        console.log(snapShot.docs);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const deleteProduct = (productId: string) => {
    firestore()
      .collection('products')
      .doc(productId)
      .delete()
      .then(res => {
        getProducts();
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={item => item._data.productId}
        ListFooterComponent={<View style={{marginTop: 75}} />}
        renderItem={({item}) => {
          return (
            <View style={styles.productItem}>
              <View style={{flexDirection: 'row'}}>
                <View>
                  <Image
                    source={{uri: item._data.image}}
                    style={styles.image}
                  />
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                    {item._data.productName}
                  </Text>
                  <Text>{item._data.productDesc.slice(0, 15)}</Text>
                  <Text style={{color: 'green'}}>
                    {'₹ ' + item._data.productPrice}
                  </Text>
                </View>
              </View>
              <View style={styles.iconBox}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('AddProduct', {
                      data: item,
                      type: 'edit',
                    })
                  }>
                  <Image
                    source={require('../images/edit.png')}
                    style={styles.icons}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteProduct(item._data.productId)}>
                  <Image
                    source={require('../images/trash1.png')}
                    style={styles.icons}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  productItem: {
    width: Dimensions.get('window').width - 10,
    height: 80,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 7,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 5,
  },
  image: {
    width: 80,
    height: '100%',
  },
  iconBox: {
    height: '100%',
    justifyContent: 'space-around',
  },
  icons: {
    width: 20,
    height: 20,
  },
});
