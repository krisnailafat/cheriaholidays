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
    ImageBackground,
    DeviceEventEmitter
} from "react-native";
import { requestLokasiGoogle, profile, pembelian } from "../../store/actions";
import Share from 'react-native-share';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
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

class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    state = {
        isLoading: true,
        tours: {},
        toursRegion: {},

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
        // console.log(event)
        if (event.link == 'DeepLink') {
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
        if (event.link == 'salatDeepLink') {
            //Make your things..
            console.log('jadwal salatdeeplink clicked')
            this.omMenuClick('cheria-holidays.JadwalSolat', 'Jadwal Sholat')
            // this.props.navigator.showModal({
            //     screen: 'cheria-holidays.NotificationScreen', // unique ID registered with Navigation.registerScreen
            //     title: "Notifikasi", // navigation bar title of the pushed screen (optional)
            //     passProps: {
            //         dataNotif: event.payload
            //     }, // simple serializable object that will pass as props to the pushed screen (optional)
            //     animated: true, // does the resetTo have transition animation or does it happen immediately (optional)
            //     animationType: 'fade', // 'fade' (for both) / 'slide-horizontal' (for android) does the resetTo have different transition animation (optional)
            //     navigatorStyle: {}, // override the navigator style for the pushed screen (optional)
            //     navigatorButtons: {} // override the nav buttons for the pushed screen (optional)
            // });
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

    componentWillMount() {

    }

    componentWillUnmount() {
        // this.notificationListener();
        // navigator.geolocation.clearWatch(this.watchID);
        LocationServicesDialogBox.stopListener();
    }

    componentDidMount = () => {


        var that = this;
        //Checking for the permission just after component loaded

        // async function requestLocationPermission() {
        //     try {
        //         const granted = await PermissionsAndroid.check(
        //             PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        //                 'title': 'Membutuhkan akses lokasi',
        //                 'message': 'Halal traveler membutuhkan akses lokasi'
        //             }
        //         )
        //         console.log('granted ', granted)
        //         // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //         if (granted) {
        //             //To Check, If Permission is granted
        //             that.callLocation(that);
        //         }
        //         else {
        //             try {
        //                 const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //                     {
        //                         'title': 'Membutuhkan akses lokasi',
        //                         'message': 'Halal traveler membutuhkan akses lokasi'
        //                     }
        //                 )
        //                 console.log('granted else, ', granted)
        //                 if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //                     that.callLocation(that);
        //                 }
        //                 else {
        //                     Alert.alert("Akses lokasi", "Harap nyalakan lokasi",
        //                         [
        //                             { text: 'OK', onPress: () => that.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
        //                         ],
        //                         { cancelable: false }
        //                     );
        //                 }
        //             } catch (err) {
        //                 Alert.alert("Terjadi kesalahan", "Silahkan coba beberapa saat lagi",
        //                     [
        //                         { text: 'OK', onPress: () => that.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
        //                     ],
        //                     { cancelable: false }
        //                 );
        //             }
        //         }

        //     } catch (err) {
        //         Alert.alert("Terjadi kesalahan", "Silahkan coba beberapa saat lagi",
        //             [
        //                 { text: 'OK', onPress: () => that.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
        //             ],
        //             { cancelable: false }
        //         );
        //         console.warn(err)
        //     }
        // }
        // requestLocationPermission();
        this.fetchLocation()
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
        async function afterOrder() {
            try {
                const orderCondition = JSON.parse(await AsyncStorage.getItem('ap:order:condition'))
                // console.log('kepanggil', orderCondition)
                if (orderCondition) {
                    AsyncStorage.setItem('ap:order:condition', JSON.stringify(false)).then(ok => {
                        that._orderDone()
                    })
                }
                else {
                    console.log("ini false")
                }
            } catch (err) {
                console.log("ini err, ", err)
            }
        }
        afterOrder();
        DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
            console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
            if (status == "disabled") {
                Alert.alert("Harus mengaktifkan GPS");
            }
        });

    }

