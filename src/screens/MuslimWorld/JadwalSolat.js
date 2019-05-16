import React, { Component } from 'react';
import { connect } from "react-redux";
import {
    View, Text, AsyncStorage, ActivityIndicator, StyleSheet, ScrollView, Modal, TouchableOpacity, TextInput, Alert, FlatList,
    BackHandler, DeviceEventEmitter, Dimensions, Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import ProgressiveImage from "../../components/UI/ProgressiveImage/ProgressiveImage"
import { TextSemiBold, TextNormal, TextMedium } from '../../components/UI/TextCustom/TextCustom';
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { requestLokasi, requestLokasiGoogle } from '../../store/actions/muslimAction';
import Share, { ShareSheet, Button } from 'react-native-share';

import firebase from 'react-native-firebase';
import type { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';
import BackgroundJob from "react-native-background-job";

const waktuDzuhurKey = "waktuDzuhurKey";
// console.log('ya kepanggil')

BackgroundJob.register({
    jobKey: waktuDzuhurKey,
    // job: () => console.log(`Background Job fired!. Key = ${regularJobKey}`)
    job: () => aktifWaktuDzuhur()
});

// const aktifWaktuDzuhur = () => {
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
//     firebase.notifications()
//         .displayNotification(localNotification)
//         .catch(err => console.error('notification error', err));
//     return Promise.resolve();
// }

class JadwalSolat extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    state = {
        latitude: null,
        longitude: null,
        error: null,
        jadwal: null,
        isLoading: true,
        modalVisibleJadwalDua: false,
        kota: null,
        hasilKota: null,
        modalVisible: false,
        isBoxJadwal: true
    };

    onNavigatorEvent(event) {
        if (event.id === 'backPress') {
            //Do your thing
            // console.log("back button")
            // LocationServicesDialogBox.stopListener();
            // this.props.navigator.dismissAllModals({
            //     animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
            // });
            // return true
        }
        switch (event.id) {

            // case 'didAppear':
            //     // this.componentWillMount()
            //     if (this.state.latitude == null && this.state.longitude == null) {
            //         this.aktifJadwal()
            //         // this.notifikasiSchedule()
            //         console.log('jadwal aktif')
            //     } else {
            //         console.log('jadwal tidak perlu aktif')
            //     }
            //     break;
            // case 'didDisappear':
            //     // this.componentWillUnmount()
            //     console.log("jadwal dead")
            //     break;
        }
    }

    // componentWillReceiveProps(props) {
    //     console.log(props)
    //     if (props.lokasi !== null) {
    //         // let lokaiKota = props.lokasi.city
    //         this.setState({ kota: props.lokasi.city })
    //     }
    // }

    componentWillMount = async () => {
        // this.aktifJadwal()
        var that = this;

        Promise.all([
            latitude = await AsyncStorage.getItem('ap:latitude').then((value) => {
                return value
            }),
            longitude = await AsyncStorage.getItem('ap:longitude').then((value) => {
                return value
            })
        ]).then(function (values) {
            console.log('latitude', values[0]);
            console.log('longitude', values[1]);
            if (values[0] == null && values[1] == null) {
                that.aktifJadwal()
                // this.notifikasiSchedule()
                console.log('jadwal aktif')
            } else {
                console.log('jadwal tidak perlu aktif')
                that.props.onSetLokasiGoogle(values[0], values[1]).then(response => {
                    console.log('onSetLokasiGoogle ', response)
                    if (!that.props.isLoading) {
                        const results = response.results;
                        for (var i = 0; i < results.length; i++) {

                            if (results[i].types[0] === "locality") {
                                that.dataJadwalSholat(values[0], values[1])
                                that.setState({ kota: results[i].address_components[0].short_name })

                                console.log("ini ", (results[i].address_components[0].short_name).toLowerCase())
                            }
                            else if (results[i].types[0] === "administrative_area_level_2") {
                                that.dataJadwalSholat(values[0], values[1])
                                that.setState({ kota: results[i].address_components[0].short_name })
                            }
                        }
                    }
                })
                    .catch(err => {
                        Alert.alert(`${err}`, `Silahkan coba kembali`,
                            [
                                { text: 'OK', onPress: () => that.setState({ isBoxJadwal: true, isLoading: false }) },
                            ]);
                        // console.log('error fetchLocation, ', err)
                        // console.error('error fetchLocation, ', err)
                        // throw err;
                    })
            }
        });

    }

    fetchLatlon = async () => {
        const latitude = await AsyncStorage.getItem('ap:latitude').then((value) => {
            console.log(value)
            return value
        })

    }

    componentWillUnmount() {
        // used only when "providerListener" is enabled
        LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
        // this.aktifJadwal()
    }


    dzuhurSchedule(timeSolat) {
        console.log(timeSolat)

        var dt = new Date();
        var secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        console.log(secs)

        var dzuhur = '14:40';   // your input string
        var arrDzuhur = dzuhur.split(':'); // split it at the colons

        // minutes are worth 60 seconds. Hours are worth 60 minutes.
        var secondsDzuhur = (+arrDzuhur[0]) * 60 * 60 + (+arrDzuhur[1]) * 60;

        var result = (secondsDzuhur - secs) * 1000
        if (result <= 0) {
            console.log('ya', result)
            var result = 86400000 + (result)
        }
        console.log(result)

        const date = new Date();
        date.setSeconds(date.getSeconds() + result);
        console.log(date.getTime())
        BackgroundJob.schedule({
            jobKey: "waktuDzuhurKey",
            period: 5000,
            exact: true,
            timeout: 3000,
            allowExecutionInForeground: true,
        });
    }

    notifikasiScheduleSubuh = async (subuh) => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
            console.log(enabled, "ya")
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
                console.log(enabled, "ya")
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }
        const channelDevice = await AsyncStorage.getItem('ap:channelDevice').then((value) => {
            // console.log(value)
            return value
        })
        console.log('channelDevice, ', channelDevice.toString())
        const channels = new firebase.notifications.Android.Channel(
            channelDevice.toString(),
            'Channel personal',
            firebase.notifications.Android.Importance.Max
        ).setDescription('Notif jadwal salat');
        firebase.notifications().android.createChannel(channels);

        var dt = new Date();
        var secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        console.log(secs)

        var subuh = subuh.toString();
        console.log(subuh)
        var arrSubuh = subuh.split(':');
        var secondsSubuh = (+arrSubuh[0]) * 60 * 60 + (+arrSubuh[1]) * 60;
        var resultSubuh = secondsSubuh - secs
        if (resultSubuh <= 0) {
            console.log('subuh minus', resultSubuh)
            var resultSubuh = 86400 + (resultSubuh)
        }
        console.log('hasil akhir subuh', resultSubuh)
        const dateSubuh = new Date();
        dateSubuh.setSeconds(dateSubuh.getSeconds() + resultSubuh);
        // dateSubuh.setSeconds(dateSubuh.getSeconds() + 5);
        console.log(dateSubuh.getTime())

        const localNotificationSubuh = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
            show_in_background: true
        })
            .setNotificationId('id_subuh')
            .setTitle('Waktunya solat')
            .setSubtitle('subuh')
            .setBody('Mari laksanakan solat Subuh')
            .android.setChannelId(channelDevice.toString()) // e.g. 
            .android.setSmallIcon('ic_notif_new') // create this icon in Android Studio
            .android.setColor('#3EBA49') // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
            .scheduleNotification(localNotificationSubuh, {
                exact: true,
                fireDate: dateSubuh.getTime(),
                repeatInterval: 'day',
            })
            .catch(err => console.error(err));
    }

    notifikasiScheduleDzuhur = async (dzuhur) => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
            console.log(enabled, "ya")
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
                console.log(enabled, "ya")
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }
        const channelDevice = await AsyncStorage.getItem('ap:channelDevice').then((value) => {
            console.log(value)
            return value
        })
        console.log(channelDevice)
        const channels = new firebase.notifications.Android.Channel(
            channelDevice.toString(),
            'Channel personal',
            firebase.notifications.Android.Importance.Max
        ).setDescription('Notif jadwal salat');
        firebase.notifications().android.createChannel(channels);

        var dt = new Date();
        var secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        console.log(secs)

        var dzuhur = dzuhur.toString();
        console.log(dzuhur)
        var arrDzuhur = dzuhur.split(':');
        var secondsDzuhur = (+arrDzuhur[0]) * 60 * 60 + (+arrDzuhur[1]) * 60;
        var resultDzuhur = secondsDzuhur - secs
        if (resultDzuhur <= 0) {
            console.log('dzuhur minus', resultDzuhur)
            var resultDzuhur = 86400 + (resultDzuhur)
        }
        console.log('hasil akhir dzuhur', resultDzuhur)
        const dateDzuhur = new Date();
        dateDzuhur.setSeconds(dateDzuhur.getSeconds() + resultDzuhur);
        // dateDzuhur.setSeconds(dateDzuhur.getSeconds() + 10);
        console.log(dateDzuhur.getTime())

        const localNotificationDzuhur = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
            show_in_background: true
        })
            .setNotificationId('id_dzuhur')
            .setTitle('Waktunya solat')
            .setBody('Mari laksanakan solat Dzuhur')
            .android.setChannelId(channelDevice.toString()) // e.g. 
            .android.setSmallIcon('ic_notif_new') // create this icon in Android Studio
            .android.setColor('#3EBA49') // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
            .scheduleNotification(localNotificationDzuhur, {
                exact: true,
                fireDate: dateDzuhur.getTime(),
                repeatInterval: 'day',
            })
            .catch(err => console.error(err));
    }

    notifikasiScheduleAshar = async (ashar) => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
            console.log(enabled, "ya")
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
                console.log(enabled, "ya")
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }
        const channelDevice = await AsyncStorage.getItem('ap:channelDevice').then((value) => {
            console.log(value)
            return value
        })
        console.log(channelDevice)
        const channels = new firebase.notifications.Android.Channel(
            channelDevice.toString(),
            'Channel personal',
            firebase.notifications.Android.Importance.Max
        ).setDescription('Notif jadwal salat');
        firebase.notifications().android.createChannel(channels);

        var dt = new Date();
        var secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        console.log(secs)

        var ashar = ashar.toString();
        console.log(ashar)
        var arrAshar = ashar.split(':');
        var secondsAshar = (+arrAshar[0]) * 60 * 60 + (+arrAshar[1]) * 60;
        var resultAshar = secondsAshar - secs
        if (resultAshar <= 0) {
            console.log('ashar minus', resultAshar)
            var resultAshar = 86400 + (resultAshar)
        }
        console.log('hasil akhir ashar', resultAshar)
        const dateAshar = new Date();
        dateAshar.setSeconds(dateAshar.getSeconds() + resultAshar);
        console.log(dateAshar.getTime())

        const localNotificationAshar = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
            show_in_background: true
        })
            .setNotificationId('id_ashar')
            .setTitle('Waktunya solat')
            .setBody('Mari laksanakan solat Ashar')
            .android.setChannelId(channelDevice.toString()) // e.g. 
            .android.setSmallIcon('ic_notif_new') // create this icon in Android Studio
            .android.setColor('#3EBA49') // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
            .scheduleNotification(localNotificationAshar, {
                exact: true,
                fireDate: dateAshar.getTime(),
                repeatInterval: 'day',
            })
            .catch(err => console.error(err));
    }

    notifikasiScheduleMaghrib = async (magrib) => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
            console.log(enabled, "ya")
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
                console.log(enabled, "ya")
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }
        console.log(magrib)
        // let channelDevice;
        const channelDevice = await AsyncStorage.getItem('ap:channelDevice').then((value) => {
            console.log(value)
            return value
        })
        console.log(channelDevice)
        const channels = new firebase.notifications.Android.Channel(
            channelDevice.toString(),
            'Channel personal',
            firebase.notifications.Android.Importance.Max
        ).setDescription('Notif jadwal salat');
        firebase.notifications().android.createChannel(channels);

        var dt = new Date();
        var secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        console.log(secs)
        var magrib = magrib.toString();   // your input string
        var arrMagrib = magrib.split(':'); // split it at the colons
        var secondsMagrib = (+arrMagrib[0]) * 60 * 60 + (+arrMagrib[1]) * 60;
        var resultMagrib = secondsMagrib - secs
        if (resultMagrib <= 0) {
            console.log('magrib minus', resultMagrib)
            var resultMagrib = 86400 + (resultMagrib)
        }
        console.log('hasil akhir magrib', resultMagrib)
        const dateMagrib = new Date();
        dateMagrib.setSeconds(dateMagrib.getSeconds() + resultMagrib);
        console.log(dateMagrib.getTime())

        const localNotificationMagrib = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
            show_in_background: true
        })
            .setNotificationId('id_magrib')
            .setTitle('Waktunya solat')
            .setBody('Mari laksanakan solat Magrib')
            .android.setChannelId(channelDevice.toString()) // e.g. 
            .android.setSmallIcon('ic_notif_new') // create this icon in Android Studio
            .android.setColor('#3EBA49') // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
            .scheduleNotification(localNotificationMagrib, {
                exact: true,
                fireDate: dateMagrib.getTime(),
                repeatInterval: 'day',
            })
            .catch(err => console.error(err));
    }

    notifikasiScheduleIsya = async (isya) => {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
            console.log(enabled, "ya")
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
                console.log(enabled, "ya")
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }
        console.log(isya)
        // let channelDevice;
        const channelDevice = await AsyncStorage.getItem('ap:channelDevice').then((value) => {
            console.log(value)
            return value
        })
        console.log(channelDevice)
        const channels = new firebase.notifications.Android.Channel(
            channelDevice.toString(),
            'Channel personal',
            firebase.notifications.Android.Importance.Max
        ).setDescription('Notif jadwal salat');
        firebase.notifications().android.createChannel(channels);

        var dt = new Date();
        var secs = dt.getSeconds() + (60 * (dt.getMinutes() + (60 * dt.getHours())));
        console.log(secs)
        var isya = isya.toString();   // your input string
        var arrIsya = isya.split(':'); // split it at the colons
        var secondsIsya = (+arrIsya[0]) * 60 * 60 + (+arrIsya[1]) * 60;
        var resultIsya = secondsIsya - secs
        if (resultIsya <= 0) {
            console.log('isya minus', resultIsya)
            var resultIsya = 86400 + (resultIsya)
        }
        console.log('hasil akhir isya', resultIsya)
        const dateIsya = new Date();
        dateIsya.setSeconds(dateIsya.getSeconds() + resultIsya);
        console.log(dateIsya.getTime())

        const localNotificationIsya = new firebase.notifications.Notification({
            sound: 'default',
            show_in_foreground: true,
            show_in_background: true
        })
            .setNotificationId('id_isya')
            .setTitle('Waktunya solat')
            .setBody('Mari laksanakan solat Isya')
            .android.setChannelId(channelDevice.toString()) // e.g. 
            .android.setSmallIcon('ic_notif_new') // create this icon in Android Studio
            .android.setColor('#3EBA49') // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
            .scheduleNotification(localNotificationIsya, {
                exact: true,
                fireDate: dateIsya.getTime(),
                repeatInterval: 'day',
            })
            .catch(err => console.error(err));
    }

    aktifJadwal = () => {
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/>",
            ok: "YES",
            cancel: "NO",
            enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
            showDialog: true, // false => Opens the Location access page directly
            openLocationServices: true, // false => Directly catch method is called if location services are turned off
            preventOutSideTouch: false, //true => To prevent the location services popup from closing when it is clicked outside
            preventBackClick: false, //true => To prevent the location services popup from closing when it is clicked back button
            providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
        }).then(function (success) {
            // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
            navigator.geolocation.getCurrentPosition((position) => {
                let initialPosition = JSON.stringify(position);
                console.log("ini hasilnya", position.coords.longitude)
                this.setState({ longitude: position.coords.longitude, latitude: position.coords.latitude });
                // this.props.onSetLokasi(position.coords.latitude, position.coords.longitude).then(val => {
                //     if (!this.props.isLoading) {
                //         console.log(val)
                //         if (val.success !== false) {
                //             this.dataJadwalSholat()
                //             this.setState({ kota: val.city, staddress: val.staddress })
                //         } else {
                //             this.props.onSetLokasi(position.coords.latitude, position.coords.longitude).then(val => {
                //                 this.dataJadwalSholat()
                //                 this.setState({ kota: val.city, staddress: val.staddress })
                //             })
                //         }
                //     }
                // })
                this.props.onSetLokasiGoogle(position.coords.latitude, position.coords.longitude).then(response => {
                    console.log('onSetLokasiGoogle ', response)
                    if (!this.props.isLoading) {
                        const results = response.results;
                        for (var i = 0; i < results.length; i++) {

                            if (results[i].types[0] === "locality") {
                                this.dataJadwalSholat(position.coords.latitude, position.coords.longitude)
                                this.setState({ kota: results[i].address_components[0].short_name })

                                console.log("ini ", (results[i].address_components[0].short_name).toLowerCase())
                            }
                            else if (results[i].types[0] === "administrative_area_level_2") {
                                this.dataJadwalSholat(position.coords.latitude, position.coords.longitude)
                                this.setState({ kota: results[i].address_components[0].short_name })
                            }
                        }
                    }
                })
            }, error => {
                console.log(error)
                this.setState({ isBoxJadwal: true, isLoading: false })
                // this.aktifJadwal()
                // Alert.alert(
                //     'Lokasi tidak ditemukan',
                //     'Coba kembali',
                //     [
                //         { text: 'OK', onPress: () => this.props.navigator.dismissModal({ animationType: 'slide-down' }) },
                //     ],
                //     // { cancelable: false }
                // )
            }, { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 });
        }.bind(this)
        ).catch((error) => {
            Alert.alert(
                'Lokasi tidak ditemukan',
                'Coba kembali',
                [
                    // { text: 'OK', onPress: () => this.props.navigator.switchToTab({ tabIndex: 0 }) },
                    {
                        text: 'OK', onPress: () =>
                            this.props.navigator.dismissModal({
                                animationType: 'fade' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
                            })
                    },
                ],
                // { cancelable: false }
            )
            console.log(error.message);
        });

        DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
            if (status == "disabled") {
                alert("Harus mengaktifkan GPS");
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
                this.setState({ jadwal: parsedRes, isLoading: false, isBoxJadwal: false })
                navigator.geolocation.clearWatch(this.watchId);
                this.notifikasiScheduleSubuh(parsedRes.data.timings.Fajr)
                this.notifikasiScheduleDzuhur(parsedRes.data.timings.Dhuhr)
                this.notifikasiScheduleAshar(parsedRes.data.timings.Asr)
                this.notifikasiScheduleMaghrib(parsedRes.data.timings.Maghrib)
                this.notifikasiScheduleIsya(parsedRes.data.timings.Isha)
                // this.dzuhurSchedule(this.state.jadwal.data.timings.Asr)
            });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
    }

    onPressCari = () => {
        let url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + this.state.kota + "&types=(cities)&key=AIzaSyD20cuaN2i3qXq_vq7EwD8mhrayjCAA_-w";

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
                // var a = parsedRe
                console.log('hasilKota: ', parsedRes);
                this.setState({ hasilKota: parsedRes, isLoading: false })
            })
            .catch(err => Alert.alert("Error", err))
    }

    dataJadwalSholatUpdate = (kota) => {
        var arr = kota.description;
        var pisah = arr.split(",");
        var negara = pisah[pisah.length - 1]
        console.log("pencet Kota", kota.structured_formatting.main_text)

        let url = "http://api.aladhan.com/v1/timingsByCity?city=" + kota.structured_formatting.main_text + "&country=" + negara + "&method=5";

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
                this.setState({ jadwal: parsedRes, isLoading: false, modalVisibleJadwalDua: false })
                navigator.geolocation.clearWatch(this.watchId);

            })
            .catch(err => Alert.alert("Error", err))
    }

    listHasilKota() {
        console.log("ini hasil kotaa", this.state.hasilKota)
        if (this.state.hasilKota == null) {
            return (

                <Text style={{ paddingTop: 10 }}>Loading ...</Text>
            )
        } else {
            return (
                <ScrollView style={{ backgroundColor: 'white' }}>
                    {/* <Text> List Kota </Text> */}
                    <FlatList
                        // contentContainerStyle={}
                        data={this.state.hasilKota.predictions}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={(info) => {
                            console.log("info ", info)
                            return (
                                <TouchableOpacity onPress={() => this.dataJadwalSholatUpdate(info.item)}>
                                    <View style={{ marginTop: 10, borderBottomWidth: 1, paddingVertical: 10, justifyContent: 'space-between', marginHorizontal: 20 }} >
                                        <Text style={{ color: '#490E14' }}>{info.item.description}</Text>
                                    </View>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </ScrollView>

            )
        }
    }

    setModalVisible(visible) {
        this.setState({
            modalVisible: visible,
        })
    }

    render() {
        // console.log("ini latitude ", this.state.latitude)
        // console.log("ini latitude ", this.state.longitude)
        var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        var monthNames = ["01", "02", "03", "04", "05", "06",
            "07", "08", "09", "10", "11", "12"
        ];
        var currentToday = new Date();
        var dd = currentToday.getDate();
        // var mm = currentToday.getMonth() + 1; //January is 0!
        var yyyy = currentToday.getFullYear();

        if (dd < 10) {
            dd = '0' + dd
        }

        currentToday = day[currentToday.getDay()] + ', ' + dd + '-' + monthNames[currentToday.getMonth()] + '-' + yyyy;

        let boxJadwal = null

        if (this.state.isBoxJadwal) {
            boxJadwal = (
                <View style={{ width: '100%', backgroundColor: '#ffffff', borderWidth: 0.2, borderRadius: 5, padding: 10, marginBottom: 15, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                    <TouchableOpacity onPress={() => this.setState({ isLoading: true }, this.aktifJadwal())} >
                        <MaterialIcons name='refresh' size={30} color='#c4c4c4' />
                    </TouchableOpacity>
                </View>
            )
        } else {
            let shareJadwal = {
                title: "Jadwal Solat Hari ini",
                message: "Jadwal Solat Hari ini " + currentToday + " " + this.state.kota + "\n"
                    + "\nSubuh : " + this.state.jadwal.data.timings.Fajr + "\nDzuhur : " + this.state.jadwal.data.timings.Dhuhr + "\nAshar : " + this.state.jadwal.data.timings.Asr + "\nMaghrib : " + this.state.jadwal.data.timings.Maghrib + "\nIsya : " + this.state.jadwal.data.timings.Isha + "\n"
                    + "\nDownload aplikasi Halal Traveler"
                ,
                // urls: [halal],
                url: "http://bit.ly/2GjvWuC",
                // subject: "Share Link" //  for email
                // social: Share.Social.WHATSAPP
            };
            boxJadwal = (
                <View style={{ width: '100%', backgroundColor: '#ffffff', borderWidth: 0.2, borderRadius: 5, padding: 10, marginBottom: 15 }}>
                    {/* bagian atas */}
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', borderWidth: 0, justifyContent: 'space-between', marginBottom: 30 }}>
                        <View style={{ width: '52%', backgroundColor: '#3EBA49', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <MaterialIcons name='gps-fixed' size={15} color='#ffffff' style={{ width: '12.5%', paddingLeft: 5 }} />
                            <TextInput
                                underlineColorAndroid='transparent'
                                style={{ height: 38, width: '75%', paddingLeft: 8, color: '#ffffff', fontFamily: 'EncodeSans-SemiBold' }}
                                placeholder={this.state.kota}
                                placeholderTextColor={'#fff'}
                                returnKeyType={'go'}
                                value={this.state.kota}
                                onChangeText={val => this.setState({ kota: val })}
                                onSubmitEditing={() => {
                                    let url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + this.state.kota + "&types=(cities)&key=AIzaSyD20cuaN2i3qXq_vq7EwD8mhrayjCAA_-w";

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
                                            // var a = parsedRe
                                            console.log('hasilKota: ', parsedRes);
                                            this.setState({ hasilKota: parsedRes, isLoading: false, modalVisibleJadwalDua: true })
                                        })
                                        .catch(err => Alert.alert("Error", err))
                                }}
                            />
                            <MaterialIcons name='arrow-drop-down' size={25} color='#ffffff' style={{ width: '12.5%', paddingRight: 0 }} />
                        </View>
                        <View style={{ width: '45%', backgroundColor: '#ffffff', borderRadius: 5, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                            <View style={{}}>
                                <Text style={{ color: "#FF9D00" }}>{currentToday}</Text>
                                <Text style={{ color: "#FF9D00" }}>{this.state.jadwal.data.date.hijri.date} Hijriah</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 0, backgroundColor: '#FBFBFB', borderRadius: 3, justifyContent: 'space-between', marginBottom: 8 }}>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingLeft: 16, borderRightWidth: 1, paddingTop: 6, borderColor: '#EEEEEE' }}>Subuh</TextNormal>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingRight: 16, textAlign: 'right', paddingTop: 6 }}>{this.state.jadwal.data.timings.Fajr}</TextNormal>
                    </View>

                    <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 0, backgroundColor: '#FBFBFB', borderRadius: 3, justifyContent: 'space-between', marginBottom: 8 }}>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingLeft: 16, borderRightWidth: 1, paddingTop: 6, borderColor: '#EEEEEE' }}>Sunrise</TextNormal>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingRight: 16, textAlign: 'right', paddingTop: 6 }}>{this.state.jadwal.data.timings.Sunrise}</TextNormal>
                    </View>

                    <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 0, backgroundColor: '#FBFBFB', borderRadius: 3, justifyContent: 'space-between', marginBottom: 8 }}>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingLeft: 16, borderRightWidth: 1, paddingTop: 6, borderColor: '#EEEEEE' }}>Dzuhur</TextNormal>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingRight: 16, textAlign: 'right', paddingTop: 6 }}>{this.state.jadwal.data.timings.Dhuhr}</TextNormal>
                    </View>

                    <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 0, backgroundColor: '#FBFBFB', borderRadius: 3, justifyContent: 'space-between', marginBottom: 8 }}>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingLeft: 16, borderRightWidth: 1, paddingTop: 6, borderColor: '#EEEEEE' }}>Asar</TextNormal>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingRight: 16, textAlign: 'right', paddingTop: 6 }}>{this.state.jadwal.data.timings.Asr}</TextNormal>
                    </View>

                    <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 0, backgroundColor: '#FBFBFB', borderRadius: 3, justifyContent: 'space-between', marginBottom: 8 }}>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingLeft: 16, borderRightWidth: 1, paddingTop: 6, borderColor: '#EEEEEE' }}>Magrib</TextNormal>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingRight: 16, textAlign: 'right', paddingTop: 6 }}>{this.state.jadwal.data.timings.Maghrib}</TextNormal>
                    </View>

                    <View style={{ width: '100%', height: 40, flexDirection: 'row', alignItems: 'center', borderWidth: 0, backgroundColor: '#FBFBFB', borderRadius: 3, justifyContent: 'space-between' }}>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingLeft: 16, borderRightWidth: 1, paddingTop: 6, borderColor: '#EEEEEE' }}>Isya</TextNormal>
                        <TextNormal style={{ color: '#757575', fontSize: 16, width: '50%', height: 35, paddingRight: 16, textAlign: 'right', paddingTop: 6 }}>{this.state.jadwal.data.timings.Isha}</TextNormal>
                    </View>

                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                        <TouchableOpacity onPress={() => { Share.open(shareJadwal) }} >
                            <MaterialIcons name='share' size={25} color={'#C4C4C4'} />
                        </TouchableOpacity>
                    </View>

                </View>
            )
        }

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, backgroundColor: '#f6f6f6', }}>

                    <View style={{ width: deviceWidth, paddingHorizontal: 16, marginTop: 12 }}>
                        <View style={{ width: '100%', borderWidth: 0.1, borderRadius: 5, flexDirection: 'row', backgroundColor: '#ffffff' }}>
                            <View style={{ height: 73, margin: 6, borderWidth: 0, width: 73 }}>
                                {/* <ProgressiveImage resizeMode="contain" thumbnailSource={require('../../assets/adzan.png')} source={require('../../assets/adzan.png')} style={{ width: '100%', height: '100%', }} imageStyle={{}} /> */}
                                <Image resizeMode="contain" source={require('../../assets/adzanHalal.png')} style={{ width: '100%', height: '100%', }} imageStyle={{}} />
                            </View>
                            <View style={{ justifyContent: 'center', borderWidth: 0, width: '65%', paddingLeft: 15, margin: 6 }}>
                                <TextSemiBold style={{ color: "#2BB04C", fontSize: 20, marginBottom: 8 }}>Jadwal Sholat </TextSemiBold>
                                <TextNormal style={{ color: "#757575", fontSize: 14 }}>Informasi jadwal solat</TextNormal>
                            </View>
                        </View>
                    </View>

                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size="large" color="#FF9D00" />
                        <Text style={{ paddingTop: 10 }}>Loading ...</Text>
                    </View>
                </View>
            )
        } else {

            return (
                <ScrollView style={{ backgroundColor: '#f6f6f6' }} >
                    <View style={styles.listContainer}>

                        <View style={{ flex: 1 }}>
                            {/* panel atas */}
                            <View style={{ width: deviceWidth, paddingHorizontal: 16, marginTop: 12, marginBottom: 10 }}>
                                <View style={{ width: '100%', borderWidth: 0.1, borderRadius: 5, flexDirection: 'row', backgroundColor: '#ffffff' }}>
                                    <View style={{ height: 73, margin: 6, borderWidth: 0, width: 73 }}>
                                        {/* <ProgressiveImage resizeMode="contain" thumbnailSource={require('../../assets/adzan.png')} source={require('../../assets/adzan.png')} style={{ width: '100%', height: '100%', }} imageStyle={{}} /> */}
                                        <Image resizeMode="contain" source={require('../../assets/adzanHalal.png')} style={{ width: '100%', height: '100%', }} imageStyle={{}} />
                                    </View>
                                    <View style={{ justifyContent: 'center', borderWidth: 0, width: '65%', paddingLeft: 15, margin: 6 }}>
                                        <TextSemiBold style={{ color: "#2BB04C", fontSize: 20, marginBottom: 8 }}>Jadwal Sholat</TextSemiBold>
                                        <TextNormal style={{ color: "#757575", fontSize: 14 }}>Informasi jadwal solat</TextNormal>
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* panel tengah */}
                        <View style={{ width: deviceWidth, paddingHorizontal: 16, }}>
                            {boxJadwal}
                            <TextNormal style={{ color: '#757575', fontSize: 12, width: deviceWidth, paddingHorizontal: 10, paddingBottom: 3 }}>Sumber : aladhan.com</TextNormal>
                        </View>

                        {/* <View style={{ borderWidth: 1, borderRadius: 5, backgroundColor: "#f6f6f6", padding: 5, marginBottom: 0, alignItems: 'center', marginHorizontal: 0 }}> */}

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.modalVisibleJadwalDua}
                            onRequestClose={() => {
                                // Alert.alert('Modal has been closed.');
                                this.setState({ modalVisibleJadwalDua: false });
                            }}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.8)' }} />

                                {this.listHasilKota()}

                            </View>
                        </Modal>

                        {/* <Modal
                            animationType="fade"
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={() => { this.setModalVisible(false) }}
                        >
                            <TouchableOpacity
                                // style={styles.container}
                                style={{ flex: 1 }}
                                activeOpacity={1}
                                onPressOut={() => { this.setModalVisible(false) }}
                            >
                                <ScrollView
                                    directionalLockEnabled={true}
                                    contentContainerStyle={styles.scrollModal}
                                >
                                    <TouchableWithoutFeedback>
                                        <View style={styles.modalContainer}>
                                            <TextNormal>yellooo</TextNormal>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </ScrollView>
                            </TouchableOpacity>
                        </Modal> */}
                    </View >
                </ScrollView>
            )
        }
    }
}

// const LOGO_HALAL = 

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height
const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        backgroundColor: '#f6f6f6',
        // width: "100%",
        // flexDirection: 'column',
        justifyContent: 'space-between'
    },
    listItem: {
        margin: 0,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#f6f6f6',
        shadowColor: '#aaaaaa',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 3,
    },
    confirmText: {
        paddingHorizontal: 5,
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: "center",
        color: "white"

    }
})

const halal = "data:image/png;base64,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";

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading,
        lokasi: state.lokasi.lokasi
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onSetLokasi: (lat, lon) => dispatch(requestLokasi(lat, lon)),
        onSetLokasiGoogle: (lat, lon) => dispatch(requestLokasiGoogle(lat, lon))
        // checkLogin :()=>dispatch(setl)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JadwalSolat);