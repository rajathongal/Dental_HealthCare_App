import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {

  LinearProgress,

} from '@material-ui/core';

const SplashScreen = () => (
  <View style={styles.container}>
      {console.log("entered splash")}
    <ActivityIndicator size="large" color="#00ff00" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default SplashScreen;