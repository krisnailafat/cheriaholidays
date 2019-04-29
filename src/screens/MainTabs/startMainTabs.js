import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome'
//custom icon
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon

const startTabs = () => {
    Promise.all([
        Ico.getImageSource(Platform.OS === 'android' ? "home" : "ios-cart", 30), //0
        Ico.getImageSource(Platform.OS === 'android' ? "story" : "ios-add-circle", 24, '#FFF'), //1
        Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30), //2
        Ico.getImageSource(Platform.OS === 'android' ? "small-mosque" : "ios-star", 30), //3
        Ico.getImageSource("notifications", 24, '#FFFFFF'), //4
        Ico.getImageSource("invoice", 24, '#FFFFFF'), //5
        Icon.getImageSource("md-notifications", 24, '#FFFFFF'), //6
        Ico.getImageSource("user-shape", 30), //7
    ]).then(sources => {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: "cheria-holidays.CategoryTourPackage",
                    label: "Home",
                    title: "Tujuan Wisata",
                    icon: sources[0],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                // icon: sources[2],
                                icon: require('../../assets/logoHeader/iconwisata.png'),
                                title: "Menu",
                                id: "sideDrawerToggle"
                            }
                        ],
                        rightButtons: [
                            {
                                id: 'request',
                                icon: sources[1],

                            },
                            {
                                id: 'notificationToggle',
                                icon: sources[6],
                                badgeStyle: 'red',
                                badgeCount: 0
                            },
                        ]

                    }
                },
                {
                    screen: "cheria-holidays.MuslimWorld",
                    label: "Muslim World",
                    title: "Muslim World",
                    icon: sources[3],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                // icon: sources[2],
                                icon: require('../../assets/logoHeader/sholat.png'),
                                title: "Menu",
                                id: "sideDrawerToggle"
                            }
                        ]
                    },
                    topTabs: [ //top tab bar yang ada di muslim world
                        {
                            screenId: 'cheria-holidays.JadwalSolat',
                            title: 'Sholat',
                            buttonColor: '#FFFFFF'
                            //   icon: require('../img/list.png')
                        },
                        {
                            screenId: 'cheria-holidays.Geolocation',
                            title: 'Kiblat',
                            buttonColor: '#FFFFFF'
                            //   icon: require('../img/list.png')
                        },
                        {
                            screenId: 'cheria-holidays.PetaMasjid',
                            title: 'Masjid',
                            buttonColor: '#FFFFFF'
                            //   icon: require('../img/list.png')
                        },
                        {
                            screenId: 'cheria-holidays.PetaRestoran',
                            title: 'Resto',
                            buttonColor: '#FFFFFF'
                            //   icon: require('../img/list.png')
                        }
                    ]
                },
                {
                    // screen: "cheria-holidays.RequestTour",
                    // title: "Request Tour",
                    // label: "Request Tour",
                    screen: "cheria-holidays.PaymentRecord",
                    title: "Pembelian / Pembayaran",
                    label: "Order",
                    // icon: sources[1],
                    icon: sources[5],
                    navigatorStyle: {
                        // drawUnderTabBar: false,
                    },
                    navigatorButtons: {
                        leftButtons: [
                            {
                                // icon: sources[2],
                                icon: require('../../assets/logoHeader/permintaan.png'),
                                title: "Menu",
                                id: "sideDrawerToggle"
                            }
                        ]
                    }
                },
                {
                    screen: "cheria-holidays.Profile",
                    label: "Profil",
                    title: "Profil",
                    icon: sources[7],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                // icon: sources[2],
                                icon: require('../../assets/logoHeader/profile.png'),
                                title: "Menu",
                                id: "sideDrawerToggle"
                            }
                        ]
                    }
                }
            ],
            // tabsStyle: {
            //     tabBarSelectedButtonColor: "#490E14"
            // },
            // drawer: {
            //     left: {
            //         screen: "cheria-holidays.SideDrawer"
            //     }
            // },
            appStyle: {
                forceTitlesDisplay: true,
                navBarTextColor: "#ffffff",
                navBarBackgroundColor: '#2BB04C',
                navBarTextFontFamily: 'EncodeSans-Medium',
                tabBarSelectedButtonColor: "#34A941",
                tabBarButtonColor: "#BBBBBB",
                tabFontFamily: 'EncodeSans-Regular',
                tabFontSize: 12,
                selectedTabFontSize: 12,
                orientation: 'portrait'
            },
        });
    });
};

export default startTabs;