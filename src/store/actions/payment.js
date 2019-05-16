/**
 * Created by mata on 6/2/18.
 */

import { Navigation } from "react-native-navigation";
import Icon from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';
//custom icon
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon

// export const startPayment = () => {
//     return dispatch => {

//         Promise.all([
//             Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30)
//         ]).then(sources => {
//             Navigation.startSingleScreenApp({
//                 screen: {
//                     screen: "cheria-holidays.PaymentRecord",
//                     title: "Pembelian / Pembayaran",
//                     navigatorButtons: {
//                         leftButtons: [
//                             {
//                                 icon: sources[0],
//                                 title: "Menu",
//                                 id: "sideDrawerToggle"
//                             }
//                         ]
//                     }
//                 },
//                 drawer: {
//                     left: {
//                         screen: "cheria-holidays.SideDrawer"
//                     }
//                 },
//                 appStyle: {
//                     navBarTextColor: "#490E14",
//                     navBarButtonColor: "#490E14"
//                 },
//             });
//         })

//     }
// };

// export const donePayment = () => {
//     return dispatch => {

//         Promise.all([
//             Ico.getImageSource(Platform.OS === 'android' ? "home" : "ios-cart", 30), //0
//             Ico.getImageSource(Platform.OS === 'android' ? "story" : "ios-add-circle", 24, '#FFF'), //1
//             Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30), //2
//             Ico.getImageSource(Platform.OS === 'android' ? "small-mosque" : "ios-star", 30), //3
//             Ico.getImageSource("notifications", 24, '#FFFFFF'), //4
//             Ico.getImageSource("invoice", 24, '#FFFFFF'), //5
//             Icon.getImageSource("md-notifications", 24, '#FFFFFF'), //6
//             Ico.getImageSource("user-shape", 22, '#FFFFFF'), //7rr
//         ]).then(sources => {

//             Navigation.startTabBasedApp({
//                 tabs: [
//                     {
//                         screen: "cheria-holidays.CategoryTourPackage",
//                         label: "Home",
//                         title: "Tujuan Wisata",
//                         icon: sources[0],
//                         navigatorButtons: {
//                             leftButtons: [
//                                 {
//                                     icon: require('../../assets/logoHeader/icon_header.png'),
//                                     title: "Menu",
//                                     id: "sideDrawerToggle"
//                                 }
//                             ],
//                             rightButtons: [
//                                 {
//                                     id: 'profile',
//                                     icon: sources[7],

//                                 },
//                                 {
//                                     id: 'notificationToggle',
//                                     icon: sources[6],
//                                     badgeStyle: 'red',
//                                     badgeCount: 0
//                                 },
//                             ]

//                         }
//                     },
//                     {
//                         // screen: "cheria-holidays.RequestTour",
//                         // title: "Request Tour",
//                         // label: "Request Tour",
//                         screen: "cheria-holidays.PaymentRecord",
//                         title: "Pembelian / Pembayaran",
//                         label: "Order",
//                         // icon: sources[1],
//                         icon: sources[5],
//                         navigatorStyle: {
//                             // drawUnderTabBar: false,
//                         },
//                         navigatorButtons: {
//                             leftButtons: [
//                                 {
//                                     // icon: sources[2],
//                                     icon: require('../../assets/logoHeader/permintaan.png'),
//                                     title: "Menu",
//                                     id: "sideDrawerToggle"
//                                 }
//                             ]
//                         }
//                     },
//                 ],
//                 appStyle: {
//                     forceTitlesDisplay: true,
//                     navBarTextColor: "#ffffff",
//                     navBarBackgroundColor: '#2BB04C',
//                     navBarTextFontFamily: 'EncodeSans-Medium',
//                     tabBarSelectedButtonColor: "#34A941",
//                     tabBarButtonColor: "#BBBBBB",
//                     tabFontFamily: 'EncodeSans-Regular',
//                     tabFontSize: 12,
//                     selectedTabFontSize: 12,
//                     orientation: 'portrait',
//                     initialTabIndex: 1,
//                 },
//             });
//         })

//     }
// };
