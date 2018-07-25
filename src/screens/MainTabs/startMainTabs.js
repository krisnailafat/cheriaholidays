import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome'

const startTabs = () => {
    Promise.all([
        Icon.getImageSource(Platform.OS === 'android' ? "md-cart" : "ios-cart", 30),
        Icon.getImageSource(Platform.OS === 'android' ? "md-add-circle" : "ios-add-circle", 30),
        Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30)
    ]).then(sources => {
        Navigation.startTabBasedApp({
            tabs: [
                {
                    screen: "cheria-holidays.CategoryTourPackage",
                    label: "Kategori Tour",
                    title: "Destinasi Tour",
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
                    screen: "cheria-holidays.RequestTour",
                    label: "Request Tour",
                    title: "Request Tour",
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
                tabBarSelectedButtonColor: "#490E14"
            },
            drawer: {
                left: {
                    screen: "cheria-holidays.SideDrawer"
                }
            },
            appStyle: {
                tabBarSelectedButtonColor: "#490E14",
                navBarTextColor:"#490E14",
                navBarButtonColor:"#490E14"
            },
        });
    });
};

export default startTabs;