/**
 * Created by mata on 6/7/18.
 */

import React, {Component} from "react";
import { connect } from "react-redux";
import {startPayment} from "../../store/actions/index";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import Icon from "react-native-vector-icons/Entypo";

import {
    Alert,
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
    Picker,
    AsyncStorage
} from "react-native";

class TourOrder extends Component {

    state = {
        tour_departure:999,
        traveler: [],
        status:"",
        email:"",
        nama:"",
        telepon:"",
        order_price_adult:0,
        order_price_child:0,
        order_price_infant:0,
        order_jumlah_adult:1,
        order_jumlah_child:0,
        order_jumlah_infant:0,
        total_tagihan:0,
    }

    componentWillMount(){
        AsyncStorage.getItem("ap:auth:email").then((value) => {
            this.setState({"email": value});
            this.setState({order_price_adult: this.props.order.price_adult})
            this.setState({order_price_child: this.props.order.price_child})
            this.setState({order_price_infant: this.props.order.price_infant})
            this.setState({total_tagihan: (this.state.order_price_adult*this.state.order_jumlah_adult)+
            (this.state.order_price_child*this.state.order_jumlah_child)+
            (this.state.order_price_infant*this.state.order_jumlah_infant)
            })
        })
            .then(res => {
                // console.log('state email on drawer:', this.state.email)
            })
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        //console.log('tour order', this.props)
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
        console.log('request data for', this.state);
        console.log('this.state.tour_departure', this.state.tour_departure)

        AsyncStorage.getItem("ap:auth:token").then((value) => {
            this.setState({"token": value});
        })
            .then(res => {
                //console.log('this.state.tour_departure 2', this.state.tour_departure)
                //console.log('this.state.tour_departure 2', this.state.reservation_number)
                fetch(
                    "https://travelfair.co/api/order/",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token "+this.state.token
                        },
                        body: JSON.stringify({
                            tour_departure: this.state.tour_departure,
                            traveler: [],
                            reservation_number: this.props.reserve_number,
                            status: "Waiting",
                            total_amount:this.state.total_tagihan,
                            order_user:{
                                fullname:this.state.nama,
                                email:this.state.email,
                                phone:this.state.telepon
                            },

                        }),
                        //TODO masukin total_tagihan, phone,
                    }
                ).then(() =>{
                        Alert.alert(
                            'ORDER Sukses',
                            'Terima kasih atas ORDER yg diberikan.\nKami akan & memfollowup ORDER Anda.',
                            [
                                {text: 'OK', onPress: this.props.onPayment},
                            ],
                            { cancelable: false }
                        )

                        //alert("Inquiry Tour Sukses.\nKami akan & memfollowup permintaan Anda.")
                        //startMainTabs();
                    }
                )
                    .catch(err => {
                        alert("ORDER error.\nPastikan semua data terisi lengkap!");
                        console.log(err)
                    });
            });
    }

    onPlusAdultPressed = () => {
        this.setState({order_jumlah_adult:this.state.order_jumlah_adult+1})
        this.setState({total_tagihan: ((this.state.order_price_adult*(this.state.order_jumlah_adult+1))+
        (this.state.order_price_child*this.state.order_jumlah_child)+
        (this.state.order_price_infant*this.state.order_jumlah_infant))
        })
    }

    onMinusAdultPressed = () => {
        if(this.state.order_jumlah_adult != 0){
            this.setState({order_jumlah_adult:this.state.order_jumlah_adult-1})
            this.setState({total_tagihan: ((this.state.order_price_adult*(this.state.order_jumlah_adult-1))+
            (this.state.order_price_child*this.state.order_jumlah_child)+
            (this.state.order_price_infant*this.state.order_jumlah_infant))
            })
        }
    }

    onPlusChildPressed = () => {
        this.setState({order_jumlah_child:this.state.order_jumlah_child+1})
        this.setState({total_tagihan: ((this.state.order_price_adult*this.state.order_jumlah_adult)+
        (this.state.order_price_child*(this.state.order_jumlah_child+1))+
        (this.state.order_price_infant*this.state.order_jumlah_infant))
        })
    }

    onMinusChildPressed = () => {
        if(this.state.order_jumlah_child != 0){
            this.setState({order_jumlah_child:this.state.order_jumlah_child-1})
            this.setState({total_tagihan: ((this.state.order_price_adult*this.state.order_jumlah_adult)+
            (this.state.order_price_child*(this.state.order_jumlah_child-1))+
            (this.state.order_price_infant*this.state.order_jumlah_infant))
            })
        }
    }

    onPlusInfantPressed = () => {
        this.setState({order_jumlah_infant:this.state.order_jumlah_infant+1})
        this.setState({total_tagihan: ((this.state.order_price_adult*this.state.order_jumlah_adult)+
        (this.state.order_price_child*this.state.order_jumlah_child)+
        (this.state.order_price_infant*(this.state.order_jumlah_infant+1)))
        })
    }

    onMinusInfantPressed = () => {
        if(this.state.order_jumlah_infant != 0){
            this.setState({order_jumlah_infant:this.state.order_jumlah_infant-1})
            this.setState({total_tagihan: ((this.state.order_price_adult*this.state.order_jumlah_adult)+
            (this.state.order_price_child*this.state.order_jumlah_child)+
            (this.state.order_price_infant*(this.state.order_jumlah_infant-1)))
            })
        }
    }


    render() {
        departure = () => {
            if(this.props.order.departures.length ==0){
                return(
                    <Text>Tidak ada keberangkatan untuk tour ini</Text>
                )
            }else{
                let departures = []
                for(i=0;i<this.props.order.departures.length;i++){
                    console.log('this.props.departures[i].departure_date', this.props.order.departures[i].departure_date, this.props.order.departures[i].id)
                    departures.push(<Picker.Item key = {i} label={this.props.order.departures[i].departure_date} value={this.props.order.departures[i].id} />)
                }
                return(
                    departures
                )
            }
        }

        return (
            <ScrollView>
                <View  style={{padding:15}}>
                    <View style={{backgroundColor:"#490E14"}}>
                        <Text style={{paddingVertical:8, paddingHorizontal:8, fontWeight:'bold', color:'white'}}>{this.props.order.name.toUpperCase()}</Text>
                    </View>
                    <View style={{padding:5}}>
                    <Text style={{paddingVertical:10,color:"#490E14"}}>Reservation Number: <Text style={{fontWeight:'bold', color:"red"}}>{this.props.reserve_number}</Text></Text>
                    <View  style={{flexDirection: 'row', alignItems:'center'}}>
                        <Text style={{width:80, color:"#490E14"}}>Nama: </Text>
                        <DefaultInput
                            placeholder="Tulis Nama Pemesan"
                            style={{flex:1}}
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
                            placeholder="Tulis Telepon Anda"
                            style={{flex:1}}
                            value={this.state.telepon}
                            onChangeText={val => this.setState({telepon: val})}
                            //valid={this.state.controls.email.valid}
                            //touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        />
                    </View>
                        <Text style={{paddingBottom:10, paddingTop:5, color:'#490E14'}}>Total Tagihan : <Text style={{fontWeight:'bold'}}> {this.props.order.currency} {this.state.total_tagihan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text></Text>
                    <View style={{padding:5, flexDirection:"row", alignItems:'center', justifyContent:'center'}}>
                        <Text style={{width:150}}> - Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                        <TouchableOpacity onPress={this.onMinusAdultPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#490E14"
                                style = {{paddingLeft:40}}
                            />
                        </TouchableOpacity>
                        <Text style = {{paddingLeft:30}}>{this.state.order_jumlah_adult}</Text>
                        <TouchableOpacity onPress={this.onPlusAdultPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#490E14"
                                style = {{paddingLeft:30}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{padding:5, flexDirection:"row", alignItems:'center', justifyContent:'center'}}>
                        <Text  style={{width:150}}> - Child : {this.props.order.currency} {this.state.order_price_child.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                        <TouchableOpacity onPress={this.onMinusChildPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#490E14"
                                style = {{paddingLeft:40}}
                            />
                        </TouchableOpacity>
                        <Text style = {{paddingLeft:30}}>{this.state.order_jumlah_child}</Text>
                        <TouchableOpacity onPress={this.onPlusChildPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#490E14"
                                style = {{paddingLeft:30}}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{padding:5, flexDirection:"row", alignItems:'center', justifyContent:'center'}}>
                        <Text  style={{width:150}}> - Infant: {this.props.order.currency} {this.state.order_price_infant.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                        <TouchableOpacity onPress={this.onMinusInfantPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#490E14"
                                style = {{paddingLeft:40}}
                            />
                        </TouchableOpacity>
                        <Text style = {{paddingLeft:30}}>{this.state.order_jumlah_infant}</Text>
                        <TouchableOpacity onPress={this.onPlusInfantPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#490E14"
                                style = {{paddingLeft:30}}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={{paddingTop:10,color:"#490E14"}}>Pilih Keberangkatan: </Text>
                    <Picker
                        selectedValue={this.state.tour_departure}
                        style={{ height: 50, width:200}}
                        onValueChange={(itemValue, itemIndex) =>
                        {
                            if(itemValue === "null"){
                                alert('tanggal belum dipilih')
                            }else{
                                this.setState({tour_departure: itemValue})
                            }
                        }}>
                        <Picker.Item label="..." value="null" />
                        {departure()}
                    </Picker>
                    <View style={{paddingTop:10, paddingBottom:20,alignItems:'center'}}>
                        <Button title="KIRIM SEKARANG" onPress={this.onRequestHandler} color="#490E14"/>
                    </View>
                    </View>
                </View>
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
});

const mapDispatchToProps = dispatch => {
    return {
        onPayment: () => dispatch(startPayment())
    };
};

export default connect(null, mapDispatchToProps)(TourOrder);




