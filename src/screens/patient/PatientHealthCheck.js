import React, { PureComponent, useState, useEffect, useRef } from 'react';
import { 
  View, 
  Button, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  Dimensions, 
  Image, 
  ScrollView, 
  PermissionsAndroid,
  Platform
} from 'react-native';
import {colors, sizes, FormStyles} from '../../styles/Styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
global.Buffer = global.Buffer || require('buffer').Buffer
const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;
import {
  launchCamera,
  launchImageLibrary
} from 'react-native-image-picker';
import axios from 'axios';


const PatientHealthCheck = ({ navigation }) => {
  const [filePath, setFilePath] = useState({});

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          },
        );
        console.log(await PermissionsAndroid.check('CAMERA'))
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK"
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  const captureImage = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
      includeBase64: true
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
     

        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        
        setFilePath(response.assets[0]);
      });
    }
  };

  const chooseFile = (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      includeBase64: true
    };
    launchImageLibrary(options, (response) => {
    

      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      
      setFilePath(response.assets[0]);
    });
  };

  const CheckImage = async () => {
   
    let formData = new FormData();
    formData.append('file', filePath.base64);
    formData.append('fileName', filePath.fileName);
    formData.append('type', filePath.type);

    
   
    const optionsImage = {
      headers: { 
        
        "Content-Type": "multipart/form-data"
      },

      withCredentials: true,
      timeout: 1300000,
      responseType: "arraybuffer",
      
      //responseType: 'blob'
    };
    
    try {
      const response = await axios.post('http://34.117.29.78/yolo', formData, optionsImage);

      if(!(response === undefined)) {
        var base64Flag = `data:${Object.values(response.headers)[4]};base64,`;
        var ImgData = Buffer.from(response.data, 'binary').toString('base64')
        navigation.navigate('ResultsView', {
          Img: base64Flag + ImgData
        })
      }
      
      // var base64Flag = `data:${Object.values(response.headers)[4]};base64,`;
      // var ImgData = Buffer.from(response.data, 'binary').toString('base64')
      // setImage(base64Flag + ImgData)
      console.log(Img)
    } catch(err) {
      console.log(err, "from err")
    }
  };

  return (
  <SafeAreaView style={{flex:1}}>
    <View style={styles.navBar}>
        <View>
            <Icon.Button
            name="west"
            size={20}
            backgroundColor="#FFFFFF"
            color="#000000"
            onPress={() => navigation.goBack()}
            >
                Back
            </Icon.Button>
        </View>
      <View style={styles.rightContainer}>
        <Text style={{fontSize: sizes.h2, textAlign: "center", fontWeight: "bold"}}>
        Dentocare.
        <Text style={{fontSize: sizes.h2, color: colors.primary}}>club </Text>
      </Text>
      </View>
    </View>
    
    <View style={styles.container}>
      <Image
        source={{uri: filePath.uri}}
        style={styles.imageStyle}
      />
      
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle}
          onPress={() => captureImage('photo')}
        >
            <Text style={styles.textStyle}>
              Click Image 
            </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle2}
          onPress={() => chooseFile('photo')}
        >
          <Text style={styles.textStyle}>Choose Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonStyle3}
          onPress={() => CheckImage()}
        >
          <Text style={styles.textStyle}>Submit for Checkup</Text>
        </TouchableOpacity>
        {/* <Image
        source={{uri: Img}}
        style={styles.imageStyle}
      /> */}
    </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : '#FFFFFF',
    flexDirection: "column"
    // height: useWindowDimensions().height,
    // width: useWindowDimensions().width
  },
  card: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
    elevation: 8,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    height: fullHeight / 5,
    width: fullWidth / 1.1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between', //Centered vertically
    alignItems: 'center', // Centered horizontally,
    // flex:1,
    flexDirection: 'row',
    marginHorizontal: 20,
    marginVertical: 20
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.primary,
    width: fullWidth / 3.5,
    //height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  tinyLogo: {
    width: fullWidth / 1.9,
    height: fullHeight / 5,
  },
  item: {
    backgroundColor : '#FFFFFF',//colors.primary,
    width: fullWidth,
  },
  navBar: {
      height: fullWidth / 6,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomWidth: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 4,
      elevation: 1,
      width: fullWidth,
      paddingHorizontal: 20,
      backgroundColor : '#FFFFFF'
    //flex: 1
    
    },
    leftContainer: {
      justifyContent: 'flex-start',   
      flexDirection: 'row'
    },
    middleContainer: {
        flex: 2,
        backgroundColor: 'white',
        flexDirection: 'row',
        fontSize:18,
        marginLeft: 10,
        marginRight:10
    },
    rightContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    rightIcon: {
      paddingHorizontal:20,
      resizeMode: 'contain',
      backgroundColor: 'white',
    },
    preview: {
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
    buttonStyle: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      padding: 5,
      marginVertical: 10,
      width: fullWidth,
      borderRadius: 30,
      marginLeft: 50,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowOpacity: 0.26,
      elevation: 8,
    },
    buttonStyle2: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      padding: 5,
      marginVertical: 10,
      width: fullWidth,
      borderRadius: 30,
      marginLeft: 100,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowOpacity: 0.26,
      elevation: 8,
    },
    buttonStyle3: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      padding: 5,
      marginVertical: 10,
      width: fullWidth,
      borderRadius: 30,
      marginLeft: 150,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 6,
      shadowOpacity: 0.26,
      elevation: 8,
    },
    imageStyle: {
      width: 200,
      height: 200,
      margin: 20,
      backgroundColor: '#DDDDDD',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    textStyle: {
      padding: 10,
      textAlign: 'center',
      fontSize: sizes.font,
      fontWeight: "500",
      color: colors.white
    },
});

export default PatientHealthCheck;

// {/* <Text>Hello World!</Text>
//       <Button title="Log Out" onPress={handleSignOut} /> */}