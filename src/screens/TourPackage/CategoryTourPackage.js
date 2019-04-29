/**
 * Created by mata on 6/1/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import TourListCategory from "../../components/TourList/TourListCategory";
import TourListRegions from "../../components/TourList/TourListRegions";
import Icon from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../../components/UI/TextCustom/TextCustom"

import {
    View,
    Image,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    ActivityIndicator,
    ScrollView,
    AsyncStorage
} from "react-native";

//custom icon
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon
// import firebase from 'react-native-firebase';
// import type { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';

// import RNCalendarEvents from 'react-native-calendar-events';
// import BackgroundJob from "react-native-background-job";

class CategoryTourPackage extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    state = {
        isLoading: true,
        tours: {},
        toursRegion: {},

        isBoxLogin: true,
        isBoxProfile: false
    }

    onNavigatorEvent = event => {
        //TODO buat onloads event

        //ini buat toogle side drawer
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
            if (event.id === "request") {

                this.props.navigator.showModal({
                    // screen: "cheria-holidays.PaymentRecord",
                    // title: "Pembelian / Pembayaran",
                    screen: "cheria-holidays.RequestTour",
                    title: "Request Tour",
                    passProps: {},
                    navigatorStyle: {},
                    animationType: 'fade'
                });
                // this.regularJobKeySchedule()

                // RNCalendarEvents.saveEvent('Title of event', {
                //     startDate: '2019-04-18T00:00:00.000Z',
                //     recurrenceRule: {
                //         frequency: 'daily',
                //         endDate: '2019-04-18T23:00:00.000Z'
                //     }
                // })
                // this.notifikasiSchedule()

            }
            if (event.id === "notificationToggle") {

                // this.props.navigator.showInAppNotification({
                //     screen: "cheria-holidays.NotificationScreen", // unique ID registered with Navigation.registerScreen
                //     passProps: {}, // simple serializable object that will pass as props to the in-app notification (optional)
                //     autoDismissTimerSec: 1 // auto dismiss notification in seconds
                // });

                this.props.navigator.showModal({
                    screen: "cheria-holidays.NotificationScreen",
                    // screen: "cheria-holidays.ShareScreen",
                    title: "Notifikasi",
                    passProps: {},
                    navigatorStyle: {},
                    animationType: 'fade'
                });

                // this.props.navigator.setTabBadge({
                //     // tabIndex: 1, // (optional) if missing, the badge will be added to this screen's tab
                //     badge: 11, // badge value, null to remove badge
                // });

            }
        }
        if (event.type == 'DeepLink') {
            //Make your things..
            console.log('main menu deeplink clicked')
            console.log('payload link', event.payload)
            this.props.navigator.showModal({
                screen: 'cheria-holidays.NotificationScreen', // unique ID registered with Navigation.registerScreen
                title: "Notifikasi", // navigation bar title of the pushed screen (optional)
                passProps: {
                    dataNotif: event.payload
                }, // simple serializable object that will pass as props to the pushed screen (optional)
                animated: true, // does the resetTo have transition animation or does it happen immediately (optional)
                animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the resetTo have different transition animation (optional)
                navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
                navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
            });
        }
    };





    // notifikasiSchedule = async () => {
    //     const enabled = await firebase.messaging().hasPermission();
    //     if (enabled) {
    //         // user has permissions
    //         console.log(enabled, "ya")
    //     } else {
    //         // user doesn't have permission
    //         try {
    //             await firebase.messaging().requestPermission();
    //             // User has authorised
    //             console.log(enabled, "ya")
    //         } catch (error) {
    //             // User has rejected permissions
    //             alert('No permission for notification');
    //         }
    //     }


    //     const localNotification = new firebase.notifications.Notification({
    //         sound: 'default',
    //         show_in_foreground: true,
    //         show_in_background: true
    //     })
    //         .setNotificationId('test_id')
    //         .setTitle('Waktunya solat')
    //         .setSubtitle('ini subtitle')
    //         .setBody('Mari laksanakan solat')
    //         // .setData('test data')
    //         .android.setChannelId('cheriaholidays') // e.g. the id you chose above
    //         // .android.setChannelId('all') // e.g. the id you chose above
    //         .android.setSmallIcon('ic_notif_new') // create this icon in Android Studio
    //         // .android.setSmallIcon("@mipmap/ic_launcher") // create this icon in Android Studio
    //         .android.setColor('#3EBA49') // you can set a color here
    //         .android.setPriority(firebase.notifications.Android.Priority.High);

    //     var dt = new Date();
    //     var secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));

    //     var hms = '14:25';   // your input string
    //     var a = hms.split(':'); // split it at the colons

    //     // minutes are worth 60 seconds. Hours are worth 60 minutes.
    //     var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60;

    //     var result = seconds - secs
    //     const date = new Date();
    //     date.setSeconds(date.getSeconds() + result);
    //     console.log(date.getTime())

    //     firebase.notifications()
    //         .scheduleNotification(localNotification, {
    //             fireDate: date.getTime(),
    //         })
    //         .catch(err => console.error(err));

    // }


    componentWillUnmount() {
        // this.notificationListener();
    }

    componentDidMount() {
        AsyncStorage.getItem("ap:logged").then((value) => {

            if (value !== null) {
                this.setState({ isBoxLogin: false, isBoxProfile: true })
            }
            else {
                // console.log('belum login')
            }
        })
        let url2 = "https://travelfair.co/api/region/";
        fetch(url2)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair.co");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
                alert("JSON error");
            })
            .then(parsedRes => {
                //dispatch(uiStopLoading());
                console.log('data category: ', parsedRes);
                this.setState({ toursRegion: parsedRes.reverse() })
            });

        let url = "https://travelfair.co/api/category/";
        fetch(url)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair.co");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
                alert("JSON error");
            })
            .then(parsedRes => {
                //dispatch(uiStopLoading());
                console.log('data category: ', parsedRes);
                this.setState({ tours: parsedRes.reverse(), isLoading: false })
            });

        // RNCalendarEvents.authorizeEventStore().then(res => {
        //     console.log(res)

        //     RNCalendarEvents.authorizationStatus().then(res => {
        //         console.log(res)

        //         RNCalendarEvents.findCalendars().then(calendars => {
        //             console.log(calendars.filter(calendar => calendar.allowsModifications))

        //         })
        //         RNCalendarEvents.fetchAllEvents('2019-04-15T00:00:00.000Z', '2019-04-18T00:00:00.000Z').then(res => {
        //             console.log(res)
        //         })
        //     })
        // })
    }

    componentDidUpdate(prevProps, prevState) {

        if (this.props.isLogin) {
            AsyncStorage.getItem("ap:logged").then((value) => {

                if (value !== null) {
                    this.setState({ isBoxLogin: false, isBoxProfile: true })
                }
                else {
                    // console.log('belum login')
                }
            })
        }
    }

    itemSelectedHandler = key => {
        // console.log('this.props', this.props)

        // if (key.cat_tours != undefined) {
        this.props.navigator.push({
            screen: "cheria-holidays.TourPackage",
            title: key.name,
            passProps: {
                tourcontent: key.cat_tours,
                tourtitle: key.name,
                tourid: key.cat_tours[0].category
            },
        });
        // } else {
        //     //  ke halaman region
        //     Promise.all([
        //         FontAwesome.getImageSource("filter", 24, '#3EBA49'),
        //     ]).then(sources => {

        //         this.props.navigator.push({
        //             screen: "cheria-holidays.TourPackage",
        //             title: key.name,
        //             passProps: {
        //                 tourcontent: key.reg_tours,
        //                 tourtitle: key.name,
        //                 tourid: key.reg_tours[0].category
        //             },
        // navigatorButtons: {
        //     rightButtons: [
        //         {
        //             id: 'filter',
        //             icon: sources[0],

        //         },
        //     ]
        // }
        // navigatorStyle: {
        //     navBarCustomView: 'cheria-holidays.CustomNavBar',
        // }

        //     })
        // })
        // }
    };
    itemSelectedHandlerRegion = key => {

        //  ke halaman region
        this.props.navigator.push({
            screen: "cheria-holidays.TourPackage",
            title: key.name,
            passProps: {
                tourcontent: key.reg_tours,
                tourtitle: key.name,
                tourid: key.reg_tours[0].category
            },

            // navigatorButtons: {
            //     rightButtons: [
            //         {
            //             id: 'filter',
            //             icon: sources[0],

            //         },
            //     ]
            // }
            // navigatorStyle: {
            //     navBarCustomView: 'cheria-holidays.CustomNavBar',
            // }

        })


    };


    onKategoriPressed = () => {
        console.log('kategori')
        let url = "https://travelfair.co/api/category/";
        fetch(url)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair.co");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
                alert("JSON error");
            })
            .then(parsedRes => {
                //dispatch(uiStopLoading());
                console.log('data category: ', parsedRes);
                this.setState({ tours: parsedRes })
            });
    }

    onRegionPressed = () => {
        console.log('region')
        let url = "https://travelfair.co/api/region/";
        fetch(url)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair.co");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
                alert("JSON error");
            })
            .then(parsedRes => {
                //dispatch(uiStopLoading());
                console.log('data category: ', parsedRes);
                this.setState({ tours: parsedRes })
            });
    }

    renderRegion() {
        if (this.state.isLoading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF9D00" />
                    <Text style={{ paddingTop: 10 }}>Loading ...</Text>
                </View>
            )
        } else {
            return (

                <TourListRegions
                    tours={this.state.toursRegion}
                    onItemSelected={this.itemSelectedHandlerRegion}
                />

            )
        }
    }

    renderMain() {
        if (this.state.isLoading) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF9D00" />
                    <Text style={{ paddingTop: 10 }}>Loading ...</Text>
                </View>
            )
        } else {
            return (

                <TourListCategory
                    tours={this.state.tours}
                    onItemSelected={this.itemSelectedHandler}
                />

            )
        }
    }

    render() {
        let boxLogin = null
        let boxProfile = null

        if (this.state.isBoxLogin) {
            boxLogin = (
                <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 11, paddingVertical: 17, backgroundColor: '#fff' }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        <Ico name="user-shape" size={20} color='#757575' />
                        <View style={{ width: '100%', marginLeft: 14 }}>
                            <TextSemiBold style={{ color: '#404040', fontSize: 14 }}>Login or register</TextSemiBold>
                            <TextNormal style={{ color: '#757575', fontSize: 14 }}>Enjoy your Halal Traveler member benefits!</TextNormal>
                        </View>
                    </View>
                </View>
            )
        }

        if (this.state.isBoxProfile) {
            console.log(this.props.point)
            boxProfile = (
                <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 11, paddingVertical: 17, backgroundColor: '#fff' }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                        <Ico name="user-shape" size={20} color='#757575' />
                        <View style={{ width: '100%', marginLeft: 14 }}>
                            <TextSemiBold style={{ color: '#404040', fontSize: 14 }}>{this.props.profile !== null ? this.props.profile.email : null}</TextSemiBold>
                            {/* <TextNormal style={{ color: '#757575', fontSize: 14 }}>Enjoy your Halal Traveler member benefits!</TextNormal> */}
                            <View style={{ backgroundColor: '#EEEEEE', width: '50%', paddingHorizontal: 13, paddingVertical: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginTop: 8 }}>
                                <TextNormal style={{ color: '#474747', fontSize: 12 }}>My points   {this.props.point}</TextNormal>
                            </View>
                        </View>
                    </View>
                </View>
            )
        }

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF9D00" />
                    <Text style={{ paddingTop: 10 }}>Loading ...</Text>
                </View>
            )
        } else {
            return (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center', padding: 10 }}>
                        <TouchableOpacity onPress={this.onKategoriPressed}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon
                                    name={Platform.OS === "android" ? "ios-checkmark-circle-outline" : "ios-checkmark-circle-outline"}
                                    size={20}
                                    color="black"
                                />
                                <Text style={{ paddingLeft: 10 }}>Kategori</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onRegionPressed}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon
                                    name={Platform.OS === "android" ? "ios-checkmark-circle-outline" : "ios-checkmark-circle-outline"}
                                    size={20}
                                    color="black"
                                    style={{ paddingLeft: 40 }}
                                />
                                <Text style={{ paddingLeft: 10 }}>Region Area</Text>
                            </View>
                        </TouchableOpacity>
                    </View> */}
                        {boxLogin}
                        {boxProfile}
                        {/* pilih region */}
                        <View style={{ width: Dimensions.get('window').width }} >
                            <TextSemiBold style={{ color: '#404040', fontSize: 18, paddingLeft: 10 }}>Region Area</TextSemiBold>
                            <TextNormal style={{ color: '#404040', fontSize: 14, paddingLeft: 10, marginBottom: 10 }}>Pilih Tujuan Wisata berdasarkan ketentuan</TextNormal>
                            {this.renderRegion()}
                        </View>
                        {/* pilih kategori */}
                        <View style={{ width: Dimensions.get('window').width }} >
                            <TextSemiBold style={{ color: '#404040', fontSize: 18, paddingLeft: 10 }}>Kategori</TextSemiBold>
                            <TextNormal style={{ color: '#404040', fontSize: 14, paddingLeft: 10, marginBottom: 10 }}>Pilih Tujuan Wisata berdasarkan ketentuan</TextNormal>
                            {this.renderMain()}
                        </View>
                    </View>
                </ScrollView>
            )
        };
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading,
        isLogin: state.isLogin.isLogin,
        profile: state.profile.profile,
        point: state.point.point
    };
};

export default connect(mapStateToProps, null)(CategoryTourPackage);


