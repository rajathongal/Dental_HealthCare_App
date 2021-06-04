import React, { createContext, useEffect, useReducer } from 'react';
import gql from 'graphql-tag';
import client from '../utilities/Client';
import SplashScreen from '../screens/general/SplashScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialAuthState = {
  isAuthenticated: false,
  isInitialised: false,
  user: null,
  image: null
};

const isValidToken = accessToken => {
  if (!accessToken) {
    return false;
  }
  return true;
};

const setSession = async (accessToken, refreshToken) => {
   
  if (accessToken) {
    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('rfsrt', refreshToken);
  
  } else {
    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('rfsrt');
  }
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'INITIALISE': {
      const { isAuthenticated, user, image } = action.payload;

      return {
        ...state,
        isAuthenticated,
        isInitialised: true,
        user, image 
      };
    }
    case 'LOGIN': {
      const { user, image } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user,
        image,
        
      };
    }
    case 'LOGOUT': {
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        image: null
      };
    }
    case 'REGISTER': {
      const { user } = action.payload;

      return {
        ...state,
        isAuthenticated: true,
        user
      };
    }
    case 'ERROR': {
      const { err } = action.payload;
      return {
        ...state,
        isAuthenticated: false,
        err
      };
    }

    default: {
      return { ...state };
    }
  }
};

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = ({ children }) => {
  
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  //Login
  
  const login = async (email, password) => {
    
    try {
      const SIGN_IN = gql`
      mutation($email: String!, $password: String!){
        signInUser(email: $email, password: $password){
          _id
          name
          email
          accessToken
          rfsrt
          isDoctor
        }
      }
      `;
      
      const { data } = await client().mutate({
        mutation: SIGN_IN,
        variables: {email, password}
      }).then(res => res).catch((err) => {
        console.log(err, "from login")
        dispatch({
          type: 'ERROR',
          payload: {
            err: err.response.message
          }
        });
      })
     
      setSession(data.signInUser.accessToken, data.signInUser.rfsrt);

      dispatch({
        type: 'LOGIN',
        payload: {
          user: data.signInUser,
          image: null
        }
      });

    } catch (error) {

      

      if (error.response) {

        dispatch({
          type: 'ERROR',
          payload: {
            err: error.response.message
          }
        });

      } else {

        dispatch({
          type: 'ERROR',
          payload: {
            err: 'Network Error'
          }
        });

      }
    }
  };

  //end of login

  //LOGOUT
  const logout = () => {
    setSession(null,null);
    dispatch({ type: 'LOGOUT' });
  };
  //end of LOGOUT

  //SignUp
  const register = async (email, name, password) => {
 
    try{

      const SIGN_UP = gql`
      mutation(
        $name: String!,
        $email: String!,
        $password: String!,
        ) {
          signUpUser(name: $name, email: $email, password: $password){
            _id
            accessToken
            rfsrt
            email
            name
            isDoctor
          }
        }
      `;

      const { data } = await client().mutate({
        mutation: SIGN_UP,
        variables: {name, email, password}
      });
      
      setSession(data.signUpUser.accessToken, data.signUpUser.rfsrt);

      dispatch({
        type: 'LOGIN',
        payload: {
          user: data.signUpUser,
          image: null
        }
      });

    } catch(error) {

      if (error.response) {

        dispatch({
          type: 'ERROR',
          payload: {
            err: error.response.message
          }
        });

      } else {

        dispatch({
          type: 'ERROR',
          payload: {
            err: 'Network Error'
          }
        });

      }
    }
  };
  
  // const _retrieveData = async (key) => {
  //   try {
  //     const data = await AsyncStorage.getItem(key);
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  //end of signup process

  useEffect(() => {

    const initialise = async () => {

      try {
        
        let accessToken = await AsyncStorage.getItem('accessToken');

        if(accessToken && isValidToken(accessToken)){

          const INIT = gql`
          mutation($token: String!){
            Refresh(token: $token){
              accessToken
              isDoctor
              }
            }
          `;

          const token = await AsyncStorage.getItem('rfsrt');

          const {data} = await client().mutate({
            mutation: INIT,
            variables: {token: token}
          })

          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: true,
              user: data.Refresh, 
              image: null
            }
          });

        } else {
          dispatch({
            type: 'INITIALISE',
            payload: {
              isAuthenticated: false,
              user: null,
              image: null
            }
          });
        }

      } catch (err) {
       
        dispatch({
          type: 'INITIALISE',
          payload: {
            isAuthenticated: false,
            user: null,
            image: null
          }
        });

      }
    };

    initialise();

  }, []);

  if (!state.isInitialised) {
    return <SplashScreen />;
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );

};

export default AuthContext;