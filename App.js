import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image, SafeAreaView, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { ScreenOrientation } from 'expo';
import * as ImagePicker from 'expo-image-picker';

import * as Cam from 'react-native-vision-camera';

export default function App({ navigation }) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  
  const devices = Cam.useCameraDevices('wide-angle-camera');
  const device = devices.back

  // const formats = useMemo(() => device?.formats.sort(sortFormatsByResolution), [device?.formats])

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestCameraRollPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');

      const devices = await Cam.getAvailableCameraDevices()
      console.log(device.devices)

      const deviceType = parsePhysicalDeviceTypes(device.devices)
      console.log(deviceType)

    })();
  }, []);

  async function componentDidMount() {
    await ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE);
    this.setState({ dataChart: this.getData() });
  }
  async function switchToLandscape() {
    await ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE);
  }

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT);
  }

  const MyScreen = () => {
    const orientation = useOrientation();
  
    return (
        <View style={{color: orientation === 'PORTRAIT' ? 'red' : 'blue'}} />
    );
  }

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      setImage(data.uri);
    }
  }

  const getScreen = () => {
    return Dimensions.get('screen');
  }

  const sortFormatsByResolution = async() => {
    // in this case, points aren't "normalized" (e.g. higher resolution = 1 point, lower resolution = -1 points)
    let leftPoints = left.photoHeight * left.photoWidth;
    let rightPoints = right.photoHeight * right.photoWidth;
  
    if (left.videoHeight != null && left.videoWidth != null && right.videoHeight != null && right.videoWidth != null) {
      leftPoints += left.videoWidth * left.videoHeight;
      rightPoints += right.videoWidth * right.videoHeight;
    }
  
    // you can also add points for FPS, etc
  
    return rightPoints - leftPoints;
  };
  

  const slowFrameRate = async () => {
    // and then call it:
  const formats = useMemo(() => device?.formats.sort(sortFormatsByResolution), [device?.formats])
  }

  const getMaxFps = async() =>{
    return format.frameRateRanges.reduce((prev, curr) => {
      if (curr.maxFrameRate > prev) return curr.maxFrameRate;
      else return prev;
    }, 0)
  };

  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1,1]
    });
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };


  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    switchToLandscape(),
    // ScreenOrientation.allowAsync(ScreenOrientation.Orientation.LANDSCAPE),
    <View style={{flex:1, MyScreen}}>
      <SafeAreaView style={styles.cameraContainer}>
          
          <View style={{flex:1, MyScreen}}>
          <Camera style={styles.cameraContainer}
          ref={ref => setCamera(ref)}
          style={styles.absoluteFill}
          device={devices}
          type={type}
          fixOrientation={true}
          forceOrientation={true}
          fps={120}
          ratio={'1:1'} />

          <Camera style={styles.cameraContainer}
          ref={ref => setCamera(ref)}
          style={styles.absoluteFill}
          device={devices}
          type={type}
          fixOrientation={true}
          forceOrientation={true}
          fps={120}
          ratio={'1:1'} />
          </View>

      </SafeAreaView>

      <Button title="Slow FPS" onPress={() => slowFrameRate()} />
      <Button
        title="Reverse Camera"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
          );
        }}></Button>

      <Button title="Take Picture" onPress={() => takePicture()} />
      <Button title="Pick Image From Gallery" onPress={() => pickImage()} />
      <Button title="Save" onPress={() => navigation.navigate('Save', { image })} />
      {image && <Image source={{ uri: image }} style={{ flex: 1 }} />}
    </View>
  );
}

const styles = StyleSheet.create({

  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'black',
    
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1
  },
  absoluteFill: {
    flex: 1,
  },
  splitScreen: {
    display: 'flex',
    flexDirection: 'row',
  },
})