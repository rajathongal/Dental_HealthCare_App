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
const fullWidth = Dimensions.get('window').width;
const fullHeight = Dimensions.get('window').height;

const ResultsView = ({route, navigation}) => {
    const { Img } = route.params;
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
            source={{uri: Img}}
            style={styles.imageStyle}
        />
        </View>
        </SafeAreaView>
    )
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
    rightContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
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
});

export default ResultsView;