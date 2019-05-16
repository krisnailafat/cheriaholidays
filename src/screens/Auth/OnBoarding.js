/**
 * Created by mata on 9/11/18.
 */

import React, { Component } from "react";
import {
    ImageBackground,
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    AsyncStorage,
    TouchableHighlight,
    Button,
    Alert,
    Platform,
} from "react-native";
import { connect } from "react-redux";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import { Navigation } from "react-native-navigation";
import startMainTabs from "../../screens/MainTabs/startMainTabs";
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../../components/UI/TextCustom/TextCustom"
//custom icon
import Icon from 'react-native-vector-icons/Ionicons';
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
import { startMainMenu } from "../../store/actions";
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon
// import firebase from 'react-native-firebase';
// import type { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';

class OnBoarding extends Component {
    static navigatorStyle = {
        // navBarTextColor:'white',
        // navBarBackgroundColor:'#ce0b24',
        // navBarButtonColor:'white'
        navBarHidden: true,
        statusBarColor: '#fff',
        drawUnderStatusBar: true
    };

    state = {

    }

    componentWillMount() {
        AsyncStorage.getItem("ap:intro").then((value) => {

            if (value != null) {

                AsyncStorage.getItem("ap:onBoard").then((value) => {

                    if (value !== null) {
                        // startMainTabs();'
                        this.props.goToMainMenu()
                        // Promise.all([
                        //     Ico.getImageSource(Platform.OS === 'android' ? "home" : "ios-cart", 30), //0
                        //     Ico.getImageSource(Platform.OS === 'android' ? "story" : "ios-add-circle", 24, '#FFF'), //1
                        //     Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30), //2
                        //     Ico.getImageSource(Platform.OS === 'android' ? "small-mosque" : "ios-star", 30), //3
                        //     Ico.getImageSource("notifications", 24, '#FFFFFF'), //4
                        //     Ico.getImageSource("invoice", 24, '#FFFFFF'), //5
                        //     Icon.getImageSource("md-notifications", 24, '#FFFFFF'), //6
                        //     Ico.getImageSource("user-shape", 22, '#FFFFFF'), //7rr
                        // ]).then(sources => {

                        //     Navigation.startTabBasedApp({
                        //         tabs: [
                        //             {
                        //                 screen: "cheria-holidays.CategoryTourPackage",
                        //                 label: "Home",
                        //                 title: "Tujuan Wisata",
                        //                 icon: sources[0],
                        //                 navigatorButtons: {
                        //                     leftButtons: [
                        //                         {
                        //                             icon: require('../../assets/logoHeader/icon_header.png'),
                        //                             title: "Menu",
                        //                             id: "sideDrawerToggle"
                        //                         }
                        //                     ],
                        //                     rightButtons: [
                        //                         {
                        //                             id: 'profile',
                        //                             icon: sources[7],

                        //                         },
                        //                         {
                        //                             id: 'notificationToggle',
                        //                             icon: sources[6],
                        //                             badgeStyle: 'red',
                        //                             badgeCount: 0
                        //                         },
                        //                     ]

                        //                 }
                        //             },
                        //             {
                        //                 // screen: "cheria-holidays.RequestTour",
                        //                 // title: "Request Tour",
                        //                 // label: "Request Tour",
                        //                 screen: "cheria-holidays.PaymentRecord",
                        //                 title: "Pembelian / Pembayaran",
                        //                 label: "Order",
                        //                 // icon: sources[1],
                        //                 icon: sources[5],
                        //                 navigatorStyle: {
                        //                     // drawUnderTabBar: false,
                        //                 },
                        //                 navigatorButtons: {
                        //                     leftButtons: [
                        //                         {
                        //                             // icon: sources[2],
                        //                             icon: require('../../assets/logoHeader/permintaan.png'),
                        //                             title: "Menu",
                        //                             id: "sideDrawerToggle"
                        //                         }
                        //                     ]
                        //                 }
                        //             },
                        //         ],
                        //         appStyle: {
                        //             forceTitlesDisplay: true,
                        //             navBarTextColor: "#ffffff",
                        //             navBarBackgroundColor: '#2BB04C',
                        //             navBarTextFontFamily: 'EncodeSans-Medium',
                        //             tabBarSelectedButtonColor: "#34A941",
                        //             tabBarButtonColor: "#BBBBBB",
                        //             tabFontFamily: 'EncodeSans-Regular',
                        //             tabFontSize: 12,
                        //             selectedTabFontSize: 12,
                        //             orientation: 'portrait'
                        //         },
                        //     });

                        //     // this.props.navigator.push({
                        //     //     screen: "cheria-holidays.CategoryTourPackage",
                        //     //     title: "Halal Traveler",
                        //     //     navigatorButtons: {
                        //     //         leftButtons: [
                        //     //             {
                        //     //                 // icon: sources[2],
                        //     //                 icon: require('../../assets/logoHeader/icon_header.png'),
                        //     //                 title: "Menu",
                        //     //                 id: "sideDrawerToggle"
                        //     //             }
                        //     //         ],
                        //     //         rightButtons: [
                        //     //             // {
                        //     //             //     id: 'request',
                        //     //             //     icon: sources[0],

                        //     //             // },
                        //     //             {
                        //     //                 id: 'profile',
                        //     //                 icon: sources[2],

                        //     //             },
                        //     //             {
                        //     //                 id: 'notificationToggle',
                        //     //                 icon: sources[1],
                        //     //                 badgeStyle: 'red',
                        //     //                 badgeCount: 0
                        //     //             },
                        //     //         ]

                        //     //     },
                        //     //     navigatorStyle: {
                        //     //         navBarTextColor: "#ffffff",
                        //     //         navBarBackgroundColor: '#2BB04C',
                        //     //         navBarTextFontFamily: 'EncodeSans-Medium',
                        //     //     }
                        //     // })
                        // })
                    }
                })

                // AsyncStorage.getItem("ap:auth:email").then((value1) => {
                //     this.setState({ login_email: value1 });
                //     if (value1 != null) {
                //         AsyncStorage.getItem("ap:auth:password").then((value2) => {
                //             this.setState({ login_password: value2 });
                //             console.log('login value passwd', value2)
                //             if (value2 != null) {
                //                 url = 'https://travelfair.co/auth/token/login/';
                //                 // console.log('data', authData)
                //                 fetch(url, {
                //                     method: "POST",
                //                     body: JSON.stringify({
                //                         email: value1,
                //                         password: value2,
                //                     }),
                //                     headers: {
                //                         "Content-Type": "application/json"
                //                     }
                //                 }).then(res => res.json())
                //                     .then(parsedRes => {
                //                         console.log('login result:', parsedRes);

                //                         if (parsedRes.auth_token != undefined) {
                //                             AsyncStorage.setItem("ap:auth:token", parsedRes.auth_token)
                //                             startMainTabs();
                //                         } else {
                //                             Alert.alert("Username & Password yang Anda masukan salah")
                //                         }


                //                     });
                //                 // startMainTabs();
                //             }
                //         })
                //     }
                // }).catch(err => console.log(err));
            }
            else {
                this.props.navigator.showModal({
                    screen: "cheria-holidays.Intro", // unique ID registered with Navigation.registerScreen
                    // title: "Modal", // title of the screen as appears in the nav bar (optional)
                    passProps: {},
                    navigatorStyle: {
                        statusBarColor: '#fff',
                        drawUnderStatusBar: true
                    },
                    animationType: 'fade',
                    overrideBackPress: true
                });
            }
        })

    }

