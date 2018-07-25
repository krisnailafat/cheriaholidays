import React from "react";
import {View, Text, StyleSheet, TouchableHighlight, Image, ImageBackground} from "react-native";

const listItem = props => {

    let price = "Rp."
    if(props.currency === "USD"){
        price = "USD"
    }

    return (
        <View style={{paddingHorizontal:10, paddingVertical:5}}>
            <ImageBackground source={{uri: props.tourImage}} imageStyle={{resizeMode: 'stretch'}} style={styles.placeImage}>
                    <TouchableHighlight onPress={props.onItemPressed}>
                        <View style={styles.listItem}>
                            <Text style={{fontSize: 24, fontWeight:'bold', color: 'white'}}> {props.tourName.toUpperCase()}</Text>
                        </View>
                    </TouchableHighlight>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        width:"100%",
        height:150,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: 'rgba(52, 52, 52, 0.6)'
    },
    placeImage: {
        flex:1,
        borderWidth:0.5,
        marginRight: 8,
        height: 150,
        width: "100%"
    },
});

export default listItem;
