/**
 * Created by mata on 6/1/18.
 */

import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome'

const startTabs = () => {
    Promise.all([
        Icon.getImageSource(Platform.OS === 'android' ? "md-cart" : "ios-cart", 30),
        Icon2.getImageSource(Platform.OS === 'android' ? "money" : "money", 30),
        Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30)
    ]).then(sources => {
        Navigation.startSingleScreenApp({
            tabs: [
                {
                    screen: "cheria-holidays.FindPlaceScreen",
                    label: "Tour Package",
                    title: "Tour Package",
                    icon: sources[0],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[2],
                                title: "Menu",
                                id: "sideDrawerToggle"
                            }
                        ]
                    }
                },
                {
                    screen: "cheria-holidays.SharePlaceScreen",
                    label: "Payment Confirmation",
                    title: "Payment Confirmation",
                    icon: sources[1],
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[2],
                                title: "Menu",
                                id: "sideDrawerToggle"
                            }
                        ]
                    }
                }
            ],
            tabsStyle: {
                tabBarSelectedButtonColor: "orange"
            },
            drawer: {
                left: {
                    screen: "cheria-holidays.SideDrawer"
                }
            },
            appStyle: {
                tabBarSelectedButtonColor: "orange"
            },
        });
    });
};

export default startTabs;
