/**
 * Created by mata on 6/1/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import DatePicker from 'react-native-datepicker';
import startMainTabs from "../../screens/MainTabs/startMainTabs";

import {
    Alert,
    Button,
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    ScrollView,
    Picker,
    AsyncStorage
} from "react-native";
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../../components/UI/TextCustom/TextCustom"
//custom icon
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon

class RequestTour extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    static navigatorStyle = {
        navBarTextColor: '#2BB04C',
        // tabBarHidden: true,
        navBarTextFontFamily: 'EncodeSans-Medium',
        navBarBackgroundColor: '#ffffff',
        navBarButtonColor: '#3EBA49',

    };

    state = {
        nama: '',
        telepon: '',
        tourtype: 'Group',
        tgl_berangkat: new Date().toISOString().slice(0, 10),
        hotel: 'Bebas',
        tiket: 'Include',
        itinerary: '',
        destination: '',
        token: '',
        budget: '0',
        number_participant_adult: '1',
        number_participant_child: '0',
        number_participant_infant: '0',
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

    onRequestHandler = () => {
        console.log('request data for', this.state);

        if (this.state.nama != "" && this.state.telepon != "" && this.state.destination != "" &&
            this.state.itinerary != "" && this.state.budget != '0') {
            AsyncStorage.getItem("ap:auth:token").then((value) => {
                this.setState({ "token": value });
            })
                .then(res => {
                    console.log('token:', this.state.token)
                    fetch(
                        "https://travelfair.co/api/tourinquiry/",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + this.state.token
                            },
                            body: JSON.stringify({
                                name_applicant: this.state.nama,
                                phone_number: this.state.telepon,
                                destination: this.state.destination,
                                tour_type: this.state.tourtype,
                                number_participant_adult: this.state.number_participant_adult,
                                number_participant_child: this.state.number_participant_child,
                                number_participant_infant: this.state.number_participant_infant,
                                departure_date: new Date(this.state.tgl_berangkat).toISOString().slice(0, 10),
                                budget: this.state.budget,
                                hotel_type: this.state.hotel,
                                ticket_type: this.state.tiket,
                                itinerary: this.state.itinerary,
                                currency: "IDR"
                            })
                        }
                    ).then(() => {
                        Alert.alert(
                            'Inquiry Sukses',
                            'Terima kasih atas inquiry yg diberikan.\nKami akan & memfollowup permintaan Anda.',
                            [
                                { text: 'OK', onPress: () => startMainTabs() },
                            ],
                            { cancelable: false }
                        )

                        //alert("Inquiry Tour Sukses.\nKami akan & memfollowup permintaan Anda.")
                        //startMainTabs();
                    }
                    )
                        .catch(err => alert("Inquiry error.\nPastikan semua data terisi lengkap!"));
                });

        } else {
            console.log('state', this.state)
            if (this.state.nama == '') {
                Alert.alert('ERROR', 'Silahkan isi Nama Anda terlebih dahulu')
            } else if (this.state.telepon == '') {
                Alert.alert('ERROR', 'Silahkan isi Nomor Telepon terlebih dahulu')
            } else if (this.state.destination == '') {
                Alert.alert('ERROR', 'Silahkan isi Kota Tujuan terlebih dahulu')
            } else if (this.state.itinerary == '') {
                Alert.alert('ERROR', 'Silahkan isi Itinerary terlebih dahulu')
            } else if (this.state.budget == '0') {
                Alert.alert('ERROR', 'Silahkan isi Budget Anggaran terlebih dahulu')
            }

        }
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: '#ffffff' }}>
                <View style={styles.container}>

                    <TextMedium style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, color: '#757575', fontSize: 14, marginVertical: 18 }}>Silahkan isi form di bawah ini untuk request di luar paket default yang kami tawarkan</TextMedium>
                    {/* input nama */}
                    <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20, paddingHorizontal: 19 }}>
                        <View style={{ width: '10%' }}>
                            <Ico name='user-shape' size={25} color='#3EBA49' />
                        </View>
                        <View style={{ width: '90%', justifyContent: 'space-between' }}>
                            <TextNormal style={{ color: '#CECECE', fontSize: 12 }}>Nama</TextNormal>
                            <DefaultInput
                                placeholder="Tulis Nama Anda"
                                style={styles.input}
                                value={this.state.nama}
                                onChangeText={val => this.setState({ nama: val })}
                                //valid={this.state.controls.email.valid}
                                //touched={this.state.controls.email.touched}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>
                    {/* input telepon */}
                    <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20, paddingHorizontal: 19 }}>
                        <View style={{ width: '10%' }}>
                            <MaterialIcons name='phone' size={25} color='#3EBA49' />
                        </View>
                        <View style={{ width: '90%', justifyContent: 'space-between' }}>
                            <TextNormal style={{ color: '#CECECE', fontSize: 12 }}>Telepon</TextNormal>
                            <DefaultInput
                                placeholder="Tulis Nomor Telepon"
                                style={styles.input}
                                value={this.state.telepon}
                                onChangeText={val => this.setState({ telepon: val })}
                                //valid={this.state.controls.email.valid}
                                //touched={this.state.controls.email.touched}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>
                    {/* input tujuan */}
                    <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20, paddingHorizontal: 19 }}>
                        <View style={{ width: '10%' }}>
                            <MaterialIcons name='location-on' size={25} color='#3EBA49' />
                        </View>
                        <View style={{ width: '90%', justifyContent: 'space-between' }}>
                            <TextNormal style={{ color: '#CECECE', fontSize: 12 }}>Tujuan</TextNormal>
                            <DefaultInput
                                placeholder="Tulis kota tujuan"
                                style={styles.input}
                                value={this.state.destination}
                                onChangeText={val => this.setState({ destination: val })}
                                //valid={this.state.controls.email.valid}
                                //touched={this.state.controls.email.touched}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <TextSemiBold style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, color: '#757575', fontSize: 14, marginBottom: 6 }}>Peserta</TextSemiBold>

                    <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', paddingLeft: 19, marginBottom: 20 }}>
                        <View style={{ justifyContent: 'center', width: '26%', marginRight: 15 }}>
                            <TextNormal style={{ color: '#A4A4A4', fontSize: 16 }}>Dewasa</TextNormal>
                            <View style={{ height: 42, width: '100%', borderWidth: 1, borderColor: '#34A941', borderRadius: 5, }}>
                                <Picker
                                    selectedValue={this.state.number_participant_adult}
                                    style={{ height: "100%", width: "100%" }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ number_participant_adult: itemValue })}>
                                    <Picker.Item label="1" value="1" />
                                    <Picker.Item label="2" value="2" />
                                    <Picker.Item label="3" value="3" />
                                    <Picker.Item label="4" value="4" />
                                    <Picker.Item label=">4" value=">4" />
                                </Picker>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', width: '26%', marginRight: 15 }}>
                            <TextNormal style={{ color: '#A4A4A4', fontSize: 16 }}>Anak</TextNormal>
                            <View style={{ height: 42, width: '100%', borderWidth: 1, borderColor: '#34A941', borderRadius: 5, }}>
                                <Picker
                                    selectedValue={this.state.number_participant_child}
                                    style={{ height: 42, width: '100%' }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ number_participant_child: itemValue })}>
                                    <Picker.Item label="0" value="0" />
                                    <Picker.Item label="1" value="1" />
                                    <Picker.Item label="2" value="2" />
                                    <Picker.Item label="3" value="3" />
                                    <Picker.Item label=">3" value=">3" />
                                </Picker>
                            </View>
                        </View>
                        <View style={{ justifyContent: 'center', width: '26%', marginRight: 15 }}>
                            <TextNormal style={{ color: '#A4A4A4', fontSize: 16 }}>Bayi</TextNormal>
                            <View style={{ height: 42, width: '100%', borderWidth: 1, borderColor: '#34A941', borderRadius: 5, }}>
                                <Picker
                                    selectedValue={this.state.number_participant_infant}
                                    style={{ height: 42, width: '100%' }}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ number_participant_infant: itemValue })}>
                                    <Picker.Item label="0" value="0" />
                                    <Picker.Item label="1" value="1" />
                                    <Picker.Item label="2" value="2" />
                                    <Picker.Item label="3" value="3" />
                                    <Picker.Item label=">3" value=">3" />
                                </Picker>
                            </View>
                        </View>
                    </View>

                    <TextSemiBold style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, color: '#757575', fontSize: 14, marginBottom: 8 }}>Budget</TextSemiBold>

                    <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', paddingHorizontal: 19, alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ width: '65%', height: 42, paddingLeft: 18, justifyContent: 'center', borderWidth: 1, borderColor: '#3EBA49', borderRadius: 5, marginRight: 15, }}>
                            <DefaultInput
                                placeholder="Tulis kisaran anggaran"
                                style={{ width: '100%', height: '100%', borderColor: 'transparent' }}
                                value={this.state.budget}
                                onChangeText={val => this.setState({ budget: val })}
                                //valid={this.state.controls.email.valid}
                                //touched={this.state.controls.email.touched}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <TextSemiBold style={{ color: '#FF9D00', fontSize: 18 }}>IDR</TextSemiBold>
                    </View>

                    <TextSemiBold style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, color: '#757575', fontSize: 14, marginBottom: 8 }}>Tanggal Berangkat</TextSemiBold>

                    <View style={{ width: Dimensions.get('window').width, flexDirection: 'row', paddingHorizontal: 19, alignItems: 'center', marginBottom: 16 }}>
                        <View style={{ width: '65%', height: 42, paddingLeft: 18, justifyContent: 'center', borderWidth: 1, borderColor: '#3EBA49', borderRadius: 5, marginRight: 15 }}>
                            <DatePicker
                                style={{ width: "100%", height: '100%', }}
                                customStyles={{ dateInput: { borderWidth: 0, alignItems: 'flex-start' } }}
                                date={this.state.tgl_berangkat}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                minDate={new Date()}
                                maxDate="2030-06-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                showIcon={false}
                                // customStyles={{
                                //     dateIcon: {
                                //         position: 'absolute',
                                //         left: 0,
                                //         top: 4,
                                //         marginLeft: 0
                                //     },
                                //     dateInput: {
                                //         marginLeft: 36
                                //     }
                                // }}
                                onDateChange={val => this.setState({ tgl_berangkat: val })}
                            />
                        </View>
                        <MaterialIcons name='date-range' color='#FF9D00' size={24} />
                    </View>

                    <TextSemiBold style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, color: '#757575', fontSize: 14, marginBottom: 10 }}>Tipe Hotel</TextSemiBold>

                    <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, marginBottom: 16 }}>
                        <View style={{ width: '100%', height: 50, borderBottomColor: '#3EBA49', borderBottomWidth: 1, justifyContent: 'center', }}>
                            <Picker
                                selectedValue={this.state.hotel}
                                style={{ height: "100%", width: "100%" }}
                                onValueChange={(itemValue, itemIndex) => this.setState({ hotel: itemValue })}>
                                <Picker.Item label="Bebas" value="Bebas" />
                                <Picker.Item label="Bintang 3" value="Bintang 3" />
                                <Picker.Item label="Bintang 4" value="Bintang 4" />
                                <Picker.Item label="Bintang 5" value="Bintang 5" />
                            </Picker>
                        </View>
                    </View>

                    <TextSemiBold style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, color: '#757575', fontSize: 14, marginBottom: 10 }}>Jenis Tiket</TextSemiBold>

                    <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, marginBottom: 16 }}>
                        <View style={{ width: '100%', height: 50, borderBottomColor: '#3EBA49', borderBottomWidth: 1, justifyContent: 'center', }}>
                            <Picker
                                selectedValue={this.state.tiket}
                                style={{ height: '100%', width: '100%' }}
                                onValueChange={(itemValue, itemIndex) => this.setState({ tiket: itemValue })}>
                                <Picker.Item label="Include" value="Include" />
                                <Picker.Item label="Not Include" value="Not Include" />
                            </Picker>
                        </View>
                    </View>

                    <TextSemiBold style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, color: '#757575', fontSize: 14, marginBottom: 25 }}>Itenary</TextSemiBold>

                    <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, marginBottom: 30 }}>
                        <View style={{ width: '100%', borderWidth: 1, borderColor: '#3EBA49', borderRadius: 5, padding: 10 }}>
                            <DefaultInput
                                placeholder="Masukan itenary"
                                value={this.state.itinerary}
                                style={{ width: '100%', borderColor: 'transparent' }}
                                onChangeText={val => this.setState({ itinerary: val })}
                                //valid={this.state.controls.email.valid}
                                //touched={this.state.controls.email.touched}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                                multiline={true}
                                numberOfLines={7}
                            />
                        </View>
                    </View>

                    <View style={{ width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center', marginBottom: 30 }}>
                        <TouchableOpacity onPress={this.onRequestHandler}>
                            <View style={{ width: 155, height: 40, backgroundColor: '#FF9D00', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <TextMedium style={{ color: '#ffffff', fontSize: 16 }}>Kirim</TextMedium>
                            </View>
                        </TouchableOpacity>

                    </View>




                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        // padding: 10,
        flex: 1,
        backgroundColor: '#ffffff'
        // alignItems: "center"
    },
    inputContainer: {
        padding: 10,
        margin: 5,
    },
    input: {
        // flex: 1
        height: 40,
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

export default connect(null, null)(RequestTour);


