/**
 * Created by mata on 6/1/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import Icon from 'react-native-vector-icons/Ionicons';
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import DatePicker from 'react-native-datepicker';
import startMainTabs from "../../screens/MainTabs/startMainTabs";
import RNSimpleCompass from 'react-native-simple-compass';
import Geolocation from "./Geolocation";
import JadwalSolat from "./JadwalSolat";
import PetaMasjid from "./PetaMasjid";
import PetaRestoran from "./PetaRestoran";

import {
    Alert,
    Button,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Modal,
    Dimensions,
    ScrollView,
    Picker,
    AsyncStorage,
    Animated,
    Easing,
    TouchableHighlight
} from "react-native";

class MuslimWorld extends Component {

    static navigatorStyle = {
        // navBarTextColor: '#FFFFFF',
        // navBarBackgroundColor: '#00D1FF',
        // navBarButtonColor: '#FFFFFF',
        // topBarElevationShadowEnabled: false,
        // // navBarTitleTextCentered: true,
        // navBarHeight: 150, //tinggi navigation Bar
        // navBarCustomView: 'STEMprasmul.CustomNavBarTransfer', //custom navigation bar di atas
        // topTabsHeight: 20, // tinggi top bar
        selectedTopTabIndicatorColor: '#ffffff',
        selectedTopTabIndicatorHeight: 3,
        topTabTextColor: '#ffffff',
        selectedTopTabTextColor: '#ffffff',
        // topTabBackgroundColor: '#ffffff'
        topTabTextFontFamily: 'EncodeSans-SemiBold'
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    state = {
        modalVisibleKiblat: false,
        utara: 0,
        modalVisibleJadwal: false,
        modalVisibleMesjid: false,
        modalVisibleJadwalDua: false,
        modalVisibleRestoran: false
        // arah: ""
    }


    onNavigatorEvent = event => {
        //ini buat toogle side drawer
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    };


    componentWillMount(){
        
    }

    onShowModal = (key1, key2) => {
        this.props.navigator.showModal({
            screen: key1, // unique ID registered with Navigation.registerScreen
            title: key2, // title of the screen as appears in the nav bar (optional)
            passProps: {}, // simple serializable object that will pass as props to the modal (optional)
            navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
            animationType: 'slide-up',// 'none' / 'slide-up' , appear animation for the modal (optional, default 'slide-up')
            overrideBackPress: true
        });
    }

    render() {

        return (
            <View>

            </View>
            // <ScrollView>
            //     <View style={styles.container}>
            //         <View style={{ borderRadius: 5, paddingVertical: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: "#490E14" }}>
            //             <Text style={styles.confirmText}>&nbsp;&nbsp;Bantuan panduan untuk pengguna muslim &nbsp;&nbsp; </Text>
            //         </View>
            //     </View>
            //     <View style={styles.inputContainer}>

            //         {/* go to jadwal solat  */}
            //         <TouchableOpacity
            //             style={{ borderWidth: 1, borderRadius: 5, backgroundColor: 'white', padding: 5, marginBottom: 5 }}
            //             // onPress={() => { this.setState({ modalVisibleJadwal: true }) }}
            //             onPress={() => { this.onShowModal("cheria-holidays.JadwalSolat", "Jadwal Solat") }}
            //         >
            //             <View>
            //                 <Text style={{ color: "#490E14", fontSize: 16, marginVertical: 5 }}>Jadwal Sholat</Text>
            //             </View>
            //             <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0 }}>
            //                 <View style={{ flex: 1 }}>
            //                     <Text style={{ color: "#490E14", fontSize: 14 }}>Informasi mengenai waktu shalat</Text>
            //                 </View>
            //                 <Icon
            //                     name={"md-list-box"}
            //                     size={30}
            //                     color="black"
            //                 />
            //             </View>
            //         </TouchableOpacity>
            //         {/* go to kiblat */}
            //         <TouchableOpacity
            //             style={{ borderWidth: 1, borderRadius: 5, backgroundColor: 'white', padding: 5, marginBottom: 5 }}
            //             // onPress={() => {this.setState({ modalVisibleKiblat: true })}}
            //             // this.startCompass()
            //             onPress={() => { this.onShowModal("cheria-holidays.Geolocation", "Kiblat") }}
            //         >
            //             <View>
            //                 <Text style={{ color: "#490E14", fontSize: 16, marginVertical: 5 }}>Kiblat</Text>
            //             </View>
            //             <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0 }}>
            //                 <View style={{ flex: 1 }}>
            //                     <Text style={{ color: "#490E14", fontSize: 14 }}>Petunjuk arah menuju kiblat</Text>
            //                 </View>
            //                 <Icon
            //                     name={"md-compass"}
            //                     size={30}
            //                     color="black"
            //                 />
            //             </View>
            //         </TouchableOpacity>
            //         {/* go to masjid Terdekat */}
            //         <TouchableOpacity
            //             style={{ borderWidth: 1, borderRadius: 5, backgroundColor: 'white', padding: 5, marginBottom: 5 }}
            //             // onPress={() => { this.setState({ modalVisibleMesjid: true }) }}
            //             onPress={() => {
            //                 this.onShowModal("cheria-holidays.PetaMasjid", "Peta Masjid")
            //             }}
            //         >
            //             <View>
            //                 <Text style={{ color: "#490E14", fontSize: 16, marginVertical: 5 }}>Masjid Terdekat</Text>
            //             </View>
            //             <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0 }}>
            //                 <View style={{ flex: 1 }}>
            //                     <Text style={{ color: "#490E14", fontSize: 14 }}>Peta masjid terdekat</Text>
            //                 </View>
            //                 <Icon
            //                     name={"md-map"}
            //                     size={30}
            //                     color="black"
            //                 />
            //             </View>
            //         </TouchableOpacity>
            //         {/* go to Restoran Terdekat */}
            //         <TouchableOpacity
            //             style={{ borderWidth: 1, borderRadius: 5, backgroundColor: 'white', padding: 5, marginBottom: 5 }}
            //             // onPress={() => { this.setState({ modalVisibleRestoran: true }) }}
            //             onPress={() => { this.onShowModal("cheria-holidays.PetaRestoran", "Peta Restoran") }}
            //         >
            //             <View>
            //                 <Text style={{ color: "#490E14", fontSize: 16, marginVertical: 5 }}>Restoran halal</Text>
            //             </View>
            //             <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomWidth: 0 }}>
            //                 <View style={{ flex: 1 }}>
            //                     <Text style={{ color: "#490E14", fontSize: 14 }}>Peta restoran halal terdekat</Text>
            //                 </View>
            //                 <Icon
            //                     name={"md-restaurant"}
            //                     size={30}
            //                     color="black"
            //                 />
            //             </View>
            //         </TouchableOpacity>

            //         <Modal
            //             animationType="fade"
            //             transparent={true}
            //             visible={this.state.modalVisibleKiblat}
            //             onRequestClose={() => {
            //                 this.setState({ modalVisibleKiblat: false })
            //                 RNSimpleCompass.stop()
            //             }}>
            //             <View style={{ flex: 1 }}>
            //                 <View style={{ backgroundColor: 'white' }}>
            //                     <TouchableOpacity
            //                         onPress={() => {
            //                             this.setState({ modalVisibleKiblat: false })
            //                             RNSimpleCompass.stop()
            //                         }}
            //                     >
            //                         <View style={{ borderBottomWidth: 0, marginRight: '60%', marginTop: 10, paddingLeft: 15, flexDirection: 'row', alignItems: 'center' }}>
            //                             <Icon
            //                                 name={"md-arrow-back"}
            //                                 size={35}
            //                                 color="#490E14"
            //                             />
            //                             <Text style={{ paddingLeft: 30, color: "#490E14", fontSize: 20, fontWeight: 'bold' }}>Kiblat</Text>
            //                         </View>
            //                     </TouchableOpacity>
            //                 </View>
            //                 <Geolocation />
            //             </View>
            //         </Modal>

            //         <Modal
            //             animationType="fade"
            //             transparent={true}
            //             visible={this.state.modalVisibleJadwal}
            //             onRequestClose={() => {
            //                 this.setState({ modalVisibleJadwal: false })
            //             }}>

            //             <View style={{ marginTop: 0, flex: 1, flexDirection: 'column' }}>
            //                 <View style={{ backgroundColor: 'white' }}>
            //                     <TouchableOpacity
            //                         onPress={() => { this.setState({ modalVisibleJadwal: false }) }}
            //                     >
            //                         <View style={{ borderBottomWidth: 0, marginRight: '40%', marginTop: 10, paddingLeft: 15, flexDirection: 'row', alignItems: 'center' }}>
            //                             <Icon
            //                                 name={"md-arrow-back"}
            //                                 size={35}
            //                                 color="#490E14"
            //                             />
            //                             <Text style={{ paddingLeft: 30, color: "#490E14", fontSize: 20, fontWeight: 'bold' }}>Jadwal Sholat</Text>
            //                         </View>
            //                     </TouchableOpacity>
            //                 </View>
            //                 <JadwalSolat />

            //             </View>
            //         </Modal>

            //         <Modal
            //             animationType="fade"
            //             transparent={true}
            //             visible={this.state.modalVisibleMesjid}
            //             onRequestClose={() => {
            //                 this.setState({ modalVisibleMesjid: false })
            //             }}>
            //             <View style={{ marginTop: 0, flex: 1, flexDirection: 'column' }}>
            //                 <View style={{ backgroundColor: 'white' }}>
            //                     <TouchableOpacity
            //                         onPress={() => { this.setState({ modalVisibleMesjid: false }) }}
            //                     >
            //                         <View style={{ borderBottomWidth: 0, marginRight: '40%', marginTop: 10, paddingLeft: 15, flexDirection: 'row', alignItems: 'center' }}>
            //                             <Icon
            //                                 name={"md-arrow-back"}
            //                                 size={35}
            //                                 color="#490E14"
            //                             />
            //                             <Text style={{ paddingLeft: 30, color: "#490E14", fontSize: 20, fontWeight: 'bold' }}>Mesjid</Text>
            //                         </View>
            //                     </TouchableOpacity>
            //                 </View>
            //                 <PetaMasjid />
            //             </View>
            //         </Modal>

            //         <Modal
            //             animationType="fade"
            //             transparent={true}
            //             visible={this.state.modalVisibleRestoran}
            //             onRequestClose={() => {
            //                 this.setState({ modalVisibleRestoran: false })
            //             }}>
            //             <View style={{ marginTop: 0, flex: 1, flexDirection: 'column' }}>
            //                 <View style={{ backgroundColor: 'white' }}>
            //                     <TouchableOpacity
            //                         onPress={() => { this.setState({ modalVisibleRestoran: false }) }}
            //                     >
            //                         <View style={{ borderBottomWidth: 0, marginRight: '40%', marginTop: 10, paddingLeft: 15, flexDirection: 'row', alignItems: 'center' }}>
            //                             <Icon
            //                                 name={"md-arrow-back"}
            //                                 size={35}
            //                                 color="#490E14"
            //                             />
            //                             <Text style={{ paddingLeft: 30, color: "#490E14", fontSize: 20, fontWeight: 'bold' }}>Restoran</Text>
            //                         </View>
            //                     </TouchableOpacity>
            //                 </View>
            //                 <PetaRestoran />
            //             </View>
            //         </Modal>

            //     </View>
            // </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        alignItems: "center"
    },
    inputContainer: {
        padding: 10,
        margin: 5,
    },
    input: {
        flex: 1
    },
    confirmText: {
        paddingHorizontal: 5,
        justifyContent: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: "center",
        color: "white"

    },
    button: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 15,
        flex: 1
    },
})

export default connect(null, null)(MuslimWorld);


