/**
 * Created by mata on 6/4/18.
 */

import React, {Component} from "react";
import { connect } from "react-redux";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import PickImage from "../../components/PickImage/PickImage";
import startMainTabs from "../../screens/MainTabs/startMainTabs";

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
    ScrollView,
    Linking,
    Alert,
    AsyncStorage
} from "react-native";


class PaymentConfirm extends Component {

    state = {
        email:'',
        reservation_number:'',
        nama:'',
        telepon:'',
        jumlah_bayar:'0',
        image1:null
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        console.log('payment confirm:', this.props.paymentconfirm)
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
        AsyncStorage.getItem("ap:auth:email").then((value) => {
            this.setState({email: value});
        })
            .then(res => {
                var data = new FormData();
                //data.append('tour',this.props.paymentconfirm.tour_departure.tour.id)
                data.append('email', this.state.email)

                data.append('name', this.state.nama)
                data.append('phone_number', this.state.telepon)
                data.append('amount', this.state.jumlah_bayar)
                data.append('reservation_number', this.props.paymentconfirm.reservation_number)

                data.append('is_accepted',false)
                data.append('currency',this.props.paymentconfirm.tour_departure.tour.currency)
                if(this.state.image1 != null){
                    data.append('images', {
                        uri: this.state.image1.uri, // your file path string
                        name: Math.random().toString(36).substr(2, 5)+'.jpg',
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
                        body:data
                    }
                ).then(() =>{
                        Alert.alert(
                            'Konfirmasi Pembayaran Sukses',
                            '\nMohon di tunggu \nKami akan memeriksa pembayaran Anda',
                            [
                                {text: 'OK', onPress: () => {
                                    this.imagePicker.reset();
                                    //this.locationPicker.reset();
                                    startMainTabs();
                                }},
                            ],
                            { cancelable: false }
                        )
                    }
                )
                    .catch(err => alert("Konfirmas Pembayaran ERROR!!.\nPeriksa kembali jaringan Anda"));
            });
    }

    imagePickedHandler1 = image => {
        this.setState({image1:image})
        console.log(this.state.image1)
    };

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={{paddingVertical:10, flexDirection:'column', alignItems:'center', justifyContent:'center', backgroundColor:"#490E14"}}>
                        <Text style={styles.confirmText}>Silahkan isi form di bawah ini Konfirmasi Pembayaran </Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <View  style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text style={{width:100, color:"#490E14"}}>Kode Booking: </Text>
                        <Text style={{fontWeight:'bold'}}>{this.props.paymentconfirm.reservation_number}</Text>
                    </View>
                    <View  style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text style={{width:100, color:"#490E14"}}>Total Tagihan: </Text>
                        <Text style={{fontWeight:'bold'}}>{this.props.paymentconfirm.tour_departure.tour.currency} {this.props.paymentconfirm.total_amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                    </View>
                    <View  style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text style={{width:100, color:"#490E14"}}>Nama: </Text>
                        <DefaultInput
                            placeholder="Tulis Nama Pengirim Uang"
                            style={styles.input}
                            value={this.state.nama}
                            onChangeText={val => this.setState({nama: val})}
                            //valid={this.state.controls.email.valid}
                            //touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                    </View>
                    <View  style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text style={{width:100, color:"#490E14"}}>Telepon: </Text>
                        <DefaultInput
                            placeholder="Tulis Telepon Anda"
                            style={styles.input}
                            value={this.state.telepon}
                            onChangeText={val => this.setState({telepon: val})}
                            //valid={this.state.controls.email.valid}
                            //touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                    </View>
                    <View  style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text style={{width:150, color:"#490E14"}}>Jumlah pembayaran ({this.props.paymentconfirm.tour_departure.tour.currency}) </Text>
                        <DefaultInput
                            placeholder="Tulis jumlah uang"
                            style={styles.input}
                            value={this.state.jumlah_bayar}
                            onChangeText={val => this.setState({jumlah_bayar: val})}
                            //valid={this.state.controls.email.valid}
                            //touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                    </View>
                    <View  style={{flexDirection: 'row', alignItems:'center', paddingBottom:5}}>
                        <Text style={{width:200, color:"#490E14"}}>Upload bukti Bayar (Optional) </Text>
                    </View>
                    <PickImage
                        onImagePicked={this.imagePickedHandler1}
                        ref={ref => (this.imagePicker = ref)}
                    />
                    <View  style={{paddingVertical:20,alignItems:'center'}}>
                        <Button
                            title="KIRIM KONFIRMASI BAYAR"
                            onPress={this.onRequestHandler}
                            color="#490E14"
                        />
                    </View>
                </View>
            </ScrollView>

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
    input:{
        flex:1
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



