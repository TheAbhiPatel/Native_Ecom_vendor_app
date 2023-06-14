import {
  Image,
  PermissionsAndroid,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FC, useState} from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import {THEME_COLOR} from '../utils/theme';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import uuid from 'react-native-uuid';
import Loader from '../components/Loader';
import MyModal from '../components/MyModal';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../type';

type IProps = StackScreenProps<RootStackParamList, 'AddProduct'>;

const AddProduct: FC<IProps> = ({navigation, route}) => {
  const {data, type} = route.params;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModelOpen] = useState<boolean>(false);
  const [modalMsg, setModalMsg] = useState<string>('');
  const [productName, setProductName] = useState(
    type == 'edit' ? data._data.productName : '',
  );
  const [productDesc, setProductDesc] = useState(
    type == 'edit' ? data._data.productDesc : '',
  );
  const [productPrice, setProductPrice] = useState(
    type == 'edit' ? data._data.productPrice : '',
  );
  const [productDiscountPrice, setProductDiscountPrice] = useState(
    type == 'edit' ? data._data.productDiscountPrice : '',
  );
  const [inStock, setInStock] = useState<boolean>(
    type == 'edit' ? data._data.inStock : true,
  );
  const [imageData, setImageData] = useState({
    assets: [{uri: type == 'edit' ? data._data.image : '', fileName: ''}],
  });
  console.log('image data -----> ', imageData.assets[0].uri);

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        openGallery();
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const openGallery = async () => {
    const res = await launchImageLibrary({mediaType: 'photo'});
    if (!res.didCancel) {
      setImageData(res);
    }
  };

  const saveProduct = async () => {
    if (
      !productName ||
      !productDesc ||
      !productPrice ||
      !productDiscountPrice ||
      !imageData.assets[0].uri
    ) {
      handleModalOpen(' All field must be required!');
    } else {
      setIsLoading(true);
      const name = await AsyncStorage.getItem('NAME');
      const userId = await AsyncStorage.getItem('USERID');
      const productId = uuid.v4();

      /** uploading image */
      let imageUrl;
      if (imageData.assets[0].fileName !== '') {
        const reference = storage().ref(imageData.assets[0].fileName);
        const pathToFile = imageData.assets[0].uri;
        await reference.putFile(pathToFile);
        imageUrl = await storage()
          .ref(imageData.assets[0].fileName)
          .getDownloadURL();
      }

      /** creting firebase  product data and updating */
      if (type === 'edit') {
        firestore()
          .collection('products')
          .doc(data._data.productId)
          .update({
            productName,
            productPrice,
            productDiscountPrice,
            productDesc,
            inStock,
            image:
              imageData.assets[0].fileName == '' ? data._data.image : imageUrl,
          })
          .then(res => {
            setIsLoading(false);
            navigation.goBack();
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error);
          });
      } else {
        firestore()
          .collection('products')
          .doc(productId)
          .set({
            productId,
            addedBy: name,
            userId,
            productName,
            productPrice,
            productDiscountPrice,
            productDesc,
            inStock,
            image: imageUrl,
          })
          .then(res => {
            setIsLoading(false);
            navigation.goBack();
          })
          .catch(error => {
            setIsLoading(false);
            console.log(error);
          });
      }
    }
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
      <View style={styles.bannerView}>
        {imageData.assets[0].uri === '' ? (
          <TouchableOpacity onPress={requestCameraPermission}>
            <Image
              source={require('../images/camera.png')}
              style={styles.camera}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.banner}
            onPress={requestCameraPermission}>
            <Image
              source={{
                uri: imageData.assets[0].uri,
              }}
              style={styles.banner}
            />
          </TouchableOpacity>
        )}
      </View>
      <Input
        placeholder="Product Name"
        value={productName}
        onChangeText={txt => {
          setProductName(txt);
        }}
      />

      <Input
        placeholder="Description"
        value={productDesc}
        onChangeText={txt => {
          setProductDesc(txt);
        }}
      />
      <Input
        placeholder="Price"
        value={productPrice}
        keyboardType="number-pad"
        onChangeText={txt => {
          setProductPrice(txt);
        }}
      />
      <Input
        placeholder="Discount Price"
        value={productDiscountPrice}
        keyboardType="number-pad"
        onChangeText={txt => {
          setProductDiscountPrice(txt);
        }}
      />
      <View style={styles.stock}>
        <Text>In Stock</Text>
        <Switch value={inStock} onChange={() => setInStock(prev => !prev)} />
      </View>
      <Button
        title={type === 'edit' ? 'Update' : 'Add Product'}
        onPress={() => {
          saveProduct();
        }}
      />
    </View>
  );
};

export default AddProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerView: {
    width: '90%',
    height: 180,
    alignSelf: 'center',
    borderWidth: 0.5,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stock: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
  },
  camera: {
    width: 50,
    height: 50,
  },
  banner: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
});
