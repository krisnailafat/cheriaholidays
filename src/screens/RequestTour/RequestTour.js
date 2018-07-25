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

class RequestTour extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    state = {
        nama:'',
        telepon:'',
        tourtype:'Group',
        tgl_berangkat: new Date().toISOString().slice(0,10),
        hotel:'Bebas',
        tiket:'Include',
        itinerary:'',
        destination:'',
        token:'',
        budget:'0',
        number_participant_adult:'1',
        number_participant_child:'0',
        number_participant_infant:'0',
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

        AsyncStorage.getItem("ap:auth:token").then((value) => {
            this.setState({"token": value});
        })
            .then(res => {
                console.log('token:', this.state.token)
                fetch(
                    "https://travelfair.co/api/tourinquiry/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token "+this.state.token
                        },
                        body: JSON.stringify({
                            name_applicant:this.state.nama,
                            phone_number:this.state.telepon,
                            destination:this.state.destination,
                            tour_type:this.state.tourtype,
                            number_participant_adult:this.state.number_participant_adult,
                            number_participant_child:this.state.number_participant_child,
                            number_participant_infant:this.state.number_participant_infant,
                            departure_date:new Date(this.state.tgl_berangkat).toISOString().slice(0,10),
                            budget:this.state.budget,
                            hotel_type:this.state.hotel,
                            ticket_type:this.state.tiket,
                            itinerary:this.state.itinerary,
                            currency:"IDR"
                        })
                    }
                ).then(() =>{
                    Alert.alert(
                        'Inquiry Sukses',
                        'Terima kasih atas inquiry yg diberikan.\nKami akan & memfollowup permintaan Anda.',
                        [
                            {text: 'OK', onPress: () => startMainTabs()},
                        ],
                        { cancelable: false }
                    )

                        //alert("Inquiry Tour Sukses.\nKami akan & memfollowup permintaan Anda.")
                        //startMainTabs();
                    }
                )
                .catch(err => alert("Inquiry error.\nPastikan semua data terisi lengkap!"));
            });





    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <View style={{paddingVertical:10, flexDirection:'column', alignItems:'center', justifyContent:'center', backgroundColor:"#490E14"}}>
                        <Text style={styles.confirmText}>Silahkan isi form di bawah ini untuk request di luar paket default yang kami tawarkan </Text>
                    </View>
                </View>
                <View style={styles.inputContainer}>
                    <View  style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text style={{width:80, color:"#490E14"}}>Nama: </Text>
                        <DefaultInput
                            placeholder="Tulis Nama Anda"
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
                        <Text style={{width:80, color:"#490E14"}}>Telepon: </Text>
                        <DefaultInput
                            placeholder="Tulis Nomor Telepon"
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
                        <Text style={{width:80, color:"#490E14"}}>Kota / negara tujuan: </Text>
                        <DefaultInput
                            placeholder="Tulis kota tujuan"
                            style={styles.input}
                            value={this.state.destination}
                            onChangeText={val => this.setState({destination: val})}
                            //valid={this.state.controls.email.valid}
                            //touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text  style={{width:80, color:"#490E14"}}>Tipe Tour: </Text>
                        <Picker
                            selectedValue={this.state.tourtype}
                            style={{ height: 50, width: 200 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({tourtype: itemValue})}>
                            <Picker.Item label="Group" value="Group" />
                            <Picker.Item label="FIT" value="FIT" />
                            <Picker.Item label="SIC" value="SIC" />
                        </Picker>
                    </View>

                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text  style={{width:80, color:"#490E14"}}>Peserta</Text>
                        <Text>Dewasa:</Text>
                        <Picker
                            selectedValue={this.state.number_participant_adult}
                            style={{ height: 50, width:50}}
                            onValueChange={(itemValue, itemIndex) => this.setState({number_participant_adult: itemValue})}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="lebih dari 4" value="lebih dari 4" />
                        </Picker>
                        <Text>Anak: </Text>
                        <Picker
                            selectedValue={this.state.number_participant_child}
                            style={{ height: 50, width:50}}
                            onValueChange={(itemValue, itemIndex) => this.setState({number_participant_child: itemValue})}>
                            <Picker.Item label="0" value="0" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label=">3" value=">3" />
                        </Picker>
                        <Text>Bayi:</Text>
                        <Picker
                            selectedValue={this.state.number_participant_infant}
                            style={{ height: 50, width:50}}
                            onValueChange={(itemValue, itemIndex) => this.setState({number_participant_infant: itemValue})}>
                            <Picker.Item label="0" value="0" />
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label=">3" value=">3" />
                        </Picker>
                    </View>

                    <View  style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text style={{width:80, color:"#490E14"}}>Budget:</Text>
                        <DefaultInput
                            placeholder="Tulis kisaran anggaran"
                            style={{width:100}}
                            value={this.state.budget}
                            onChangeText={val => this.setState({budget: val})}
                            //valid={this.state.controls.email.valid}
                            //touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                        <Text> IDR</Text>
                    </View>

                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text  style={{width:130, color:"#490E14"}}>Tanggal Berangkat: </Text>
                        <DatePicker
                            style={{width: 200}}
                            date={this.state.tgl_berangkat}
                            mode="date"
                            placeholder="select date"
                            format="YYYY-MM-DD"
                            minDate={new Date()}
                            maxDate="2030-06-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                            }}
                            onDateChange={val => this.setState({tgl_berangkat: val})}
                        />
                    </View>

                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text  style={{width:80, color:"#490E14"}}>Tipe Hotel: </Text>
                        <Picker
                            selectedValue={this.state.hotel}
                            style={{ height: 50, width: 200 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({hotel: itemValue})}>
                            <Picker.Item label="Bebas" value="Bebas" />
                            <Picker.Item label="Bintang 3" value="Bintang 3" />
                            <Picker.Item label="Bintang 4" value="Bintang 4" />
                            <Picker.Item label="Bintang 5" value="Bintang 5" />
                        </Picker>
                    </View>


                    <View style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text  style={{width:80, color:"#490E14"}}>Jenis Tiket: </Text>
                        <Picker
                            selectedValue={this.state.tiket}
                            style={{ height: 50, width: 200 }}
                            onValueChange={(itemValue, itemIndex) => this.setState({tiket: itemValue})}>
                            <Picker.Item label="Include" value="Include" />
                            <Picker.Item label="Not Include" value="Not Include" />
                        </Picker>
                    </View>
                    <View  style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text  style={{width:80, color:"#490E14"}}>Itinerary: </Text>
                        <DefaultInput
                            placeholder=""
                            value={this.state.itinerary}
                            style={styles.button}
                            onChangeText={val => this.setState({itinerary: val})}
                            //valid={this.state.controls.email.valid}
                            //touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                            multiline={true}
                            numberOfLines={4}
                        />
                    </View>
                    <View  style={{paddingVertical:20,alignItems:'center'}}>
                        <Button
                            title="KIRIM INQUIRY"
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
        margin:5,
    },
    input:{
      flex:1
    },
    confirmText:{
        paddingHorizontal:5,
        justifyContent:'center',
        fontSize:16,
        fontWeight:'bold',
        textAlign:"center",
        color:"white"
    },
    button: {
        flexDirection:'column',
        alignItems:'center',
        justifyContent:'center',
        paddingTop:15,
        flex:1
    },
})

export default connect(null, null)(RequestTour);


