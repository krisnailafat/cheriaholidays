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

export const startMainMenu = () => {
    return dispatch => {
        const promise = new Promise((resolve, reject) => {
            Promise.all([
                Ico.getImageSource(Platform.OS === 'android' ? "home" : "ios-cart", 30), //0
                Ico.getImageSource(Platform.OS === 'android' ? "story" : "ios-add-circle", 24, '#FFF'), //1
                Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30), //2
                Ico.getImageSource(Platform.OS === 'android' ? "small-mosque" : "ios-star", 30), //3
                Ico.getImageSource("notifications", 24, '#FFFFFF'), //4
                Ico.getImageSource("invoice", 24, '#FFFFFF'), //5
                Icon.getImageSource("md-notifications", 24, '#FFFFFF'), //6
                Ico.getImageSource("user-shape", 22, '#FFFFFF'), //7rr
            ]).then(sources => {

                Navigation.startSingleScreenApp({
                    screen:
                    {
                        screen: "cheria-holidays.MainMenu",
                        // label: "Home",
                        title: "Halal Traveler",
                        // icon: sources[0],
                        navigatorButtons: {
                            leftButtons: [
                                {
                                    icon: require('../../assets/logoHeader/icon_header.png'),
                                    title: "Menu",
                                    id: "sideDrawerToggle"
                                }
                            ],
                            rightButtons: [
                                {
                                    id: 'notificationToggle',
                                    icon: sources[6],
                                    badgeStyle: 'red',
                                    badgeCount: 0
                                },
                                {
                                    id: 'payment',
                                    icon: sources[5],

                                },
                            ]

                        }
                    },

                    appStyle: {
                        // forceTitlesDisplay: true,
                        navBarTextColor: "#ffffff",
                        navBarBackgroundColor: '#2BB04C',
                        navBarTextFontFamily: 'EncodeSans-Medium',
                        // tabBarSelectedButtonColor: "#34A941",
                        // tabBarButtonColor: "#BBBBBB",
                        // tabFontFamily: 'EncodeSans-Regular',
                        // tabFontSize: 12,
                        // selectedTabFontSize: 12,
                        orientation: 'portrait'
                    },
                });
            })
            resolve()
        })
        return promise
    }
};

export const pushMainMenu = () => {
    return dispatch => {
        const promise = new Promise((resolve, reject) => {
            this.props.navigator.resetTo({
                screen: 'cheria-holidays.CategoryTourPackage', // unique ID registered with Navigation.registerScreen
                title: 'Halal Traveler', // navigation bar title of the pushed screen (optional)
                passProps: {}, // simple serializable object that will pass as props to the pushed screen (optional)
                animated: true, // does the resetTo have transition animation or does it happen immediately (optional)
                animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the resetTo have different transition animation (optional)
                navigatorStyle: {
                    navBarTextColor: "#ffffff",
                    navBarBackgroundColor: '#2BB04C',
                    navBarTextFontFamily: 'EncodeSans-Medium',
                    orientation: 'portrait'
                }, // override the navigator style for the pushed screen (optional)
                navigatorButtons: {
                    leftButtons: [
                        {
                            icon: require('../../assets/logoHeader/icon_header.png'),
                            title: "Menu",
                            id: "sideDrawerToggle"
                        }
                    ],
                    rightButtons: [
                        {
                            id: 'payment',
                            icon: sources[5],

                        },
                        {
                            id: 'notificationToggle',
                            icon: sources[6],
                            badgeStyle: 'red',
                            badgeCount: 0
                        },
                    ]

                }
            })
            resolve()
        })
        return promise
    }
}

export const startMainMenuInstalled = () => {
    Promise.all([
        Ico.getImageSource(Platform.OS === 'android' ? "home" : "ios-cart", 30), //0
        Ico.getImageSource(Platform.OS === 'android' ? "story" : "ios-add-circle", 24, '#FFF'), //1
        Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30), //2
        Ico.getImageSource(Platform.OS === 'android' ? "small-mosque" : "ios-star", 30), //3
        Ico.getImageSource("notifications", 24, '#FFFFFF'), //4
        Ico.getImageSource("invoice", 24, '#FFFFFF'), //5
        Icon.getImageSource("md-notifications", 24, '#FFFFFF'), //6
        Ico.getImageSource("user-shape", 22, '#FFFFFF'), //7rr
    ]).then(sources => {

        Navigation.startSingleScreenApp({
            screen:
            {
                screen: "cheria-holidays.MainMenu",
                // label: "Home",
                title: "Halal Traveler",
                // icon: sources[0],
                navigatorButtons: {
                    leftButtons: [
                        {
                            icon: require('../../assets/logoHeader/icon_header.png'),
                            title: "Menu",
                            id: "sideDrawerToggle"
                        }
                    ],
                    rightButtons: [
                        {
                            id: 'notificationToggle',
                            icon: sources[6],
                            badgeStyle: 'red',
                            badgeCount: 0
                        },
                        {
                            id: 'payment',
                            icon: sources[5],

                        },
                    ]

                }
            },

            appStyle: {
                // forceTitlesDisplay: true,
                navBarTextColor: "#ffffff",
                navBarBackgroundColor: '#2BB04C',
                navBarTextFontFamily: 'EncodeSans-Medium',
                // tabBarSelectedButtonColor: "#34A941",
                // tabBarButtonColor: "#BBBBBB",
                // tabFontFamily: 'EncodeSans-Regular',
                // tabFontSize: 12,
                // selectedTabFontSize: 12,
                orientation: 'portrait'
            },
        });
    })
}