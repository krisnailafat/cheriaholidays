/**
 * Created by mata on 6/1/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import TourListCategory from "../../components/TourList/TourListCategory";
import TourListRegions from "../../components/TourList/TourListRegions";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
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
    AsyncStorage,
    PermissionsAndroid,
    Alert,
    ImageBackground
} from "react-native";
import { requestLokasiGoogle, profile, pembelian } from "../../store/actions";
import Share from 'react-native-share';

//custom icon
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

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
        tours: null,
        toursRegion: null,

        isBoxLogin: true,
        isBoxProfile: false,
        isBoxInfoSolat: true,
        isBoxInfoSolatFetchGps: false,

        date: {
            masehi: null,
            hijri: null,
        },
        jadwal: null,
        shareJadwal: null,
        pray: {
            name: null,
            time: null,
            timeLeft: null,
        },

        city: null,

        currentLongitude: 'unknown',//Initial Longitude
        currentLatitude: 'unknown',//Initial Latitude

        isMounted: false,
        isError: false
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
                    screen: "cheria-holidays.RequestTour",
                    // screen: "cheria-holidays.Adhan",
                    title: "Request Tour",
                    passProps: {},
                    navigatorStyle: {},
                    animationType: 'fade'
                });

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
            if (event.id === "payment") {
                this.props.navigator.push({
                    screen: "cheria-holidays.PaymentRecord",
                    title: "Pemesanan / Pembelian",
                    passProps: {},
                    navigatorStyle: {},
                    animationType: 'fade',
                    navigatorStyle: {
                        navBarTextColor: "#ffffff",
                        navBarBackgroundColor: '#2BB04C',
                        navBarTextFontFamily: 'EncodeSans-Medium',
                        navBarButtonColor: '#fff',
                        // tabBarHidden: true,
                    }
                });
            }
        }
        // if (event.type == 'DeepLink') {
        //     //Make your things..
        //     console.log('main menu deeplink clicked')
        //     console.log('payload link', event.payload)
        //     this.props.navigator.showModal({
        //         screen: 'cheria-holidays.NotificationScreen', // unique ID registered with Navigation.registerScreen
        //         title: "Notifikasi", // navigation bar title of the pushed screen (optional)
        //         passProps: {
        //             dataNotif: event.payload
        //         }, // simple serializable object that will pass as props to the pushed screen (optional)
        //         animated: true, // does the resetTo have transition animation or does it happen immediately (optional)
        //         animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the resetTo have different transition animation (optional)
        //         navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
        //         navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
        //     });
        // }
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

    componentWillMount() {
        var that = this;
        this.setState({ isMounted: true }, () => {
            let url2 = "https://travelfair.co/api/region/";
            fetch(url2)
                .catch(err => {
                    console.log(err);
                    // Alert.alert("Error accessing travelfair.co");
                    this.setState({ isError: true })
                    //dispatch(uiStopLoading());
                })
                .then(res => res.json())
                .catch(err => {
                    console.log(err);
                    this.setState({ isError: true })
                })
                .then(parsedRes => {
                    if (this.state.isError) {
                        Alert.alert("", "Silahkan Coba Kembali", [
                            {
                                text: 'OK', onPress: () =>
                                    this.props.navigator.dismissAllModals({
                                        animationType: 'noe' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
                                    })
                            },
                        ]);
                    }
                    else {
                        if (this.state.isMounted) {
                            console.log('kepanggil')
                            const dataRegion = parsedRes.slice().reverse()
                            this.setState({ toursRegion: dataRegion })
                            fetchRegion()
                        }
                    }
                })
                .catch(err => {
                    console.log(err);
                    // Alert.alert("Ops something wrong", err);
                })

            fetchRegion = () => {
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
                        if (this.state.isMounted) {
                            const dataCategory = parsedRes.slice().reverse()
                            that.setState({ tours: dataCategory, isLoading: false })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        Alert.alert("Ops something wrong", err);
                    })
            }
        });


        // let url2 = "https://travelfair.co/api/region/";
        // fetch(url2)
        //     .catch(err => {
        //         console.log(err);
        //         alert("Error accessing travelfair.co");
        //         //dispatch(uiStopLoading());
        //     })
        //     .then(res => res.json())
        //     .catch(err => {
        //         console.log(err);
        //         alert("JSON error");
        //     })
        //     .then(parsedRes => {
        //         //dispatch(uiStopLoading());
        //         // console.log('data region: ', parsedRes);
        //         const dataRegion = parsedRes.slice().reverse()
        //         this.setState({ toursRegion: dataRegion })
        //         fetchDataCategory();
        //     });

        // function fetchDataCategory() {
        //     console.log('kepanggil')
        //     let url = "https://travelfair.co/api/category/";
        //     fetch(url)
        //         .catch(err => {
        //             console.log(err);
        //             alert("Error accessing travelfair.co");
        //             //dispatch(uiStopLoading());
        //         })
        //         .then(res => res.json())
        //         .catch(err => {
        //             console.log(err);
        //             alert("JSON error");
        //         })
        //         .then(parsedRes => {
        //             //dispatch(uiStopLoading());
        //             // console.log('data category: ', parsedRes);
        //             const dataCategory = parsedRes.slice().reverse()
        //             that.setState({ tours: dataCategory, isLoading: false })
        //         });
        // }
    }

    // onLoadUser = () => {
    //     try {
    //         this.setState({ isMounted: true });
    //         let url2 = "https://travelfair.co/api/region/";
    //         fetch(url2)
    //             .catch(err => {
    //                 console.log(err);
    //                 alert("Error accessing travelfair.co");
    //                 //dispatch(uiStopLoading());
    //             })
    //             .then(res => res.json())
    //             .catch(err => {
    //                 console.log(err);
    //                 alert("JSON error");
    //             })
    //             .then(parsedRes => {
    //                 //dispatch(uiStopLoading());
    //                 // console.log('data region: ', parsedRes);
    //                 const dataRegion = parsedRes.slice().reverse()
    //                 this.setState({ toursRegion: dataRegion })
    //             });
    //     } catch (err) {
    //         console.log('err mounted, ', err)
    //         this.setState({ isLoading: false });

    //     }
    // }

    componentWillUnmount() {
        // this.notificationListener();
        // navigator.geolocation.clearWatch(this.watchID);
        this.setState({ isMounted: false })
    }

    componentDidMount = () => {

        AsyncStorage.getItem("ap:logged").then((value) => {

            if (value !== null) {
                this.props.onProfile()
                this.props.onPembelian()
                this.setState({ isBoxLogin: false, isBoxProfile: true })
            }
            else {
                // console.log('belum login')
            }
        })

    }

    componentDidUpdate = async (prevProps, prevState) => {

        if (this.props.isLogin) {
            AsyncStorage.getItem("ap:logged").then((value) => {
                if (value !== null) {
                    this.props.onProfile()
                    this.props.onPembelian()
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
                    tours={this.state.toursRegion || null}
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
                    tours={this.state.tours || null}
                    onItemSelected={this.itemSelectedHandler}
                />

            )
        }
    }

    render() {


        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
                    <ActivityIndicator size="large" color="#FF9D00" />
                    <Text style={{ paddingTop: 10 }}>Loading ...</Text>
                </View>
            )
        } else {
            return (

                <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: "#fff" }}>
                    <View style={{ flex: 1, alignItems: 'center', backgroundColor: "#fff" }}>
                        {/* pilih region */}
                        <View style={{ width: Dimensions.get('window').width, marginTop: 10 }} >
                            <TextSemiBold style={{ color: '#404040', fontSize: 18, paddingLeft: 10 }}>Region Area</TextSemiBold>
                            <TextNormal style={{ color: '#404040', fontSize: 14, paddingLeft: 10, marginBottom: 10 }}>Pilih Tujuan Wisata berdasarkan ketentuan</TextNormal>
                            {this.renderRegion()}
                        </View>
                        {/* pilih kategori */}
                        <View style={{ width: Dimensions.get('window').width, marginTop: 20 }} >
                            <TextSemiBold style={{ color: '#404040', fontSize: 18, paddingLeft: 10 }}>Kategori</TextSemiBold>
                            <TextNormal style={{ color: '#404040', fontSize: 14, paddingLeft: 10, marginBottom: 10 }}>Pilih Tujuan Wisata berdasarkan ketentuan</TextNormal>
                            {this.renderMain()}
                        </View>
                    </View>
                </ScrollView >

            )
        };
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading,
        isLogin: state.isLogin.isLogin,
        profile: state.profile.profile,
        point: state.point.point,

    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetLokasiGoogle: (lat, lon) => dispatch(requestLokasiGoogle(lat, lon)),
        onProfile: () => dispatch(profile()),
        onPembelian: () => dispatch(pembelian()),
        // checkLogin :()=>dispatch(setl)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CategoryTourPackage);