    onButtonKlik = (key) => {
        // this.props.navigator.push({
        //     screen: 'cheria-holidays.AuthScreen', // unique ID registered with Navigation.registerScreen
        //     title: 'Log In', // navigation bar title of the pushed screen (optional)
        //     navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
        //     passProps: { valueAuth: key },
        //     orientation: 'portrait'
        // });

        AsyncStorage.setItem("ap:onBoard", "installed").then(res => {
            // startMainTabs();
            this.props.goToMainMenu()
        })
    }

    render() {
        return (
            <View style={styles.mainContent}>
                {/* Bagian atas */}
                <View style={{ flex: 1, alignItems: 'center', marginTop: 46 }}>
                    <View style={{ width: 155, height: 155, alignItems: 'center', justifyContent: 'center', marginBottom: 29 }}>
                        <Image style={{ width: '100%', height: '100%' }} source={require('../../assets/logoonboarding.png')} />
                    </View>
                    <TextSemiBold style={{ color: '#757575', fontSize: 18, marginBottom: 29 }}>Selamat Datang</TextSemiBold>
                    <TextNormal style={{ color: '#757575', fontSize: 16, }}>silahkan masuk untuk menggunakan</TextNormal>
                    <TextNormal style={{ color: '#757575', fontSize: 16, }}>aplikasi halal traveler</TextNormal>
                </View>
                {/* bagian bawah */}
                <View style={{ flex: 0.3, alignItems: 'center' }}>
                    <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 18, marginBottom: 16 }}>
                        <TouchableOpacity onPress={() => this.onButtonKlik("login")}>
                            <View style={{ height: 40, width: '100%', backgroundColor: '#FF9D00', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                {/* <TextMedium style={{ color: '#ffffff', fontSize: 16 }}>Log In</TextMedium> */}
                                <TextMedium style={{ color: '#ffffff', fontSize: 16 }}>Mulai</TextMedium>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {/* <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 18 }}>
                        <TouchableOpacity onPress={() => this.onButtonKlik("signup")}>
                            <View style={{ height: 40, width: '100%', backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderWidth: 1, borderColor: '#757575' }}>
                                <TextMedium style={{ color: '#757575', fontSize: 16 }}>Create Account</TextMedium>
                            </View>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },

})

const mapDispatchToProps = dispatch => {
    return {
        onMulai: () => dispatch(startMainTabs()),
        //   onAutoSignIn: () => dispatch(authAutoSignIn())
        goToMainMenu: () => dispatch(startMainMenu())
    };
};

export default connect(null, mapDispatchToProps)(OnBoarding);