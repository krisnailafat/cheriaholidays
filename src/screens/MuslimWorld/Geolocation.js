import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  View, Text, StyleSheet, Image, Animated, Dimensions, ActivityIndicator, Platform, Alert,
  BackHandler, DeviceEventEmitter, TouchableOpacity, AsyncStorage, ScrollView, ImageBackground, Easing
} from 'react-native';
import RNSimpleCompass from 'react-native-simple-compass';
import { PermissionsAndroid } from 'react-native';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import ProgressiveImage from "../../components/UI/ProgressiveImage/ProgressiveImage"
import { TextSemiBold, TextNormal, TextMedium } from '../../components/UI/TextCustom/TextCustom';

class GeolocationExample extends Component {
  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.spinValue = new Animated.Value(0);
  }
  state = {
    latitude: null,
    longitude: null,

    // latitude: -6.894501,
    // longitude: 107.629132,

    latitudeNew: null,
    longitudeNew: null,

    error: null,
    utara: 0,
    isLoading: true,

    statusDisplayKompas: false,

    // update
    location: null,
    errorMessage: null,
    heading: null,
    truenoth: null,

    kota: '',
    staddress: ''

  };

  onNavigatorEvent(event) {
    if (event.id === 'backPress') {
      //Do your thing
      // console.log("back button")
      // LocationServicesDialogBox.stopListener();
      // this.props.navigator.dismissAllModals({
      //   animationType: 'slide-down' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
      // });
      // return true
    }
    switch (event.id) {
      // case "bottomTabSelected":
      //     this.setState({ isCameraLoading: false })
      //     console.log("im presses")
      //     break;
      case 'didAppear':
        this.startCompass()

        if (this.state.latitude == null && this.state.longitude == null) {
          this.aktifKompas()
          console.log('lokasi aktif')
        } else {
          console.log(' lokasi kompastidak perlu aktif')
        }

        console.log("kompas active")
        break;
      case 'didDisappear':
        // this.setState({ isCameraLoading: true })
        this.componentWillUnmount()
        RNSimpleCompass.stop();
        console.log("kompas dead")
        break;
    }

  }

  componentWillMount() {
    // this.aktifKompas()
    // LocationServicesDialogBox.checkLocationServicesIsEnabled({
    //   message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
    //   ok: "YES",
    //   cancel: "NO",
    //   enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
    //   showDialog: true, // false => Opens the Location access page directly
    //   openLocationServices: true, // false => Directly catch method is called if location services are turned off
    //   preventOutSideTouch: true, //true => To prevent the location services popup from closing when it is clicked outside
    //   preventBackClick: true, //true => To prevent the location services popup from closing when it is clicked back button
    //   providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    // }).then(function (success) {
    //   // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     let initialPosition = JSON.stringify(position);
    //     console.log("ini hasilnya", position.coords.longitude)
    //     this.setState({ longitude: position.coords.longitude, latitude: position.coords.latitude, isLoading: false });
    //     this.startCompass()
    //   }, error => {
    //     console.log(error)
    //     Alert.alert(
    //       'Lokasi tidak ditemukan',
    //       'Coba kembali',
    //       [
    //         { text: 'OK', onPress: () => this.props.navigator.dismissAllModals({ animationType: 'slide-down' }) },
    //       ],
    //       // { cancelable: false }
    //     )
    //   }, { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 });
    // }.bind(this)
    // ).catch((error) => {
    //   Alert.alert(
    //     'Lokasi tidak ditemukan',
    //     'Coba kembali',
    //     [
    //       { text: 'OK', onPress: () => this.props.navigator.dismissAllModals({ animationType: 'slide-down' }) },
    //     ],
    //     // { cancelable: false }
    //   )
    //   console.log(error.message);
    // });

    // DeviceEventEmitter.addListener('locationProviderStatusChange', function (status) { // only trigger when "providerListener" is enabled
    //   if (status === "disabled") {
    //     alert("Harus mengaktifkan GPS");
    //   }
    //   console.log(status); //  status => {enabled: false, status: "disabled"} or {enabled: true, status: "enabled"}
    // });
  }

  componentWillUnmount() {
    // used only when "providerListener" is enabled
    LocationServicesDialogBox.stopListener(); // Stop the "locationProviderStatusChange" listener.
  }

  componentWillUpdate() {
    this.spin()
  }

  getKota = (lat, lon) => {
    console.log("lat", lat + ' long ' + lon)
    let url2 = 'https://geocode.xyz/' + lat + ',' + lon + '?json=1'
    fetch(
      url2,
      // {
      //   method: "GET",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   //TODO masukin total_tagihan, phone,
      // }
    ).catch(err => {
      console.log(err);
      Alert.alert("Gagal", "Error accessing Halal Traveler");
    })
      .then(res => res.json())
      .catch(err => {
        console.log(err);
        Alert.alert("Gagal", "Error accessing Halal Traveler");
      })
      .then(parsedRes => {
        console.log('parsedRes', parsedRes)
        // console.log('parsedRes.city', parsedRes.city)
        this.setState({ kota: parsedRes.city, staddress: parsedRes.staddress })

      }).catch(err => {
        console.log(err);
        Alert.alert("Gagal", "Error accessing Halal Traveler");
      })
  }

  // Converts from degrees to radians.
  toRadians = (degrees) => {
    return degrees * Math.PI / 180;
  };

  // Converts from radians to degrees.
  toDegrees = (radians) => {
    return radians * 180 / Math.PI;
  }


  bearing = (startLat, startLng, destLat, destLng) => {
    startLat = this.toRadians(startLat);
    startLng = this.toRadians(startLng);
    destLat = this.toRadians(destLat);
    destLng = this.toRadians(destLng);

    y = Math.sin(destLng - startLng) * Math.cos(destLat);
    x = Math.cos(startLat) * Math.sin(destLat) -
      Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLng - startLng);
    brng = Math.atan2(y, x);
    if (brng < 0) {

      //bearTo = -100 + 360  = 260;
      brng = this.toDegrees(brng);
      v =
        brng = brng + 360;

    }
    return (brng);
  }

  startCompass() {
    const degree_update_rate = 3; // Number of degrees changed before the callback is triggered
    RNSimpleCompass.start(degree_update_rate, (degree) => {
      console.log('You are facing', degree);
      this.setState({ utara: degree })
      // RNSimpleCompass.stop();
      // if (degree >= 22.5 && degree < 67.5) {
      //     this.setState({ arah: 'NE' });
      // }
      // else if (degree >= 67.5 && degree < 112.5) {
      //     this.setState({ arah: 'E' });
      // }
      // else if (degree >= 112.5 && degree < 157.5) {
      //     this.setState({ arah: 'SE' });
      // }
      // else if (degree >= 157.5 && degree < 202.5) {
      //     this.setState({ arah: 'S' });
      // }
      // else if (degree >= 202.5 && degree < 247.5) {
      //     this.setState({ arah: 'SW' });
      // }
      // else if (degree >= 247.5 && degree < 292.5) {
      //     this.setState({ arah: 'W' });
      // }
      // else if (degree >= 292.5 && degree < 337.5) {
      //     this.setState({ arah: 'NW' });
      // }
      // else {
      //     this.setState({ arah: 'N' });
      // }
    });
  }

  aktifKompas = () => {

    LocationServicesDialogBox.checkLocationServicesIsEnabled({
      message: "<h2>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/>",
      ok: "YES",
      cancel: "NO",
      enableHighAccuracy: false, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
      showDialog: true, // false => Opens the Location access page directly
      openLocationServices: true, // false => Directly catch method is called if location services are turned off
      preventOutSideTouch: true, //true => To prevent the location services popup from closing when it is clicked outside
      preventBackClick: true, //true => To prevent the location services popup from closing when it is clicked back button
      providerListener: true // true ==> Trigger "locationProviderStatusChange" listener when the location state changes
    }).then(function (success) {
      // success => {alreadyEnabled: true, enabled: true, status: "enabled"} 
      navigator.geolocation.getCurrentPosition((position) => {
        let initialPosition = JSON.stringify(position);
        console.log("ini hasilnya", position.coords.longitude)
        this.setState({ longitude: position.coords.longitude, latitude: position.coords.latitude, isLoading: false });
        // AsyncStorage.setItem("ap:auth:token", parsedRes.auth_token)
        AsyncStorage.setItem("app:longitude", position.coords.longitude.toString())
        AsyncStorage.setItem("app:latitude", position.coords.latitude.toString())
        this.startCompass()
        this.getKota(position.coords.latitude, position.coords.longitude)
      }, error => {
        console.log(error)
        this.aktifKompas()
        // Alert.alert(
        //   'Lokasi tidak ditemukan',
        //   'Coba kembali',
        //   [
        //     { text: 'OK', onPress: () => this.props.navigator.dismissAllModals({ animationType: 'slide-down' }) },
        //   ],
        //   // { cancelable: false }
        // )
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

  // fungsi kompas asli
  spin() {
    let start = JSON.stringify(this.spinValue);
    let heading = Math.round(this.state.utara);

    let rot = +start;
    let rotM = rot % 360;

    if (rotM < 180 && (heading > (rotM + 180)))
      rot -= 360;
    if (rotM >= 180 && (heading <= (rotM - 180)))
      rot += 360

    rot += (heading - rotM)

    Animated.timing(
      this.spinValue,
      {
        toValue: rot,
        duration: 300,
        easing: Easing.easeInOut
      }
    ).start()
  }



  render() {

    const spin = this.spinValue.interpolate({
      inputRange: [0, 360],
      outputRange: ['-0deg', '-360deg']
    })

    // console.log(this.bearing(this.state.latitude, this.state.longitude, 21.422487, 39.826206));
    // console.log("ini latitude ", this.state.latitude, " ini longitude ", this.state.longitude)

    if (
      this.state.isLoading
      // false
    ) {
      return (
        <View style={{ flex: 1, }}>

          <View style={{ width: deviceWidth, paddingHorizontal: 16, marginTop: 12 }}>
            <View style={{ width: '100%', borderWidth: 0.1, borderRadius: 5, flexDirection: 'row', backgroundColor: '#ffffff' }}>
              <View style={{ width: 73, height: 73, margin: 6, borderWidth: 0 }}>
                <ProgressiveImage resizeMode="contain" thumbnailSource={require('../../assets/kiblat.png')} source={require('../../assets/kiblat.png')} style={{ width: '100%', height: '100%', }} imageStyle={{}} />
              </View>
              <View style={{ justifyContent: 'center', borderWidth: 0, width: '65%', paddingLeft: 15, margin: 6 }}>
                <TextSemiBold style={{ color: "#2BB04C", fontSize: 20, marginBottom: 8 }}>Kiblat</TextSemiBold>
                <TextNormal style={{ color: "#757575", fontSize: 14 }}>Kompas arah kiblat</TextNormal>
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
        // <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>

        // <View>
        //   <Text>{360-this.bearing(this.state.latitude, this.state.longitude, 21.422487, 39.826206)}</Text>
        //   {/* <Text>Latitude: {this.state.latitude}</Text>
        //   <Text>Longitude: {this.state.longitude}</Text>
        //   {this.state.error ? <Text>Error: {this.state.error}</Text> : null} */}
        // </View>
        <ScrollView>
          <View style={{
            flex: 1,
            // alignItems: 'center',
            justifyContent: 'space-between',
            // backgroundColor: "white",
            borderWidth: 0
          }}>

            <View style={{ width: deviceWidth, borderWidth: 0 }}>
              {/* panel atas */}
              <View style={{ width: deviceWidth, paddingHorizontal: 16, marginTop: 12, marginBottom: 0 }}>
                <View style={{ width: '100%', borderWidth: 0.1, borderRadius: 5, flexDirection: 'row', backgroundColor: '#ffffff' }}>
                  <View style={{ width: 73, height: 73, margin: 6, borderWidth: 0 }}>
                    <ProgressiveImage resizeMode="contain" thumbnailSource={require('../../assets/kiblat.png')} source={require('../../assets/kiblat.png')} style={{ width: '100%', height: '100%', }} imageStyle={{}} />
                  </View>
                  <View style={{ justifyContent: 'center', borderWidth: 0, width: '65%', paddingLeft: 15, margin: 6 }}>
                    <TextSemiBold style={{ color: "#2BB04C", fontSize: 20, marginBottom: 8 }}>Kiblat</TextSemiBold>
                    <TextNormal style={{ color: "#757575", fontSize: 14 }}>Kompas arah kiblat</TextNormal>
                  </View>
                </View>
              </View>
              <View style={{ width: deviceWidth, paddingHorizontal: 16, marginTop: 9, marginBottom: 30 }}>
                <View style={{ width: '100%', paddingHorizontal: 22, paddingVertical: 6, backgroundColor: '#ffffff', borderRadius: 5 }}>
                  <TextNormal style={{ color: '#757575', fontSize: 12 }}>Location</TextNormal>
                  <TextSemiBold style={{ color: '#3EBA49', fontSize: 14, marginTop: 9, width: '100%' }}>{this.state.staddress !== '' ? this.state.staddress + ',' : null} {this.state.kota}</TextSemiBold>
                </View>
              </View>

              {/* tombol start */}
              {/* <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
            <TouchableOpacity onPress={this.aktifKompas}>
              <View style={{ width: 150, height: 40, backgroundColor: '#FF9D00', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                <TextMedium style={{ color: '#ffffff', fontSize: 18 }}>Turn On</TextMedium>
              </View>
            </TouchableOpacity>
          </View> */}
              {/* kompas */}

              <Animated.View style={{ width: deviceWidth, height: 242, alignItems: 'center', justifyContent: 'center' }}>
                <Animated.Image resizeMode='contain' source={require('../../assets/compass.png')}
                  style={{
                    // width: deviceWidth - 10, height: deviceHeight / 2 - 10,
                    // left: deviceWidth / 2 - (deviceWidth - 10) / 2, top: deviceHeight / 2.3 - (deviceHeight / 2 - 10) / 2 - 40,
                    width: '100%', height: '100%',
                    transform: [{ rotate: 360 - this.state.utara + 'deg' }],
                    // transform: [{ rotate: spin }],
                  }} />
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                  <Animated.Image resizeMode='contain' source={require('../../assets/arrow.png')}
                    style={{
                      width: 80, height: 80,
                      transform: [{ rotate: this.bearing(this.state.latitude, this.state.longitude, 21.422487, 39.826206) - this.state.utara + 'deg' }],
                      // transform: [{ rotate: this.bearing(this.state.latitude, this.state.longitude, 21.422487, 39.826206) + 'deg' }]
                      // transform: [{ rotate: this.bearing(-6.873705, 107.553121, 21.422487, 39.826206) + 'deg' }]
                      // transform: [{ rotate: spin }],
                    }}
                  />
                </View>
                {/* </Animated.Image> */}
              </Animated.View>

            </View>

            <View style={{ width: deviceWidth, paddingHorizontal: 16, marginBottom: 10, marginTop: 8 }}>
              <TextNormal
                style={{
                  borderWidth: 1, borderColor: '#FF9D00', borderRadius: 5, paddingHorizontal: 10, paddingVertical: 15,
                  color: "#2BB04C", fontSize: 16, textAlign: 'center'
                }}
                textAlign={'center'}
              >
                Kiblat {this.state.latitude != null ? (this.bearing(this.state.latitude, this.state.longitude, 21.422487, 39.826206).toString()).substr(0, 3) + '°' : '0°'}
              </TextNormal>
            </View>

            {/* {this.displayKompas} */}
          </View>
        </ScrollView>
      );
    }
  }
}
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

export default connect(null, null)(GeolocationExample);