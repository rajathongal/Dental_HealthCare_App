import React from 'react';
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
} from 'react-native';
import {colors, sizes} from '../../styles/Styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useAuth from '../../hooks/useAuth';
const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const HomeScreen = ({ navigation }) => {
  // const dispatch = useAuthDispatch();
  const { logout } = useAuth();
  const handleSignOut = async () => {
    try {
      // await signOut();
      await logout();
      
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}> 
    <View style={styles.navBar}>
      <View style={styles.leftContainer}>
        <Text style={{fontSize: sizes.h2, textAlign: "center", fontWeight: "bold"}}>
        Dentocare.
        <Text style={{fontSize: sizes.h2, color: colors.primary}}>club </Text>
      </Text>
      </View>

      <View style={styles.rightContainer}>
        <Icon.Button
          name="logout"
          onPress={handleSignOut}
          size={20}
          backgroundColor="#FFFFFF"
          color="#000000"
        >
          Logout
        </Icon.Button>
      </View>

    </View>

    <ScrollView > 
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('HealthCheck')}> 
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Diagnose your oral Health</Text>
          <Image
          style={styles.tinyLogo}
          source={require('../../../assets/images/ilu_3.jpg')}
        />
        </View>
      </TouchableOpacity>
      <View style={styles.card}>
        <Image
        style={styles.tinyLogo}
        source={require('../../../assets/images/ilu_4.jpg')}
      />
      <Text style={styles.sectionTitle}> Wallet</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Previous Records</Text>
        <Image
        style={styles.tinyLogo}
        source={require('../../../assets/images/ilu_1.jpg')}
      />
      </View>
      
    </View>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor : '#FFFFFF',
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
  paddingHorizontal: 20
  //flex: 1
  
},
leftContainer: {
  justifyContent: 'center',   
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
}
});

export default HomeScreen;

// {/* <Text>Hello World!</Text>
//       <Button title="Log Out" onPress={handleSignOut} /> */}