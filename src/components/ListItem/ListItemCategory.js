import React from "react";
import { View, Text, StyleSheet, TouchableHighlight, Image, ImageBackground, TouchableOpacity, Dimensions } from "react-native";
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../UI/TextCustom/TextCustom"
import ProgressiveImage from "../../components/UI/ProgressiveImage/ProgressiveImage"
const colors = [
    '#404040', '#E3E5E5', '#80B085'
]
const textColors = [
    '#fff', '#404040', '#fff'
]

const listItem = props => {

    let price = "Rp."
    if (props.currency === "USD") {
        price = "USD"
    }

    return (
        <View style={[styles.container, { backgroundColor: colors[props.tourIndex % colors.length] }]}>
            <View style={{ paddingHorizontal: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 0, width: '100%' }}>
                <View style={{ justifyContent: 'space-between', width: '50%', borderWidth: 0 }}>
                    <TextSemiBold style={{ color: textColors[props.tourIndex % textColors.length], fontSize: 18 }}>Tujuan Wisata {props.tourName}</TextSemiBold>
                    <TextNormal style={{ color: textColors[props.tourIndex % textColors.length], fontSize: 14, marginTop: 10 }}>Traveling islami wisata {props.tourName} bersama Halal Traveler</TextNormal>
                    <TouchableOpacity style={{ width: 135, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 5, borderWidth: 1, borderColor: textColors[props.tourIndex % textColors.length], marginTop: 23 }} onPress={props.onItemPressed} activeOpacity={0.8}>
                        <TextNormal style={{ color: textColors[props.tourIndex % textColors.length], fontSize: 12 }}>Lihat Semua</TextNormal>
                    </TouchableOpacity>
                </View>
                <View style={{ width: '50%' }}>
                    <ImageBackground source={{ uri: props.tourImage }} imageStyle={{ resizeMode: 'cover', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} style={[styles.placeImage]} >
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', }}>
                            {/* panel bawah  */}
                            {/* panel bawah  */}
                        </View>
                    </ImageBackground>
                    <View style={{ backgroundColor: '#fff', alignItems: 'center', paddingVertical: 9, borderBottomLeftRadius: 5, borderBottomRightRadius: 5, width: '100%' }}>
                        <TextMedium style={{ color: '#404040', fontSize: 18 }}>{props.tourName}</TextMedium>
                    </View>
                </View>
            </View>
        </View>


        // <View style={[{ paddingHorizontal: 10, paddingVertical: 5 }, styles.shadow]}>
        //     <TouchableOpacity onPress={props.onItemPressed} activeOpacity={0.8}>
        //         <View style={{ height: 156, alignItems: 'center' }}>
        //             <ImageBackground source={{ uri: props.tourImage }} imageStyle={{ resizeMode: 'cover', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} style={[styles.placeImage]} >
        //                 <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', }}>
        //                     {/* panel bawah  */}
        //                     {/* panel bawah  */}
        //                 </View>
        //             </ImageBackground>
        // <View style={{ width: '100%', backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', paddingVertical: 9, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
        //     <View style={{ alignItems: 'center', justifyContent: 'center', width: '40%', borderRightWidth: 1, borderColor: '#FDCB7B', }}>
        //         <TextMedium style={{ color: '#FF9D00', fontSize: 18 }}>{props.tourName}</TextMedium>
        //     </View>
        //     <View style={{ justifyContent: 'center', borderWidth: 0, width: '55%', }}>
        //         <TextMedium style={{ color: '#757575', fontSize: 16 }}>Pariwisata {props.tourName}</TextMedium>
        //     </View>
        // </View>
        //         </View>
        //     </TouchableOpacity>
        // </View>
    )
}

const deviceWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
    container: {
        // height: 270,
        paddingVertical: 35,
        width: deviceWidth,
        // backgroundColor: '#404040',
        marginBottom: 8,

    },
    listItem: {
        width: "100%",
        height: 116,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.6)',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,

    },
    placeImage: {
        flex: 1,
        // borderWidth: 0.5,
        // marginRight: 8,
        // height: '80%',
        // width: "100%",
        height: 160,
        width: '100%',
        // borderColor: 'red',
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
