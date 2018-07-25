/**
 * Created by mata on 6/2/18.
 */

import { Navigation } from "react-native-navigation";
import Icon from 'react-native-vector-icons/Ionicons';
import { Platform } from 'react-native';

export const startTourPackage = () => {
    return dispatch => {

        Promise.all([
            Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30)
        ]).then(sources => {
            Navigation.startSingleScreenApp({
                screen: {
                    screen: "cheria-holidays.TourPackage",
                    title: "All Tour Package",
                    navigatorButtons: {
                        leftButtons: [
                            {
                                icon: sources[0],
                                title: "Menu",
                                id: "sideDrawerToggle"
                            }
                        ]
                    }
                },
                drawer: {
                    left: {
                        screen: "cheria-holidays.SideDrawer"
                    }
                },
                appStyle: {
                    navBarTextColor:"#490E14",
                    navBarButtonColor:"#490E14"
                },
            });
        })

    }
};
