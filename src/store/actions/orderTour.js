// /**
//  * Created by mata on 6/7/18.
//  */

// import { START_REQUEST_TOUR } from './actionTypes';
// import { Navigation } from "react-native-navigation";
// import Icon from 'react-native-vector-icons/Ionicons';
// import { Platform } from 'react-native';

// export const startOrderTour = (order, reserve_number) => {
//     console.log('start order tour', order, reserve_number)
//     return dispatch => {

//         Promise.all([
//             Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30)
//         ]).then(sources => {
//             Navigation.startSingleScreenApp({
//                 screen: {
//                     screen: "cheria-holidays.TourOrder",
//                     title: "Pemesanan Tour Cheria",
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
//                     navBarTextColor:"#490E14",
//                     navBarButtonColor:"#490E14"
//                 },
//                 passProps:{
//                     order:order,
//                     reserve_number: reserve_number
//                 }
//             });
//         })

//     }
// };

