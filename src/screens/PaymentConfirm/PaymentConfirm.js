/**
 * Created by mata on 6/4/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import PickImage from "../../components/PickImage/PickImage";
import startMainTabs from "../../screens/MainTabs/startMainTabs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
//custom icon
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon

import {
    View,
    Image,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    TouchableHighlight,
    ListView,
    ScrollView,
    Linking,
    Alert,
    AsyncStorage
} from "react-native";
import { TextMedium, TextNormal } from "../../components/UI/TextCustom/TextCustom";


class PaymentConfirm extends Component {

    state = {
        email: '',
        reservation_number: '',
        nama: '',
        telepon: '',
        jumlah_bayar: '0',
        image1: null,
        rate_conversion: '',
        pembayaran: null,
        jumlah: 0
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        console.log('payment confirm:', this.props.paymentconfirm)
    }

    componentWillMount() {
        let url2 = "https://travelfair.co/api/rateconversion/";
        console.log('URL:', url2)
        fetch(url2)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log('rate conversion:', parsedRes)
                this.setState({ rate_conversion: parsedRes.conversion_rate })
            })

        let url3 = "https://travelfair.co/api/paymentconfirmation/?reservation_number=" + this.props.paymentconfirm.reservation_number;
        console.log('URL:', url3)
        fetch(url3)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .then(parsedRes => {
                console.log('pembayaran:', parsedRes)
                this.setState({ pembayaran: parsedRes })
                for (i = 0; i < parsedRes.length; i++) {
                    this.setState({ jumlah: this.state.jumlah + parsedRes[i].amount })
                }
            })

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

    shareToWhatsAppWithContact = (text, phoneNumber) => {
        Linking.openURL(`whatsapp://send?text=${text}&phone=${phoneNumber}`);
    }

    onRequestHandler = () => {
        if (this.state.nama != "" && this.state.telepon != "" &&
            this.state.jumlah_bayar != "0") {
            AsyncStorage.getItem("ap:auth:email").then((value) => {
                this.setState({ email: value });
            })
                .then(res => {
                    var data = new FormData();
                    //data.append('tour',this.props.paymentconfirm.tour_departure.tour.id)
                    data.append('email', this.state.email)

                    data.append('name', this.state.nama)
                    data.append('phone_number', this.state.telepon)
                    data.append('amount', this.state.jumlah_bayar)
                    data.append('reservation_number', this.props.paymentconfirm.reservation_number)

                    data.append('is_accepted', false)
                    data.append('currency', this.props.paymentconfirm.tour_departure.tour.currency)
                    if (this.state.image1 != null) {
                        data.append('images', {
                            uri: this.state.image1.uri, // your file path string
                            name: Math.random().toString(36).substr(2, 5) + '.jpg',
                            type: 'image/jpg'
                        })
                    }


                    fetch(
                        "https://travelfair.co/api/paymentconfirmation/",
                        {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                //'Content-Type': 'multipart/form-data;',
                                //"Authorization": "Token "+this.state.token
                            },
                            body: data
                        }
                    ).then(() => {
                        Alert.alert(
                            'Konfirmasi Pembayaran Sukses',
                            '\nMohon di tunggu \nKami akan memeriksa pembayaran Anda',
                            [
                                {
                                    text: 'OK', onPress: () => {
                                        this.imagePicker.reset();
                                        //this.locationPicker.reset();
                                        startMainTabs();
                                    }
                                },
                            ],
                            { cancelable: false }
                        )
                    }
                    )
                        .catch(err => alert("Konfirmas Pembayaran ERROR!!.\nPeriksa kembali jaringan Anda"));
                });

        } else {
            console.log('state', this.state)
            if (this.state.nama == '') {
                Alert.alert('ERROR', 'Silahkan isi Nama Anda terlebih dahulu')
            } else if (this.state.telepon == '') {
                Alert.alert('ERROR', 'Silahkan isi Nomor Telepon terlebih dahulu')
            } else if (this.state.jumlah_bayar == '0') {
                Alert.alert('ERROR', 'Silahkan isi Jumlah Pembayaran')
            }

        }
    }

    imagePickedHandler1 = image => {
        this.setState({ image1: image })
        console.log(this.state.image1)
    };

    render() {
        let rate_conversion = null
        if (this.props.paymentconfirm.tour_departure.tour.currency === "USD") {
            rate_conversion = (
                <TextNormal style={{ color: '#757575', fontSize: 12 }}>(1 USD = {this.state.rate_conversion.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} IDR)</TextNormal>
            )
        }
        let sudah_dibayar = []
        if (this.state.pembayaran != null) {
            if (this.state.pembayaran != 0) {
                console.log("ini pembayaran ", this.state.pembayaran)
                sudah_dibayar = this.state.pembayaran.map((item, key) => {
                    console.log("ini key ", key)
                    return (

                        <View style={{ width: '100%', paddingHorizontal: 16, marginBottom: 10 }} key={key}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '40%', justifyContent: 'space-between' }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14 }}>Sudah dibayar</TextNormal>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, paddingRight: 5 }}>:</TextNormal>
                                </View>
                                <View style={{ flexDirection: 'row', width: '33%', justifyContent: 'center' }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, }}>{item.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextNormal>
                                </View>
                                <View style={{ flexDirection: 'row', width: '30%', justifyContent: 'center' }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14 }}>{item.created_at.substr(0, 10)}</TextNormal>
                                </View>
                            </View>

                        </View>

                        // <View style={{ flexDirection: 'row', alignItems: 'center' }} key={key}>
                        //     <Text style={{ width: 100, color: "#490E14" }}>Sudah dibayar: </Text>
                        //     <Text style={{ fontWeight: 'bold' }}>{item.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} &nbsp;</Text>
                        //     <Text style={{ color: "#490E14" }}>Tanggal: </Text>
                        //     <Text style={{ fontWeight: 'bold' }}>{item.created_at.substr(0, 10)}</Text>
                        // </View>
                    )
                })
            }
        }
        let sisa_tagihan = null
        if (this.state.jumlah != 0) {
            sisa_tagihan = (

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                    <TextNormal style={{ paddingHorizontal: 16, color: "#490E14" }}>Sisa pembayaran:&nbsp;
                        <TextNormal style={{ color: '#2BB04C', fontSize: 14 }}>&nbsp;{(Number(this.state.pembayaran[0].tour.total_amount) - Number(this.state.jumlah)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextNormal></TextNormal>
                </View>
                // <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                //     <Text style={{ color: "#490E14" }}>Sisa pembayaran: </Text>
                //     <Text style={{ fontWeight: 'bold' }}>&nbsp;{(Number(this.props.paymentconfirm.total_amount) - Number(this.state.jumlah)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                // </View>
            )
        }
        return (
            <ScrollView style={{ backgroundColor: '#ffffff' }} >
                <View style={styles.container}>

                    {/* bagian atas */}
                    <View style={{ width: Dimensions.get('window').width, backgroundColor: '#C4C4C4' }}>
                        <TextMedium style={{ color: '#404040', fontSize: 14, paddingLeft: 19, paddingVertical: 15 }}>Silahkan isi form di bawah ini untuk konfirmasi pembayaran</TextMedium>
                    </View>
                    {/* bagian form */}
                    <View style={{ width: Dimensions.get('window').width, backgroundColor: '#ffffff' }}>
                        {/* bagian atas */}
                        <View style={{ width: '100%', paddingHorizontal: 19, alignItems: 'center', marginTop: 13, marginBottom: 20 }} >
                            <View style={{ width: '100%', borderWidth: 1, borderColor: 'rgba(0, 0, 0, 0.25)', borderRadius: 5, paddingHorizontal: 10 }}>
                                <Ico name='bill' size={33} color='#5C8ECC' style={{ marginVertical: 10, width: '100%', textAlign: 'center' }} />
                                <View style={{ width: '100%', flexDirection: 'row', marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '40%' }}>
                                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>Kode Booking</TextNormal>
                                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>:</TextNormal>
                                    </View>
                                    <TextNormal style={{ color: '#5C8ECC', fontSize: 16 }}>{this.props.paymentconfirm.reservation_number}</TextNormal>
                                </View>
                                <View style={{ width: '100%', flexDirection: 'row', marginBottom: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '40%' }}>
                                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>Total Tagihan</TextNormal>
                                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>:</TextNormal>
                                    </View>
                                    <TextNormal style={{ color: '#5C8ECC', fontSize: 16 }}>{this.props.paymentconfirm.tour_departure.tour.currency} {this.props.paymentconfirm.total_amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextNormal>
                                </View>
                                <View style={{ width: '100%', flexDirection: 'row', marginBottom: 10 }}>
                                    {rate_conversion}
                                </View>
                            </View>
                        </View>

                        {/* kolom input  */}
                        <View style={{ width: '100%', paddingHorizontal: 16, marginBottom: 16 }}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 }}>
                                <View style={{ width: '10%' }}>
                                    <Ico name='Username' size={25} color='#3EBA49' />
                                </View>
                                <View style={{ width: '90%', justifyContent: 'space-between' }}>
                                    <TextNormal style={{ color: '#CECECE', fontSize: 12 }}>Nama</TextNormal>
                                    <DefaultInput
                                        placeholder="Tulis Nama Pengirim Uang"
                                        // style={styles.input}
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
                        </View>
                        {/* form telephone */}
                        <View style={{ width: '100%', paddingHorizontal: 16, marginBottom: 16 }}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 }}>
                                <View style={{ width: '10%' }}>
                                    <MaterialIcons name='phone' size={25} color='#3EBA49' />
                                </View>
                                <View style={{ width: '90%', justifyContent: 'space-between' }}>
                                    <TextNormal style={{ color: '#CECECE', fontSize: 12 }}>Telephone</TextNormal>
                                    <DefaultInput
                                        placeholder="Tulis Telepon Anda"
                                        // style={styles.input}
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
                        </View>
                        {/* kolom catatan */}
                        <TextNormal style={{ width: '100%', paddingLeft: 19, color: '#757575', fontSize: 14, marginBottom: 16 }}>Catatan Pembayaran</TextNormal>
                        {/* kolom list bayar */}
                        {sudah_dibayar}
                        <View style={{ width: '100%', marginHorizontal: 16, borderBottomWidth: 1, borderColor: '#C8CACC', marginBottom: 12 }} />
                        {sisa_tagihan}
                        {/* kolom input nominal  */}
                        <View style={{ width: '100%', paddingHorizontal: 16, marginBottom: 25 }}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '40%', justifyContent: 'space-between' }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14 }}>Masukan Nominal</TextNormal>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, paddingRight: 5 }}>:</TextNormal>
                                </View>
                                <View style={{ flexDirection: 'row', width: '33%', borderWidth: 1, borderColor: '#2BB04C', borderRadius: 5, height: 40 }}>
                                    {/* <TextNormal style={{ color: '#757575', fontSize: 14, }}>0</TextNormal> */}
                                    <DefaultInput
                                        placeholder="Tulis jumlah uang"
                                        // style={styles.input}
                                        style={{ width: '100%', height: '100%', borderColor: 'transparent' }}
                                        underlineColorAndroid={'transparent'}
                                        value={this.state.jumlah_bayar}
                                        onChangeText={val => this.setState({ jumlah_bayar: val })}
                                        //valid={this.state.controls.email.valid}
                                        //touched={this.state.controls.email.touched}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <View style={{ flexDirection: 'row', width: '30%', justifyContent: 'center' }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14 }}>{this.props.paymentconfirm.tour_departure.tour.currency != "USD" ? "IDR" : "USD"}</TextNormal>
                                </View>
                            </View>
                        </View>
                        {/* upload foto */}
                        <View style={{ width: '100%', alignItems: 'center', marginBottom: 24 }}>
                            <PickImage
                                onImagePicked={this.imagePickedHandler1}
                                ref={ref => (this.imagePicker = ref)}
                            />
                        </View>
                        {/* kirim */}
                        <View style={{ width: Dimensions.get('window').width, backgroundColor: '#C4C4C4' }}>
                            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginVertical: 24 }}>
                                <TouchableOpacity onPress={this.onRequestHandler}>
                                    <View style={{ width: 155, height: 40, backgroundColor: '#FF9D00', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <TextMedium style={{ color: '#ffffff', fontSize: 22 }}>Kirim</TextMedium>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>


                    {/* <View style={{ paddingVertical: 10, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: "#490E14" }}>
                        <Text style={styles.confirmText}>Silahkan isi form di bawah ini Konfirmasi Pembayaran </Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ width: 100, color: "#490E14" }}>Kode Booking: </Text>
                        <Text style={{ fontWeight: 'bold' }}>{this.props.paymentconfirm.reservation_number}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ width: 100, color: "#490E14" }}>Total Tagihan: </Text>
                        <Text style={{ fontWeight: 'bold' }}>{this.props.paymentconfirm.tour_departure.tour.currency} {this.props.paymentconfirm.total_amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} </Text>

                    </View>
                    {rate_conversion}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ width: 100, color: "#490E14" }}>Nama: </Text>
                        <DefaultInput
                            placeholder="Tulis Nama Pengirim Uang"
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
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ width: 100, color: "#490E14" }}>Telepon: </Text>
                        <DefaultInput
                            placeholder="Tulis Telepon Anda"
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
                    {sudah_dibayar}
                    {sisa_tagihan}
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ width: 150, color: "#490E14" }}>Jumlah pembayaran ({this.props.paymentconfirm.tour_departure.tour.currency}) </Text>
                        <DefaultInput
                            placeholder="Tulis jumlah uang"
                            style={styles.input}
                            value={this.state.jumlah_bayar}
                            onChangeText={val => this.setState({ jumlah_bayar: val })}
                            //valid={this.state.controls.email.valid}
                            //touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 5 }}>
                        <Text style={{ width: 200, color: "#490E14" }}>Upload bukti Bayar (Optional) </Text>
                    </View>
                    <PickImage
                        onImagePicked={this.imagePickedHandler1}
                        ref={ref => (this.imagePicker = ref)}
                    />
                    <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                        <Button
                            title="KIRIM KONFIRMASI BAYAR"
                            onPress={this.onRequestHandler}
                            color="#490E14"
                        />
                    </View> */}
                </View>

            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#ffffff'
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
})

export default connect(null, null)(PaymentConfirm);



