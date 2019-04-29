import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../UI/TextCustom/TextCustom"
import ProgressiveImage from "../../components/UI/ProgressiveImage/ProgressiveImage"

const listItem = props => {

    let price = "Rp."
    if (props.currency === "USD") {
        price = "USD"
    }

    return (

        <View style={{ paddingHorizontal: 5, paddingVertical: 5, }}>
            <TouchableOpacity onPress={props.onItemPressed}>
                <View style={{ width: '100%', alignItems: 'center', borderRadius: 10 }}>
                    {/* gambar */}
                    <View style={{ width: '100%', height: 153, borderTopLeftRadius: 10, borderTopRightRadius: 10 }} >
                        <ProgressiveImage resizeMode="cover" thumbnailSource={{ uri: props.tourImage }} source={{ uri: props.tourImage }} style={{ width: '100%', height: "100%", borderTopLeftRadius: 10, borderTopRightRadius: 10, }} imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10, }} />
                    </View>
                    {/* panel bawah */}
                    <View style={{ width: '100%', alignItems: 'center', backgroundColor: '#ffffff', padding: 12, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, paddingBottom: 5, marginBottom: 5, borderColor: '#979797' }}>
                            <TextNormal style={{ color: '#2BB04C', fontSize: 20, width: '75%' }}>{props.tourName}</TextNormal>
                            <TextNormal style={{ color: '#2BB04C', fontSize: 12, width: '25%' }}>Bonus Point {props.point}</TextNormal>

                        </View>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: '50%', paddingLeft: 5 }}>
                                {/* hari  malam*/}
                                <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: 17, height: 17, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: '#FEBB12' }}>
                                            <TextNormal style={{ color: '#404040', fontSize: 12 }}>{props.day}</TextNormal>
                                        </View>
                                        <TextMedium style={{ color: '#2BB04C', fontSize: 13, marginHorizontal: 10 }}>Days</TextMedium>
                                    </View>
                                    <View style={{ flexDirection: 'row' }}>
                                        <View style={{ width: 17, height: 17, alignItems: 'center', justifyContent: 'center', borderRadius: 17, backgroundColor: '#FEBB12' }}>
                                            <TextNormal style={{ color: '#404040', fontSize: 12 }}>{props.night}</TextNormal>
                                        </View>
                                        <TextMedium style={{ color: '#4F7BBE', fontSize: 13, marginHorizontal: 10 }}>Night</TextMedium>
                                    </View>
                                </View>
                                {/* hari  malam*/}
                                {/* harga */}
                                <TextMedium style={{ color: '#404040', fontSize: 16 }}>{price} {props.price_adult !==null ? props.price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : 'Not Available' }</TextMedium>
                            </View>
                            <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', paddingLeft: 30 }}>
                                <View style={{ alignItems: 'center', justifyContent: 'center', height: 36, width: 96, backgroundColor: '#FF9D00', borderRadius: 5 }}>
                                    <TextMedium style={{ color: '#ffffff', fontSize: 14 }}>Details</TextMedium>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View >

        // <View style={{ paddingHorizontal: 5, paddingVertical: 5 }}>

        //     <TouchableOpacity onPress={props.onItemPressed}>
        //         <View style={styles.listItem}>
        //             <Image resizeMode="cover" source={{ uri: props.tourImage }} style={styles.placeImage} />
        //             <View style={{
        //                 flexDirection: 'row',
        //                 alignItems: 'center',
        //                 paddingHorizontal: 5,
        //                 paddingVertical: 10,
        //                 backgroundColor: "#490E14"
        //             }}>
        //                 <Text style={{ fontSize: 14, color: 'white', flexWrap: 'wrap', flex: 1 }}><Text
        //                     style={{ fontWeight: 'bold' }}>{props.day}D {props.night}N </Text> {props.tourName}</Text>
        //             </View>
        //             <View style={{ paddingHorizontal: 5 }}>
        //                 <Text style={{ paddingHorizontal: 10, paddingBottom: 5, paddingTop: 10, fontWeight: 'bold' }}>Bonus Point {props.point}</Text>
        //                 <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        //                     <Text style={{
        //                         paddingLeft: 5,
        //                         fontSize: 20
        //                     }}> {price} {props.price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
        //                     <Text style={{
        //                         fontWeight: 'bold',
        //                         paddingVertical: 5,
        //                         paddingHorizontal: 10,
        //                         backgroundColor: '#490E14',
        //                         color: 'white'
        //                     }}>LIHAT DETAIL</Text>
        //                 </View>
        //             </View>
        //         </View>
        //     </TouchableOpacity>
        // </View>
    )
}

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        marginBottom: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: "#e5e5e5",
        flexDirection: "column",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#64081e',
        shadowColor: '#64081e',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 3,
    },
    placeImage: {
        marginRight: 8,
        height: 150,
        width: "100%"
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
    }
});

export default listItem;
