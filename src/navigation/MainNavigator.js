import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/patient/HomeScreen';
import PatientHealthCheck from '../screens/patient/PatientHealthCheck';
import ResultsView from '../screens/patient/resultsView';

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator initialRouteName="Home" headerMode="none">
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="HealthCheck" component={PatientHealthCheck} />
    <Stack.Screen name="ResultsView" component={ResultsView} />
  </Stack.Navigator>
);

export default MainNavigator;