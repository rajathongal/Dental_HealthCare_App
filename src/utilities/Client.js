import { ApolloClient, from } from '@apollo/client';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from "apollo-link-http";
import AsyncStorage from '@react-native-async-storage/async-storage';
//import getToken from "./getNewToken";
import gql from 'graphql-tag';

const cache = new InMemoryCache();

const httpLink = (port) => {
    return new HttpLink({
        uri: `https://dentocare.club/graphql`,
        credentials: 'include',
       
    });
};

const authLink = new ApolloLink(async (operation, forward) => {
    
    const accessToken = await AsyncStorage.getItem('accessToken');
    
    await operation.setContext({
        headers: {
          
          authorization: `Bearer ${accessToken}`,

        },
      })
    
      return forward(operation)
});

const link =  ApolloLink.from([
  
    onError(({ graphQLErrors, networkError, operation, forward }) => {
      console.log(graphQLErrors, "from gql errors")
      // User access token has expired
      
      if (graphQLErrors && graphQLErrors[0].message === 'TokenExpiredError') {
        // We assume we have both tokens needed to run the async request
          // Let's refresh token through async request
          
          return new Observable(async observer => {
         
            let accessToken = '';
            const GET_TOKEN = gql`
              mutation($token: String!){
                  Refresh(token: $token){
                    accessToken
                  }
                }`;
            const rfsrt = await AsyncStorage.getItem('rfsrt');
           
            try{
              const { data } = await client().mutate({
                mutation: GET_TOKEN,
                variables: {
                    token: rfsrt
                }
              });
            } catch (err) {
              console.log(err, "from refresh")
            }
            

            accessToken = data.Refresh.accessToken;

            await AsyncStorage.setItem('accessToken', accessToken);

            await operation.setContext({
              headers: {
                  ...authHeader,
                authorization: `Bearer ${accessToken}`,
                
               
              },
            });

            try{
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer)
              };
              console.log(operation, subscriber)
              // Retry last failed request
              forward(operation).subscribe(subscriber)

            } catch( err ) {
              observer.error(err);
            }

            
            // await getToken()
            //   .then(async tokenRefreshResponse => {
                
                
            //     accessToken = tokenRefreshResponse;
                
            //     //Cookies.set('accessToken',accessToken);
            //     await AsyncStorage.setItem('accessToken', accessToken)
                
            //     const context = operation.getContext();
            //     const authHeader = context.response.headers.get("Authorization");

            //     operation.setContext({
            //       headers: {
            //           ...authHeader,
            //         authorization: `Bearer ${accessToken}`,
                    
                   
            //       },
            //     })
            //   })
            //   .then(() => {
            //     const subscriber = {
            //       next: observer.next.bind(observer),
            //       error: observer.error.bind(observer),
            //       complete: observer.complete.bind(observer)
            //     };

            //     // Retry last failed request
            //     forward(operation).subscribe(subscriber);
            //   })
            //   .catch(error => {
            //     // No refresh or client token available, we force user to login
            //     observer.error(error);
            //   });
        
          });
        
      } else {
        forward(operation)
      }
    })
  ]);
  
const client = (PORT) =>  new ApolloClient({
  link: from([authLink, link, httpLink(PORT)]),
  cache
});

// const getToken = async() => {
//   console.log("Entered gettoken")
//   const GET_TOKEN = gql`
//   mutation($token: String!){
//       Refresh(token: $token){
//         accessToken
//       }
//     }`;
//     console.log(await AsyncStorage.getItem('rfsrt'), "from rfs")
//   const rfsrt = await AsyncStorage.getItem('rfsrt');
 
//   return await client.mutate({
//       mutation: GET_TOKEN,
//       variables: {
//           token: rfsrt
//       }
//   }).then(res => {return res.data.Refresh.accessToken})
// };

export default client;