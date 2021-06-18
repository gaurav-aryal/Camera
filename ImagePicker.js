import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import cameraImage from '../../../../assets/icons/camera.png';
import galleryImage from '../../../../assets/icons//gallery.png';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import * as ImagePicker from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';
const ImagePicker = () => {
  const [responseCamera, setResponseCamera] = React.useState(null);
  const [responseGallery, setResponseGallery] = React.useState(null);

  const openCameraWithPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'App Camera Permission',
          message: 'App needs access to your camera ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        ImagePicker.launchCamera(
          {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 200,
            maxWidth: 200,
          },
          (response) => {
            console.log(response);
            setResponseCamera(response);
            setResponseGallery(null);
          },
        );
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 4,
      }}>
      <TouchableOpacity onPress={() => openCameraWithPermission()}>
        {responseCamera === null ? (
          <Image style={styles.icon} source={cameraImage} />
        ) : (
          <Image style={styles.icon} source={{uri: responseCamera.uri}} />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          ImagePicker.launchImageLibrary(
            {
              mediaType: 'photo',
              includeBase64: false,
              maxHeight: 200,
              maxWidth: 200,
            },
            (response) => {
              setResponseGallery(response);
              setResponseCamera(null);
            },
          )
        }>
        {responseGallery === null ? (
          <Image style={styles.icon} source={galleryImage} />
        ) : (
          <Image style={styles.icon} source={{uri: responseGallery.uri}} />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 50,
    width: 50,
  },
});

export default ImagePicker;