import React, { Component } from 'react';
import { connect } from "react-redux";
import {
    View, Text, AsyncStorage, ActivityIndicator, ScrollView, FlatList, TouchableOpacity, StyleSheet, Dimensions, WebView,
    Linking,
    TextInput,
    Alert,
    BackHandler, DeviceEventEmitter
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Row } from 'native-base';
import { PermissionsAndroid } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import ProgressiveImage from "../../components/UI/ProgressiveImage/ProgressiveImage"
import { TextSemiBold, TextNormal, TextMedium } from '../../components/UI/TextCustom/TextCustom';

class PetaRestoran extends Component {



    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }
    state = {
        isLoading: true,
        latitude: null,
        longitude: null,

        // latitude: -31.536408,
        // longitude: 78.666230,

        // latitude: -6.873705,
        // longitude: 107.553121,

        error: null,
        masjid: null,
        dataJarak: null,
        stats: null
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

            case 'didAppear':
                if (this.state.latitude == null && this.state.longitude == null) {
                    this.aktifPetaRestoran()
                    console.log("resto active")
                } else {
                    console.log("resto tidak perlu active")
                }
                break;
            case 'didDisappear':
                this.componentWillUnmount()
                console.log("resto dead")
                break;
        }
    }

    // componentWillMount() {
    //     this.aktifPetaRestoran()
    // }

    componentWillUnmount() {
        // used only when "providerListener" is enabled
        LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
    }

    aktifPetaRestoran = () => {
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
                this.dataPetaMasjid()
            }, error => {
                // Alert.alert(
                //     'Lokasi tidak ditemukan',
                //     'Coba kembali',
                //     [
                //         { text: 'OK', onPress: () => this.props.navigator.dismissAllModals({ animationType: 'slide-down' }) },
                //     ],
                //     // { cancelable: false }
                // )
                this.aktifPetaRestoran()
                console.log(error)
            }, { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
        }.bind(this)
        ).catch((error) => {
            Alert.alert(
                'Lokasi tidak ditemukan',
                'Coba kembali',
                [
                    { text: 'OK', onPress: () => this.props.navigator.switchToTab({ tabIndex: 0 }) },
                ],
                // { cancelable: false }
            )
            console.log(error.message);
        });

        DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
            if (status === "disabled") {
                alert("Harus mengaktifkan GPS");
            }
            console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
        });
    }

    dataPetaMasjid() {
        // let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + this.state.latitude + "," + this.state.longitude + "&radius=500&type=mosque&key=AIzaSyD20cuaN2i3qXq_vq7EwD8mhrayjCAA_-w";
        //https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-6.894484,107.629194&radius=1500&type=restaurant&keyword=halal&key=AIzaSyD20cuaN2i3qXq_vq7EwD8mhrayjCAA_-w
        let url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + this.state.latitude + "," + this.state.longitude + "&radius=1500&type=restaurant&keyword=halal&key=AIzaSyD20cuaN2i3qXq_vq7EwD8mhrayjCAA_-w";
        AsyncStorage.getItem("ap:auth:email").then((value) => {
            this.setState({ "email": value });
        })
            .then(res => {
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
                        console.log('masjid: ', parsedRes);
                        this.setState({ masjid: parsedRes, isLoading: false })
                    });

            })
            .catch(err => Alert.alert("Error", err))
    }

    onItemPressed = (masjid) => {
        console.log("ini latitude ", masjid.geometry.location.lat)
        console.log("https://www.google.com/maps/dir/?api=1&origin=", this.state.latitude, ",", this.state.longitude, "&destination=", masjid.geometry.location.lat, ",", masjid.geometry.location.lng)
        url = "https://www.google.com/maps/dir/?api=1&origin=" + this.state.latitude + "," + this.state.longitude + "&destination=" + masjid.geometry.location.lat + "," + masjid.geometry.location.lng
        Linking.openURL(url).catch(err => console.error('An error occurred', err));
    }

    distance(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "M") { dist = dist * 0.8684 }
        return dist
    }

    // async getDistanceOneToOne(lat1, lng1, lat2, lng2) {
    //     const Location1Str = lat1 + "," + lng1;
    //     const Location2Str = lat2 + "," + lng2;

    //     let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

    //     let params = `origins=${Location1Str}&destinations=${Location2Str}&key=${'AIzaSyD20cuaN2i3qXq_vq7EwD8mhrayjCAA_-w'}`; // you need to get a key
    //     let finalApiURL = `${ApiURL}${encodeURI(params)}`;

    //     let fetchResult = await fetch(finalApiURL); // call API
    //     let Result = await fetchResult.json(); // extract json

    //     return Result.rows[0].elements[0].distance.text;

    // }

    getStatus(masjid) {
        // console.log("ini masjid ", masjid)
        fetch("https://maps.googleapis.com/maps/api/directions/json?origin=" + this.state.latitude + "," + this.state.longitude + "&destination=place_id:" + masjid.place_id + "&key=AIzaSyD20cuaN2i3qXq_vq7EwD8mhrayjCAA_-w")
            .then((response) => response.json())
            .then((responseJson) => {
                let stats = Object.assign({}, this.state.stats);
                stats[masjid] = responseJson;
                this.setState({ stats: stats });
                console.log("jarak ", responseJson)
            })
            .catch((error) => {
                Alert.alert("Error");
            });
    };

    _listEmptyComponent = () => {

        return (
            <TextNormal style={{ width: '100%', color: '#757575', fontSize: 14, textAlign: 'center', marginTop: 40 }}>Tidak ditemukan restoran halal</TextNormal>
        )
    }

    renderPeta() {

        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF9D00" />
                    <Text style={{ paddingTop: 10 }}>Loading ...</Text>
                </View>
            )
        }
        else {
            return (
                <View style={{ width: deviceWidth, backgroundColor: '#ffffff', paddingHorizontal: 19, paddingBottom: 10 }}>
                    <View style={{ width: '100%', marginBottom: 5, marginTop: 13, flexDirection: 'row', alignItems: 'center' }} >
                        <TextSemiBold style={{ color: '#757575', fontSize: 12, }}>Near you</TextSemiBold>
                        <TextSemiBold style={{ color: '#2BB04C', fontSize: 14, marginLeft: 10 }}>{this.props.lokasi !== null ? this.props.lokasi.city : null}</TextSemiBold>
                    </View>
                    {/* <TextSemiBold style={{ color: '#757575', fontSize: 12, width: '100%', marginBottom: 5, marginTop: 13 }}>Near you </TextSemiBold> */}
                    {/* <View style={{ marginBottom: 10, borderRadius: 5, paddingVertical: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: "#490E14" }} >
                        <Text style={styles.confirmText}>&nbsp;&nbsp;Daftar Masjid Terdekat &nbsp;&nbsp; </Text>
                    </View>
                    <View style={styles.listItem}> */}
                    < ScrollView >
                        <FlatList
                            // contentContainerStyle={styles.listContainer}
                            data={this.state.masjid.results}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={(info) => {
                                console.log("info ", info)
                                // console.log("distance", (this.getDistanceOneToOne(this.state.latitude, this.state.longitude, info.item.geometry.location.lat, info.item.geometry.location.lng)));
                                return (
                                    <TouchableOpacity onPress={() => {
                                        this.onItemPressed(info.item)
                                    }}>

                                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', height: 40, paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#FF9D00', marginBottom: 2 }}>
                                            <View style={{ width: '70%', justifyContent: "center" }}>
                                                <TextSemiBold style={{ color: '#FF9D00', fontSize: 14, width: '100%', borderRightWidth: 1, borderColor: '#A4A4A4' }}>{info.item.name}&nbsp;&nbsp;</TextSemiBold>
                                            </View>
                                            <View style={{ width: '30%', justifyContent: "center" }}>
                                                <TextNormal style={{ color: '#A4A4A4', fontSize: 14, width: '100%', textAlign: 'right' }}>{(this.distance(this.state.latitude, this.state.longitude, info.item.geometry.location.lat, info.item.geometry.location.lng, "K") * 1000).toFixed(0)}m</TextNormal>
                                            </View>
                                        </View>

                                        {/* <View style={{ borderBottomWidth: 1, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' }} >
                                            <View>
                                                <Text style={{ color: '#490E14', fontSize: 16 }}>{info.item.name}&nbsp;&nbsp;</Text>
                                            </View>
                                            <View>
                                                <Text style={{ color: '#490E14', fontSize: 16 }}>{(this.distance(this.state.latitude, this.state.longitude, info.item.geometry.location.lat, info.item.geometry.location.lng, "K") * 1000).toFixed(0)}m</Text>
                                            </View>
                                        </View> */}

                                    </TouchableOpacity>
                                )
                            }}
                            ListEmptyComponent={this._listEmptyComponent}
                        />
                    </ScrollView >
                </View>
            )
        }
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                {/* {/* panel atas */}
                <View style={{ width: deviceWidth, paddingHorizontal: 16, marginTop: 12, marginBottom: 10 }}>
                    <View style={{ width: '100%', borderWidth: 0.1, borderRadius: 5, flexDirection: 'row', backgroundColor: '#ffffff' }}>
                        <View style={{ width: 73, height: 73, margin: 6, borderWidth: 0 }}>
                            <ProgressiveImage resizeMode="contain" thumbnailSource={require('../../assets/resto.png')} source={require('../../assets/resto.png')} style={{ width: '100%', height: '100%', }} imageStyle={{}} />
                        </View>
                        <View style={{ justifyContent: 'center', borderWidth: 0, width: '65%', paddingLeft: 15, margin: 6 }}>
                            <TextSemiBold style={{ color: "#2BB04C", fontSize: 20, marginBottom: 8 }}>Restoran Halal</TextSemiBold>
                            <TextNormal style={{ color: "#757575", fontSize: 14 }}>Petunjuk restoran halal</TextNormal>
                        </View>
                    </View>
                </View>

                {this.renderPeta()}
                {/* <View /> */}
            </View>
        )
        // }
    }
}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
    listContainer: {
        // width: "100%"

    },
    listItem: {
        width: deviceWidth,
        margin: 0,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "white",
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: '#f6f6f6',
        shadowColor: '#aaaaaa',
        shadowOpacity: 0.8,
        shadowRadius: 5,
        elevation: 3,
        height: deviceHeight / 2,
        // width: deviceWidth / 2,
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

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading,
        lokasi: state.lokasi.lokasi
    };
};



export default connect(mapStateToProps, null)(PetaRestoran);