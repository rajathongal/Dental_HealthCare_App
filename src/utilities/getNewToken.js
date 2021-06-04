// import client from './Client';
// import gql from 'graphql-tag';
// import AsyncStorage from '@react-native-async-storage/async-storage';


// const getToken = async() => {
//     const GET_TOKEN = gql`
//     mutation($token: String!){
//         Refresh(token: $token){
//           accessToken
//         }
//       }`;
      
//     const rfsrt = await AsyncStorage.getItem('rfsrt');
//     console.log(rfsrt, "from rfsrt")
//     return await client.mutate({
//         mutation: GET_TOKEN,
//         variables: {
//             token: rfsrt
//         }
//     }).then(res => {return res.data.Refresh.accessToken})
// };

// export default getToken;