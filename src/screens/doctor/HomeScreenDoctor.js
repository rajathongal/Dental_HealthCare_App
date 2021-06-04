import React from 'react';
import { View, Button, StyleSheet, Text, useWindowDimensions  } from 'react-native';
// import { useAuthDispatch } from '../contexts/authContext';
// import { signOut } from '../services/authService';
import useAuth from '../../hooks/useAuth';

const HomeScreenDoctor = () => {
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
    <View style={styles.container}>
      <Text>Hello World! from Doctor's Login </Text>
      <Button title="Log Out" onPress={handleSignOut} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // height: useWindowDimensions().height,
    // width: useWindowDimensions().width
  },
});

export default HomeScreenDoctor;