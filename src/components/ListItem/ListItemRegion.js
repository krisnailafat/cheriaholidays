import React from "react";
import { View, Text, StyleSheet, TouchableHighlight, Image, ImageBackground, TouchableOpacity } from "react-native";
import { TextNormal, TextBold, TextMedium, TextSemiBold, TextSedgwick } from "../UI/TextCustom/TextCustom"

const listItemRegion = props => {

    let price = "Rp."
    if (props.currency === "USD") {
        price = "USD"
    }

    return (
        <View style={{ paddingHorizontal: 0, paddingVertical: 0, marginHorizontal: 5 }}>
            <TouchableOpacity onPress={props.onItemPressed} activeOpacity={0.8}>
                <View style={{ height: 100, width: 100, alignItems: 'center', justifyContent: 'space-between', borderWidth: 0 }}>
                    <View style={[{ height: 100, width: 100, alignItems: 'center', justifyContent: 'center', borderRadius: 0 },]}>
                        <ImageBackground source={{ uri: props.tourImage }} imageStyle={{ resizeMode: 'cover', borderRadius: 0 }} style={styles.placeImage} >
                            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(64,64,64,0.5)' }}>
                                <TextSedgwick style={{ color: '#fff', fontSize: 18, marginTop: -20, textAlign: 'center' }}>{props.tourName}</TextSedgwick>
                                {/* <Text>center</Text> */}
                            </View>
                        </ImageBackground>
                    </View>
                    {/* <View style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-start', height: 29 }}>
                        <TextNormal style={{ color: '#757575', fontSize: 12, textAlign: 'center' }}>{props.tourName}</TextNormal>
                    </View> */}
                </View>
            </TouchableOpacity>
        </View >

        // <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
        //     <TouchableOpacity onPress={props.onItemPressed} activeOpacity={0.8}>
        //         <View style={{ height: 156, alignItems: 'center' }}>
        //             <ImageBackground source={{ uri: props.tourImage }} imageStyle={{ resizeMode: 'stretch', borderTopLeftRadius: 5, borderTopRightRadius: 5 }} style={[styles.placeImage, styles.shadow]} >
        //                 <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'flex-end', }}>
        //                     {/* panel bawah  */}
        //                     {/* panel bawah  */}
        //                 </View>
        //             </ImageBackground>
        //             <View style={{ height: 40, width: '100%', backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'space-around', flexDirection: 'row', paddingVertical: 9, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }}>
        //                 <View style={{ alignItems: 'center', justifyContent: 'center', width: '40%', height: '100%', borderRightWidth: 1, borderColor: '#FDCB7B' }}>
        //                     <TextMedium style={{ color: '#FF9D00', fontSize: 18 }}>{props.tourName}</TextMedium>
        //                 </View>
        //                 <View style={{ justifyContent: 'center', borderWidth: 0, width: '55%', height: '100%' }}>
        //                     <TextMedium style={{ color: '#757575', fontSize: 16 }}>Pariwisata {props.tourName}</TextMedium>
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
        height: 116,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.6)',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,

    },
    placeImage: {
        height: '100%',
        width: '100%',
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

export default listItemRegion;
