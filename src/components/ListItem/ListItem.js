import React from "react";
import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native";

const listItem = props => {

    let price = "Rp."
    if(props.currency === "USD"){
        price = "USD"
    }

    return (
        <View style={{paddingHorizontal: 5, paddingVertical: 5}}>

            <TouchableOpacity onPress={props.onItemPressed}>
                <View style={styles.listItem}>
                    <Image resizeMode="cover" source={{uri: props.tourImage}} style={styles.placeImage}/>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 5,
                        paddingVertical: 10,
                        backgroundColor: "#490E14"
                    }}>
                        <Text style={{fontSize: 14, color: 'white', flexWrap: 'wrap', flex: 1}}><Text
                            style={{fontWeight: 'bold'}}>{props.day}D {props.night}N </Text> {props.tourName}</Text>
                    </View>
                    <View style={{paddingHorizontal: 5}}>
                        <Text style={{paddingHorizontal: 10, paddingBottom: 5, paddingTop: 10}}>Harga:</Text>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Text style={{
                                paddingLeft: 5,
                                fontSize: 20
                            }}> {price} {props.price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                            <Text style={{
                                fontWeight: 'bold',
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                backgroundColor: '#490E14',
                                color: 'white'
                            }}>LIHAT DETAIL</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        marginBottom: 5,
        paddingVertical:10,
        paddingHorizontal:5,
        backgroundColor: "#e5e5e5",
        flexDirection: "column",
        borderRadius: 5,
        borderWidth:0.5,
        borderColor:'#64081e',
        shadowColor: '#64081e',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 3,
    },
    placeImage: {
        marginRight: 8,
        height: 150,
        width: "100%"
    }
});

export default listItem;