    callGps() {
        this.setState({ isBoxInfoSolat: true })
        var that = this;
        //Checking for the permission just after component loaded

        async function requestLocationPermission() {
            try {
                const granted = await PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                        'title': 'Membutuhkan akses lokasi',
                        'message': 'Halal traveler membutuhkan akses lokasi'
                    }
                )
                console.log('granted ', granted)
                // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                if (granted) {
                    //To Check, If Permission is granted
                    that.callLocation(that);
                }
                else {
                    try {
                        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                            {
                                'title': 'Membutuhkan akses lokasi',
                                'message': 'Halal traveler membutuhkan akses lokasi'
                            }
                        )
                        console.log('granted else, ', granted)
                        if (granted) {
                            that.callLocation(that);
                        }
                        else {
                            Alert.alert("Akses lokasi", "Harap nyalakan lokasi",
                                [
                                    { text: 'OK', onPress: () => that.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
                                ],
                                { cancelable: false }
                            );
                        }
                    } catch (err) {
                        Alert.alert("Terjadi kesalahan", "Silahkan coba beberapa saat lagi",
                            [
                                { text: 'OK', onPress: () => that.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
                            ],
                            { cancelable: false }
                        );
                    }
                }

            } catch (err) {
                Alert.alert("Akses lokasi", "Harap nyalakan lokasi",
                    [
                        { text: 'OK', onPress: () => that.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
                    ],
                    { cancelable: false }
                );
                console.warn(err)
            }
        }
        requestLocationPermission();
    }

    _orderDone = () => {
        console.log('_orderDone')
        this.props.navigator.showModal({
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
            }
        });
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

    callLocation(that) {
        //alert("callLocation Called");
        navigator.geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                const currentLongitude = JSON.stringify(position.coords.longitude);
                //getting the Longitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);
                //getting the Latitude from the location json
                that.setState({ currentLongitude: currentLongitude });
                //Setting state Longitude to re re-render the Longitude Text
                that.setState({ currentLatitude: currentLatitude });
                //Setting state Latitude to re re-render the Longitude Text
                console.log('currentLongitude ' + currentLongitude + ' currentLatitude ' + currentLatitude)
                console.log('currentLongitude ', Number(currentLatitude))
                if (currentLongitude !== null && currentLatitude !== null) {
                    AsyncStorage.setItem("ap:latitude", currentLatitude)
                    AsyncStorage.setItem("ap:longitude", currentLongitude)
                    this.props.onSetLokasiGoogle(currentLatitude, currentLongitude).then(response => {
                        console.log('onSetLokasiGoogle ', response)
                        // const arrLokasiGoogle = res.results.filter(obj => obj.address_components.find(x => x.types.find(z => z === "administrative_area_level_2"))).map(x => x.address_components.find(y => y.types.find(y => y === "administrative_area_level_2")))
                        // if (typeof (arrLokasiGoogle[0]) == 'undefined') {

                        //     console.log('tidak ada')
                        // } else {
                        //     const resArr = arrLokasiGoogle[0].short_name
                        //     console.log(resArr)
                        //     console.log('ada')
                        // }
                        const results = response.results;
                        for (var i = 0; i < results.length; i++) {

                            if (results[i].types[0] === "locality") {
                                this.setState({
                                    city: (results[i].address_components[0].short_name)
                                });
                                // console.log(this.state.city)
                                console.log("ini ", (results[i].address_components[0].short_name).toLowerCase())
                            }
                            else if (results[i].types[0] === "administrative_area_level_2") {
                                this.setState({
                                    city: (results[i].address_components[0].short_name)
                                });
                            }
                        }
                    })
                    this.dataJadwalSholat(currentLatitude, currentLongitude)
                }
            },
            (error) =>
                Alert.alert("Akses lokasi", "Silahkan coba kembali",
                    [
                        { text: 'OK', onPress: () => that.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
                    ],
                    { cancelable: false }
                )
            ,
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
        // that.watchID = navigator.geolocation.watchPosition((position) => {
        //     //Will give you the location on location change
        //     console.log(position);
        //     const currentLongitude = JSON.stringify(position.coords.longitude);
        //     //getting the Longitude from the location json
        //     const currentLatitude = JSON.stringify(position.coords.latitude);
        //     //getting the Latitude from the location json
        //     that.setState({ currentLongitude: currentLongitude });
        //     //Setting state Longitude to re re-render the Longitude Text
        //     that.setState({ currentLatitude: currentLatitude });
        //     //Setting state Latitude to re re-render the Longitude Text
        // });
    }

    fetchLocation = () => {
        this.setState({ isBoxInfoSolat: true })
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Akses Lokasi</h2>Halal Traveler membutuhkan lokasi<br/><br/>aktifkan GPS untuk lokasi<br/>",
            ok: "Iya",
            cancel: "Tidak",
            enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
            showDialog: true, // false => Opens the Location access page directly
            openLocationServices: true, // false => Directly catch method is called if location services are turned off
            preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
            preventBackClick: true, //true => To prevent the location services popup from closing when it is clicked back button
            providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
        }).then(function (success) {
            // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
            navigator.geolocation.getCurrentPosition((position) => {
                let initialPosition = JSON.stringify(position);
                console.log("ini hasilnya", position.coords.longitude)
                this.setState({ longitude: position.coords.longitude, latitude: position.coords.latitude });
                const currentLongitude = JSON.stringify(position.coords.longitude);
                //getting the Longitude from the location json
                const currentLatitude = JSON.stringify(position.coords.latitude);
                //getting the latitude from the location json
                AsyncStorage.setItem("ap:latitude", currentLatitude)
                AsyncStorage.setItem("ap:longitude", currentLongitude)
                this.props.onSetLokasiGoogle(currentLatitude, currentLongitude)
                    .then(response => {
                        console.log('onSetLokasiGoogle ', response)
                        if (typeof (response) === "undefined") {
                            console.log('response undefined, ', response)
                        }
                        else {
                            const results = response.results;
                            for (var i = 0; i < results.length; i++) {

                                if (results[i].types[0] === "locality") {
                                    this.setState({
                                        city: (results[i].address_components[0].short_name)
                                    });
                                    // console.log(this.state.city)
                                    console.log("ini ", (results[i].address_components[0].short_name).toLowerCase())
                                }
                                else if (results[i].types[0] === "administrative_area_level_2") {
                                    this.setState({
                                        city: (results[i].address_components[0].short_name)
                                    });
                                }
                            }
                            this.dataJadwalSholat(currentLatitude, currentLongitude)
                        }
                    },
                        // (error) => {
                        //     Alert.alert(`${error}`, `Silahkan coba kembali`,
                        //         [
                        //             { text: 'OK', onPress: () => this.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
                        //         ]);
                        // }
                    ).catch(err => {
                        Alert.alert(`${err}`, `Silahkan coba kembali`,
                            [
                                { text: 'OK', onPress: () => this.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
                            ]);
                        // console.log('error fetchLocation, ', err)
                        // console.error('error fetchLocation, ', err)
                        // throw err;
                    })

            }, error => {
                console.log(error)
                Alert.alert("Akses lokasi", "Silahkan coba kembali",
                    [
                        { text: 'OK', onPress: () => this.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
                    ],
                    { cancelable: false }
                )
            }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
        }.bind(this)
        ).catch((error) => {
            Alert.alert("Akses lokasi", "Silahkan coba kembali",
                [
                    { text: 'OK', onPress: () => this.setState({ isBoxInfoSolat: false, isBoxInfoSolatFetchGps: false }) },
                ],
                { cancelable: false }
            )
            console.log(error.message);
        });

        DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
            if (status == "disabled") {
                Alert.alert("Harus mengaktifkan GPS");
            }
            console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
        });
    }

    dataJadwalSholat = (lat, lon) => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        if (mm < 10) {
            mm = '0' + mm
        }

        today = dd + '-' + mm + '-' + yyyy;
        let url = "http://api.aladhan.com/v1/timings/" + today + "?latitude=" + lat + "&longitude=" + lon + "&method=5";
        fetch(url, {
            credentials: 'include',
            method: 'GET',
        })
            .catch(err => {
                console.log(err);
                //Alert("Error accessing mitratel server");
                this.setState({ errorMessage: err, isLoading: false })
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .then(parsedRes => {
                //dispatch(uiStopLoading());
                console.log('jadwal: ', parsedRes);
                const name = parsedRes.data.timings
                console.log('name.fajr', name.Fajr)

                this.setState({
                    jadwal: parsedRes,
                    date: { masehi: parsedRes.data.date.readable, hijri: parsedRes.data.date.hijri.date },
                })
                this.NextPrayerTime2(name.Fajr, name.Dhuhr, name.Asr, name.Maghrib, name.Isha)
            })
            .catch(err => Alert.alert("Error", err))
    }

    NextPrayerTime(fajr, dhuhr, asr, maghrib, isy) {
        console.log(fajr + dhuhr + asr + maghrib + isy)
        let nextSolat;

        var setPrayerTime = function () {
            var prayerHours = prayerTime.split(':')[0];
            var prayerMin = prayerTime.split(':')[1];
            if (today.getHours() >= prayerHours) {
                prayerTimeDate.setDate(today.getDate() + 1);
            }
            prayerTimeDate.setHours(prayerHours);
            prayerTimeDate.setMinutes(prayerMin);
        };

        var subuhTime = fajr
        var duhurTime = dhuhr
        var asharTime = asr
        var MagribTime = maghrib
        var IsyaTime = isy

        var today = new Date();
        var todayHour = today.getHours();

        var prayerHoursSubuh = subuhTime.split(':')[0];
        var prayerHoursDuhur = duhurTime.split(':')[0];
        var prayerHoursAshar = asharTime.split(':')[0];
        var prayerHoursMagrib = MagribTime.split(':')[0];
        var prayerHoursIsya = IsyaTime.split(':')[0];


        if (today.getHours() >= prayerHoursSubuh) {
            var prayerHoursSubuh = Number(subuhTime.split(':')[0]) + 24
        }
        // if (today.getHours() >= prayerHoursDuhur) {
        //     var prayerHoursDuhur = Number(duhurTime.split(':')[0]) + 24
        // }
        // if (today.getHours() >= prayerHoursAshar) {
        //     var prayerHoursAshar = Number(asharTime.split(':')[0]) + 24
        // }
        // if (today.getHours() >= prayerHoursMagrib) {
        //     var prayerHoursMagrib = Number(MagribTime.split(':')[0]) + 24
        // }
        // if (today.getHours() >= prayerHoursIsya) {
        //     var prayerHoursIsya = Number(IsyaTime.split(':')[0]) + 24
        // }
        console.log('today hour ', prayerHoursDuhur + ' ' + prayerHoursAshar)
        console.log('today hour ', todayHour)
        if (todayHour > Number(prayerHoursIsya) && todayHour <= Number(prayerHoursSubuh)) {
            nextSolat = 'subuh'
        }
        else if (todayHour > Number(prayerHoursSubuh) && todayHour <= Number(prayerHoursDuhur)) {
            nextSolat = 'duhur'
        }
        else if (todayHour > Number(prayerHoursDuhur) && todayHour <= Number(prayerHoursAshar)) {
            nextSolat = 'ashar'
        }
        else if (todayHour > Number(prayerHoursAshar) && todayHour <= Number(prayerHoursMagrib)) {
            nextSolat = 'magrib'
        }
        else if (todayHour > Number(prayerHoursMagrib) && todayHour <= Number(prayerHoursIsya)) {
            nextSolat = 'isya'
        }

        console.log('nextSolat ', nextSolat)

    }

    NextPrayerTime2(fajr, dhuhr, asr, maghrib, isy) {
        let nextSolat;
        let nextSolatTime;
        console.log(fajr + dhuhr + asr + maghrib + isy)

        var today = new Date();
        var prayerTimeDateSubuh = new Date();
        var prayerTimeDateDuhur = new Date();
        var prayerTimeDateAshar = new Date();
        var prayerTimeDateMagrib = new Date();
        var prayerTimeDateIsya = new Date();

        // today.setHours('19')
        // today.setMinutes('00')

        var prayerHoursSubuh = fajr.split(':')[0];
        var prayerMinSubuh = fajr.split(':')[1];
        // if (today.getHours() >= prayerHoursSubuh) {
        //     prayerTimeDateSubuh.setDate(today.getDate() + 1);
        // }
        prayerTimeDateSubuh.setHours(prayerHoursSubuh);
        prayerTimeDateSubuh.setMinutes(prayerMinSubuh);

        var prayerHoursDuhur = dhuhr.split(':')[0];
        var prayerMinDuhur = dhuhr.split(':')[1];
        prayerTimeDateDuhur.setHours(prayerHoursDuhur);
        prayerTimeDateDuhur.setMinutes(prayerMinDuhur);

        var prayerHoursAshar = asr.split(':')[0];
        var prayerMinAshar = asr.split(':')[1];
        prayerTimeDateAshar.setHours(prayerHoursAshar);
        prayerTimeDateAshar.setMinutes(prayerMinAshar);

        var prayerHoursMagrib = maghrib.split(':')[0];
        var prayerMinMagrib = maghrib.split(':')[1];
        prayerTimeDateMagrib.setHours(prayerHoursMagrib);
        prayerTimeDateMagrib.setMinutes(prayerMinMagrib);
        console.log('prayerTimeDateMagrib ', prayerTimeDateMagrib)

        var prayerHoursIsya = isy.split(':')[0];
        var prayerMinIsya = isy.split(':')[1];
        if (today.getHours() >= prayerHoursIsya) {
            prayerTimeDateSubuh.setDate(today.getDate() + 1);
        }
        prayerTimeDateIsya.setHours(prayerHoursIsya);
        prayerTimeDateIsya.setMinutes(prayerMinIsya);
        console.log('prayerTimeDateIsya ', prayerTimeDateIsya)
        console.log('today, ', today)
        console.log('prayerTimeDateSubuh, ', prayerTimeDateSubuh)
        if ((today > prayerTimeDateIsya && today <= prayerTimeDateSubuh) || today <= prayerTimeDateSubuh) {
            if (today > prayerTimeDateMagrib && today <= prayerTimeDateIsya) {
                nextSolat = 'ISYA'
                nextSolatTime = isy
            }
            else {
                nextSolat = 'SUBUH'
                nextSolatTime = fajr
            }
        }
        else if (today <= prayerTimeDateDuhur && today > prayerTimeDateSubuh) {
            nextSolat = 'DUHUR'
            nextSolatTime = dhuhr
        }
        else if (today > prayerTimeDateDuhur && today <= prayerTimeDateAshar) {
            nextSolat = 'ASHAR'
            nextSolatTime = asr
        }
        else if (today > prayerTimeDateAshar && today <= prayerTimeDateMagrib) {
            nextSolat = 'MAGRIB'
            nextSolatTime = maghrib
        }
        // else if (today > prayerTimeDateMagrib && today <= prayerTimeDateIsya) {
        //     nextSolat = 'ISYA'
        //     nextSolatTime = isy
        // }

        console.log('nextSolat ', nextSolat + ' ' + nextSolatTime)
        const testFirst = new this.PrayerTimeLeft(nextSolatTime);
        console.log("First: " + testFirst.getDiffString());

        this.setState({ pray: { name: nextSolat, time: nextSolatTime, timeLeft: testFirst.getDiffString() }, isBoxInfoSolat: false, isBoxInfoSolatFetchGps: true })

    }

    PrayerTimeLeft(prayerTime) {
        var today = new Date();
        var prayerTimeDate = new Date();

        var setPrayerTime = function () {
            var prayerHours = prayerTime.split(':')[0];
            var prayerMin = prayerTime.split(':')[1];
            if (today.getHours() >= prayerHours) {
                prayerTimeDate.setDate(today.getDate() + 1);
            }
            prayerTimeDate.setHours(prayerHours);
            prayerTimeDate.setMinutes(prayerMin);
        };

        var getDiffInMins = function () {
            return (prayerTimeDate - today) / 1000 / 60;
        };

        var getDiffMins = function () {
            return Math.round(getDiffInMins() % 60);
        };

        var getDiffHrs = function () {
            return Math.floor(getDiffInMins() / 60);
        };

        var getDiffString = function () {
            if (getDiffHrs() == 24 || getDiffHrs() == 0) {
                // return "0" + ":" + getDiffMins();
                return getDiffMins() + " menit";
            } else {
                return getDiffHrs() + " jam " + getDiffMins() + " menit"
            }
        };

        setPrayerTime();

        return {
            getDiffInMins: getDiffInMins,
            getDiffMins: getDiffMins,
            getDiffHrs: getDiffHrs,
            getDiffString: getDiffString

        };
    }

    goToProfile = () => {
        this.props.navigator.push({
            screen: "cheria-holidays.Profile",
            title: "Profile",
            passProps: {},
            navigatorStyle: {},
            animationType: 'fade',
            navigatorStyle: {
                navBarTextColor: "#ffffff",
                navBarBackgroundColor: '#2BB04C',
                navBarTextFontFamily: 'EncodeSans-Medium',
                navBarButtonColor: '#fff',
                tabBarHidden: true,
            }
        })
    }

    omMenuClick = (nameScreen, titleScreen) => {
        this.props.navigator.showModal({
            screen: nameScreen,
            title: titleScreen,
            animationType: 'fade',
            navigatorStyle: {
                navBarTextColor: "#ffffff",
                navBarBackgroundColor: '#2BB04C',
                navBarTextFontFamily: 'EncodeSans-Medium',
                navBarButtonColor: '#fff'
            }
        })
    }

    // itemSelectedHandler = key => {
    //     // console.log('this.props', this.props)

    //     // if (key.cat_tours != undefined) {
    //     this.props.navigator.push({
    //         screen: "cheria-holidays.TourPackage",
    //         title: key.name,
    //         passProps: {
    //             tourcontent: key.cat_tours,
    //             tourtitle: key.name,
    //             tourid: key.cat_tours[0].category
    //         },
    //     });
    //     // } else {
    //     //     //  ke halaman region
    //     //     Promise.all([
    //     //         FontAwesome.getImageSource("filter", 24, '#3EBA49'),
    //     //     ]).then(sources => {

    //     //         this.props.navigator.push({
    //     //             screen: "cheria-holidays.TourPackage",
    //     //             title: key.name,
    //     //             passProps: {
    //     //                 tourcontent: key.reg_tours,
    //     //                 tourtitle: key.name,
    //     //                 tourid: key.reg_tours[0].category
    //     //             },
    //     // navigatorButtons: {
    //     //     rightButtons: [
    //     //         {
    //     //             id: 'filter',
    //     //             icon: sources[0],

    //     //         },
    //     //     ]
    //     // }
    //     // navigatorStyle: {
    //     //     navBarCustomView: 'cheria-holidays.CustomNavBar',
    //     // }

    //     //     })
    //     // })
    //     // }
    // };
    // itemSelectedHandlerRegion = key => {

    //     //  ke halaman region
    //     this.props.navigator.push({
    //         screen: "cheria-holidays.TourPackage",
    //         title: key.name,
    //         passProps: {
    //             tourcontent: key.reg_tours,
    //             tourtitle: key.name,
    //             tourid: key.reg_tours[0].category
    //         },

    //         // navigatorButtons: {
    //         //     rightButtons: [
    //         //         {
    //         //             id: 'filter',
    //         //             icon: sources[0],

    //         //         },
    //         //     ]
    //         // }
    //         // navigatorStyle: {
    //         //     navBarCustomView: 'cheria-holidays.CustomNavBar',
    //         // }

    //     })


    // };


    // onKategoriPressed = () => {
    //     console.log('kategori')
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
    //             console.log('data category: ', parsedRes);
    //             this.setState({ tours: parsedRes })
    //         });
    // }

    // onRegionPressed = () => {
    //     console.log('region')
    //     let url = "https://travelfair.co/api/region/";
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
    //             console.log('data category: ', parsedRes);
    //             this.setState({ tours: parsedRes })
    //         });
    // }

    // renderRegion() {
    //     if (this.state.isLoading) {
    //         return (
    //             <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    //                 <ActivityIndicator size="large" color="#FF9D00" />
    //                 <Text style={{ paddingTop: 10 }}>Loading ...</Text>
    //             </View>
    //         )
    //     } else {
    //         return (

    //             <TourListRegions
    //                 tours={this.state.toursRegion}
    //                 onItemSelected={this.itemSelectedHandlerRegion}
    //             />

    //         )
    //     }
    // }

    // renderMain() {
    //     if (this.state.isLoading) {
    //         return (
    //             <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    //                 <ActivityIndicator size="large" color="#FF9D00" />
    //                 <Text style={{ paddingTop: 10 }}>Loading ...</Text>
    //             </View>
    //         )
    //     } else {
    //         return (

    //             <TourListCategory
    //                 tours={this.state.tours}
    //                 onItemSelected={this.itemSelectedHandler}
    //             />

    //         )
    //     }
    // }

    render() {
        let boxLogin = null
        let boxProfile = null
        let boxInfoSolat = null

        if (this.state.isBoxLogin) {
            boxLogin = (
                <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 11, paddingVertical: 17, backgroundColor: '#fff' }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ width: '80%', flexDirection: 'row', alignItems: 'center' }}>
                            <Ico name="user-shape" size={20} color='#757575' />
                            <View style={{ width: '100%', marginLeft: 14 }}>
                                <TextSemiBold style={{ color: '#404040', fontSize: 14 }}>Login or register</TextSemiBold>
                                <TextNormal style={{ color: '#757575', fontSize: 14 }}>Enjoy your Halal Traveler member benefits!</TextNormal>
                            </View>
                        </View>
                        <Menu >
                            <MenuTrigger>
                                <MaterialIcons size={30} color="#C4C4C4" name="more-vert" />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={this.goToProfile} >
                                    <TextNormal style={{ color: '#404040', fontSize: 14 }}>Profile</TextNormal>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>
                    </View>
                </View>
            )
        }

        if (this.state.isBoxProfile) {
            // console.log(this.props.point)
            boxProfile = (
                <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 11, paddingVertical: 17, backgroundColor: '#fff' }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 0 }}>
                        <View style={{ width: '80%', flexDirection: 'row', alignItems: 'center' }}>
                            <Ico name="user-shape" size={20} color='#757575' />
                            <View style={{ width: '100%', marginLeft: 14 }}>
                                <TextSemiBold style={{ color: '#404040', fontSize: 14 }}>{this.props.profile !== null ? this.props.profile.email : null}</TextSemiBold>
                                {/* <TextNormal style={{ color: '#757575', fontSize: 14 }}>Enjoy your Halal Traveler member benefits!</TextNormal> */}
                                <View style={{ backgroundColor: '#EEEEEE', width: '50%', paddingHorizontal: 13, paddingVertical: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 5, marginTop: 8 }}>
                                    <TextNormal style={{ color: '#474747', fontSize: 12 }}>My points   {this.props.point}</TextNormal>
                                </View>
                            </View>
                        </View>
                        {/* <Text>yaya</Text> */}

                        <Menu >
                            <MenuTrigger>
                                <MaterialIcons size={30} color="#C4C4C4" name="more-vert" />
                            </MenuTrigger>
                            <MenuOptions>
                                <MenuOption onSelect={this.goToProfile} >
                                    <TextNormal style={{ color: '#404040', fontSize: 14 }}>Profile</TextNormal>
                                </MenuOption>
                            </MenuOptions>
                        </Menu>

                    </View>
                </View >
            )
        }

        if (this.state.isBoxInfoSolat) {
            boxInfoSolat = (

                <ImageBackground source={require('../../assets/mosque.jpg')} style={{ width: Dimensions.get('window').width, height: 145 }} >
                    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 0, borderColor: '#ffffff', backgroundColor: 'rgba(62, 186, 73, 0.46)', justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#fff" />
                        {/* <MaterialIcons name='refresh' size={30} color='#7a7a7a' /> */}
                    </View>
                </ImageBackground>
            )
        } else {
            if (this.state.isBoxInfoSolatFetchGps) {
                let shareJadwal = {
                    title: "Jadwal Solat Hari ini",
                    message: "Jadwal Solat Hari ini " + this.state.date.masehi + " " + this.state.city + "\n"
                        + "\nSubuh : " + this.state.jadwal.data.timings.Fajr + "\nDzuhur : " + this.state.jadwal.data.timings.Dhuhr + "\nAshar : " + this.state.jadwal.data.timings.Asr + "\nMaghrib : " + this.state.jadwal.data.timings.Maghrib + "\nIsya : " + this.state.jadwal.data.timings.Isha + "\n"
                        + "\nDownload aplikasi Halal Traveler"
                    ,
                    // urls: [halal],
                    url: "http://bit.ly/2GjvWuC",
                    // subject: "Share Link" //  for email
                    // social: Share.Social.WHATSAPP
                };
                boxInfoSolat = (
                    // <ImageBackground resizeMode="cover" source={{ uri: info.item.img }} style={styles.placeImage} imageStyle={{ borderRadius: 20, }} ></ImageBackground>
                    <ImageBackground source={require('../../assets/mosque.jpg')} style={{ width: Dimensions.get('window').width, height: 145 }} >
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 0, borderColor: '#ffffff', backgroundColor: 'rgba(62, 186, 73, 0.46)' }}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, paddingHorizontal: 16 }}>
                                <View style={{ width: '33%', }}>
                                    <TextSemiBold style={{ color: '#ffffff', fontSize: 11 }}>{this.state.date.masehi}</TextSemiBold>
                                    <View style={{ borderBottomWidth: 1, borderBottomColor: '#fff', width: '100%' }} />
                                    <TextSemiBold style={{ color: '#ffffff', fontSize: 11 }}>{this.state.date.hijri} Hijriah</TextSemiBold>
                                </View>
                                <TextSemiBold style={{ color: '#ffffff', fontSize: 11, width: '33%', textAlign: 'center' }}>{this.state.pray.name}</TextSemiBold>
                                <TextSemiBold style={{ color: '#ffffff', fontSize: 11, width: '33%', textAlign: 'right' }}>{this.state.city}</TextSemiBold>
                            </View>
                            <View style={{ width: '100%', justifyContent: 'center', marginTop: 5, alignItems: 'center' }}>
                                <TextSemiBold style={{ color: '#fff', fontSize: 40 }}>{this.state.pray.time}</TextSemiBold>
                                <TextSemiBold style={{ color: '#fff', fontSize: 14, marginTop: 5 }}>{this.state.pray.timeLeft}</TextSemiBold>
                            </View>
                            <View style={{ width: '100%', alignItems: 'flex-end', paddingHorizontal: 16, paddingBottom: 5 }}>
                                <TouchableOpacity onPress={() => { Share.open(shareJadwal) }} >
                                    <MaterialIcons name='share' size={20} color='#fff' />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </ImageBackground>
                )
            }
            else {
                boxInfoSolat = (

                    <ImageBackground source={require('../../assets/mosque.jpg')} style={{ width: Dimensions.get('window').width, height: 145 }} >
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderWidth: 0, borderColor: '#ffffff', backgroundColor: 'rgba(62, 186, 73, 0.46)', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => this.fetchLocation()} >
                                <MaterialIcons name='refresh' size={30} color='#fff' />
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                )
            }
        }

        // if (this.state.isLoading) {
        //     return (
        //         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        //             <ActivityIndicator size="large" color="#FF9D00" />
        //             <Text style={{ paddingTop: 10 }}>Loading ...</Text>
        //         </View>
        //     )
        // } else {


        return (
            <MenuProvider>
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
                        {/* box panel jam info solat*/}
                        {boxInfoSolat}
                        {/* box menu  */}
                        <View style={{ width: Dimensions.get('window').width, marginTop: 45, paddingHorizontal: 22 }} >
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', paddingHorizontal: 5 }} >
                                <View >
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', borderWidth: 0 }} onPress={() => this.omMenuClick('cheria-holidays.JadwalSolat', 'Jadwal Sholat')}>
                                        <Image source={require('../../assets/iconMenu/masjid.png')} resizeMode='contain' style={{ height: 73, width: 73 }} />
                                        <TextNormal style={{ color: '#2BB04C', fontSize: 12, marginTop: 3 }}>Jadwal Sholat</TextNormal>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderRightWidth: 1, height: 57, borderColor: '#E3E5E5' }} />
                                <View >
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.omMenuClick('cheria-holidays.Geolocation', 'Kiblat Sholat')}>
                                        <Image source={require('../../assets/iconMenu/kiblat.png')} resizeMode='contain' style={{ height: 73, width: 73 }} />
                                        <TextNormal style={{ color: '#2BB04C', fontSize: 12, marginTop: 3 }}>Kiblat</TextNormal>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderRightWidth: 1, height: 57, borderColor: '#E3E5E5' }} />
                                <View >
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.omMenuClick('cheria-holidays.PetaMasjid', 'Lokasi Masjid')} >
                                        <Image source={require('../../assets/iconMenu/islamic-mosque.png')} resizeMode='contain' style={{ height: 73, width: 73 }} />
                                        <TextNormal style={{ color: '#2BB04C', fontSize: 12, marginTop: 3 }}>Masjid</TextNormal>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', paddingHorizontal: 15 }}>
                                <View style={{ borderBottomWidth: 1, width: 50, borderColor: '#E3E5E5' }} />
                                <View />
                                <View style={{ borderBottomWidth: 1, width: 50, borderColor: '#E3E5E5' }} />
                                <View />
                                <View style={{ borderBottomWidth: 1, width: 50, borderColor: '#E3E5E5' }} />
                            </View>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: "center", justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 5 }} >
                                <View >
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.omMenuClick('cheria-holidays.PetaRestoran', 'Restoran Halal')}  >
                                        <Image source={require('../../assets/iconMenu/resto.png')} resizeMode='contain' style={{ height: 73, width: 73 }} />
                                        <TextNormal style={{ color: '#2BB04C', fontSize: 12, marginTop: 3 }}>Restoran</TextNormal>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderRightWidth: 1, height: 57, borderColor: '#E3E5E5' }} />
                                <View >
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.omMenuClick("cheria-holidays.RequestTour", "Request Tour")}  >
                                        <Image source={require('../../assets/iconMenu/request.png')} resizeMode='contain' style={{ height: 73, width: 73 }} />
                                        <TextNormal style={{ color: '#2BB04C', fontSize: 12, marginTop: 3 }}>Request</TextNormal>
                                    </TouchableOpacity>
                                </View>
                                <View style={{ borderRightWidth: 1, height: 57, borderColor: '#E3E5E5' }} />
                                <View >
                                    <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center' }} onPress={() => this.omMenuClick("cheria-holidays.CategoryTour", "Kategori Tour")}  >
                                        <Image source={require('../../assets/iconMenu/airplane.png')} resizeMode='contain' style={{ height: 73, width: 73 }} />
                                        <TextNormal style={{ color: '#2BB04C', fontSize: 12, marginTop: 3 }}>Tujuan Wisata</TextNormal>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {/* box request dan order */}
                        {/* <View style={{ width: Dimensions.get('window').width, marginTop: 20, paddingHorizontal: 10 }} >
                            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableOpacity style={{ paddingVertical: 35, width: '48%', alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: '#2BB04C' }} onPress={() => this.omMenuClick("cheria-holidays.PaymentRecord", "Pembelian / Pembayaran")}>
                                    <Ico name='invoice' size={30} color='#fff' />
                                    <TextNormal style={{ color: '#fff', fontSize: 12, marginTop: 2 }}>Pembelian / Pemesanan</TextNormal>
                                </TouchableOpacity>
                                <TouchableOpacity style={{ paddingVertical: 35, width: '48%', alignItems: 'center', justifyContent: 'center', borderRadius: 5, backgroundColor: '#2BB04C' }} onPress={() => this.omMenuClick("cheria-holidays.RequestTour", "Request Tour")} >
                                    <Ico name='story' size={30} color='#fff' />
                                    <TextNormal style={{ color: '#fff', fontSize: 12, marginTop: 2 }}>Request Tour</TextNormal>
                                </TouchableOpacity>
                            </View>
                        </View> */}

                        {/* pilih region */}
                        {/* <View style={{ width: Dimensions.get('window').width, marginTop: 20 }} >
                                <TextSemiBold style={{ color: '#404040', fontSize: 18, paddingLeft: 10 }}>Region Area</TextSemiBold>
                                <TextNormal style={{ color: '#404040', fontSize: 14, paddingLeft: 10, marginBottom: 10 }}>Pilih Tujuan Wisata berdasarkan ketentuan</TextNormal>
                                {this.renderRegion()}
                            </View> */}
                        {/* pilih kategori */}
                        {/* <View style={{ width: Dimensions.get('window').width, marginTop: 20 }} >
                                <TextSemiBold style={{ color: '#404040', fontSize: 18, paddingLeft: 10 }}>Kategori</TextSemiBold>
                                <TextNormal style={{ color: '#404040', fontSize: 14, paddingLeft: 10, marginBottom: 10 }}>Pilih Tujuan Wisata berdasarkan ketentuan</TextNormal>
                                {this.renderMain()}
                            </View> */}
                    </View>
                </ScrollView >
            </MenuProvider>
        )
    };
    // }
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

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);


