/**
 * Created by mata on 6/7/18.
 */

import React, {Component} from "react";
import { connect } from "react-redux";
import {paymentConfirm} from "../../store/actions/index";

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
    AsyncStorage,
    FlatList
} from "react-native";


class PaymentRecord extends Component {

    state = {
        email:'',
        pembelian:null
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        AsyncStorage.getItem("ap:auth:email").then((value) => {
            this.setState({email: value});
        })
            .then(res => {
                let url = "https://travelfair.co/api/orderbyemail/"+this.state.email;
                console.log('URL:', url)
                fetch(url)
                    .catch(err => {
                        console.log(err);
                        alert("Error accessing travelfair");
                        //dispatch(uiStopLoading());
                    })
                    .then(res => res.json())
                    .then(parsedRes => {
                        this.setState({pembelian: parsedRes})
                    })
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

    paymentConfirm = item => {
        this.props.onConfirmPayment(item)
    }

    renderNotes = item => {
        if(item.notes != undefined){
            return(
                <View>
                    <Text style={{paddingLeft:5}}><Text style={{paddingLeft:10, fontWeight:'bold', color:"#490E14"}}>Notes: </Text></Text>
                    <Text style={{paddingLeft:5}}><Text style={{paddingLeft:10}}></Text>{item.notes}</Text>
                </View>
            )
        }
    }

    renderButton = item => {
        console.log(item)
        if(item.status != "Full Paid Confirmed"){
            return (
                <View>
                    {this.renderNotes(item)}
                    <View style={{paddingVertical:10, paddingHorizontal:40}}>
                        <Button title="Konfirmasi Bayar" onPress={() => this.paymentConfirm(item)} color="#C91728"/>
                    </View>
                </View>
            )
        }else {
            return (
                <View>
                    <View style={{paddingVertical:10, paddingHorizontal:40}}>
                        <Button disabled={true} title="Konfirmasi Bayar" onPress={() => this.paymentConfirm(item)} color="#C91728"/>
                    </View>
                </View>
            )
        }

    }

    render() {

        return (
            <ScrollView>
                <View style={styles.container}>
                    <FlatList
                        data={this.state.pembelian}
                        keyExtractor={(item, index) => index}
                        renderItem={({item}) =>
                            <View style={{ marginVertical:5, borderWidth:0.5, padding:5}}>
                                <View style={{backgroundColor:"#490E14"}}>
                                    <Text style={{padding: 5, fontWeight:'bold', color:"white"}}>Booking code: {item.reservation_number} </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: '#490E14',
                                        borderBottomWidth: 0.5,
                                    }}
                                />
                                <Text style={{paddingLeft:5}}><Text style={{paddingLeft:10, fontWeight:'bold', color:"#490E14"}}>Tour:  </Text>{item.tour_departure.tour.name} </Text>
                                <Text style={{paddingLeft:5}}><Text style={{paddingLeft:10, fontWeight:'bold', color:"#490E14"}}>Total Tagihan:  </Text> {item.tour_departure.tour.currency} {item.total_amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                                <Text style={{paddingLeft:5}}><Text style={{paddingLeft:10, fontWeight:'bold', color:"#490E14"}}>Status: </Text> {item.status}</Text>
                                {this.renderButton(item)}
                            </View>
                        }
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
});

const mapDispatchToProps = dispatch => {
    return {
        onConfirmPayment: (item) => dispatch(paymentConfirm(item))
    };
};

export default connect(null, mapDispatchToProps)(PaymentRecord);



