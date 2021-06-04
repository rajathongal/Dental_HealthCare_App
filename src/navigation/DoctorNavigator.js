import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreenDoctor from '../screens/doctor/HomeScreenDoctor';

const Stack = createStackNavigator();

const DoctorNavigator = () => (
  <Stack.Navigator initialRouteName="DoctorHome" headerMode="none">
    <Stack.Screen name="DoctorHome" component={HomeScreenDoctor} />
  </Stack.Navigator>
);

export default DoctorNavigator;