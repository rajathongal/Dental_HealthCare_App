import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import useAuth from '../hooks/useAuth';
// import { useAuthState, useAuthDispatch } from '../contexts/authContext';
// import { checkAuth } from '../services/authService';
import SplashScreen from '../screens/general/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import DoctorNavigator from './DoctorNavigator'
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();

function AppNavigator() {
  // const { isLoading, isSignout, userToken } = useAuthState(); // Get initial states
  // const dispatch = useAuthDispatch();
  const { isAuthenticated, user } = useAuth();

    const _retrieveData = async (key) => {
    try {
      const data = await AsyncStorage.getItem(key);
      return data;
    } catch (error) {
      console.log(error);
    }
  }
  var token = _retrieveData('accessToken');//await AsyncStorage.getItem('accessToken');
 
  // useEffect(() => {
  //   const checkAuthStatus = async () => {
  //     let token = null;
  //     try {
  //       const user = await checkAuth();
  //       const { jwtToken } = user;
  //       token = jwtToken;
  //     } catch (e) {
  //       console.log('error', e);
  //     }
  //     dispatch({ type: 'RESTORE_TOKEN', token });
  //   };

  //   checkAuthStatus();
  // }, [dispatch]);
  // if(token === null || typeof(token) === 'object'){
  //   var role = jwt.decode(token, 'MySuperSecretPassword', 'HS256').then(res => {return res.payload.isDoctor});
  // }
  // //var role = jwt.decode(token, 'MySuperSecretPassword', 'HS256').then(res => {return res.payload.isDoctor});
  

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator headerMode="none"> 
          {!isAuthenticated && (token === null || typeof(token) === 'object') ? (
            // No token found, user isn't signed in
            <Stack.Screen
              isSignout={isAuthenticated}
              name="Auth"
              component={AuthNavigator}
            />
          ) : (
            // User is signed in
            //<Stack.Screen name="Main" component={MainNavigator} />
            user.isDoctor ? (
              <Stack.Screen name="doctor" component={DoctorNavigator} />
            ) : (
              <Stack.Screen name="user" component={MainNavigator} />
            )
          )}
        

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default AppNavigator;