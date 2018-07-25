/**
 * Created by mata on 6/4/18.
 */

import React, {Component} from "react";
import { connect } from "react-redux";
import {startOrderTour} from "../../store/actions/index";

import ParallaxScrollView from 'react-native-parallax-scroll-view';
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
    Linking
} from "react-native";


class TourDetail extends Component {

    state = {
        menu:["Itinerary", "Notes","Schedule"]
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
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

    price = () => {
        return(
            <Text>Rp. </Text>
        )
    }

    shareToWhatsAppWithContact = (text, phoneNumber) => {
        Linking.openURL(`whatsapp://send?text=${text}&phone=${phoneNumber}`);
    }

    renderDepartureDate = (departure) => {
        console.log('jumlah berangkat', departure.length, ' -- ',departure)

        if(departure.length ==0){
            return(
                <Text>Tidak ada keberangkatan untuk tour ini</Text>
            )
        }else{
            departures = []
            for(i=0;i<departure.length;i++){
                departures.push( <Text key={i} style={{paddingLeft:5}}>- {departure[i].departure_date}</Text>)
            }
            return(
                departures
            )
        }

    }

    onOrderHandler = () => {
        let year =  new Date().getYear();
        let month = new Date().getMonth();
        let day = new Date().getDay()
        let random = (""+Math.random()).substring(5,7)
        let reserve_number = 'CHE'+year+month+day+random
        this.props.onOrder(this.props.tourcontent, reserve_number)
    }

    render() {
        console.log('this props detail:', this.props.tourcontent.images)
        let price = (
            <Text>IDR</Text>
        )
        if(this.props.tourcontent.currency === "USD"){
            price = (
                <Text>USD</Text>
            )
        }
        return (
            <ParallaxScrollView
                backgroundColor="#490E14"
                contentBackgroundColor="white"
                parallaxHeaderHeight={220}
                stickyHeaderHeight={50}
                renderStickyHeader={() => (
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', paddingHorizontal: 5, paddingVertical:10,backgroundColor:"#490E14"}}>
                        <Text style={{fontSize:14, color: 'white', flexWrap: 'wrap', flex:1}}>{this.props.tourcontent.name}</Text>
                    </View>

                )}
                renderForeground={() => (
                    <View style={styles.listItem}>
                        <Image resizeMode="cover" source={{uri: this.props.tourcontent.images}} style={styles.placeImage}/>
                        <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal: 5, paddingVertical:10,backgroundColor:"#490E14"}}>
                            <Text style={{fontSize:14, color: 'white', flexWrap: 'wrap', flex:1}}>{this.props.tourcontent.name}</Text>
                        </View>
                    </View>
                )}>

                <View style={styles.content}>
                    <Text style={{fontWeight:'bold'}}>Tour Summary:</Text>
                    <Text style={{textAlign:'justify', flex:1}}>{this.props.tourcontent.tour_summary}</Text>
                    <Text style={{fontWeight:'bold', paddingTop:10}}>Itinerary:</Text>
                    <Text>{this.props.tourcontent.itinerary}</Text>
                    <Text style={{fontWeight:'bold', paddingTop:10}}>Pricing: </Text>
                    <Text style={{paddingLeft:5}}>- Adult: {price} {this.props.tourcontent.price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                    <Text style={{paddingLeft:5}}>- Child: {price} {this.props.tourcontent.price_child.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                    <Text style={{paddingLeft:5}}>- Infant: {price} {this.props.tourcontent.price_infant.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                    <Text style={{paddingTop:10}}><Text style={{fontWeight:'bold'}}>Durasi: </Text>{this.props.tourcontent.day_duration} D {this.props.tourcontent.night_duration} N</Text>
                    <Text><Text style={{fontWeight:'bold'}}>Bonus Point: </Text>{this.props.tourcontent.poin}</Text>
                </View>
                <View style={styles.content}>
                    <Text style={{fontWeight:'bold'}}>Tanggal Keberangkatan:</Text>
                    {this.renderDepartureDate(this.props.tourcontent.departures)}
                </View>
                <View style={styles.content}>
                    <Text style={{fontWeight:'bold'}}>Notes:</Text>
                    <Text>{this.props.tourcontent.notes}</Text>
                </View>

                <View style={{paddingTop:10, paddingBottom:20,alignItems:'center'}}>
                    <Button
                        title="PESAN SEKARANG"
                        onPress={this.onOrderHandler}
                        color="#490E14"
                    />
                </View>


            </ParallaxScrollView>

        );
    }
}

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        height:230,
        marginBottom: 5,
        paddingVertical:10,
        paddingHorizontal:5,
        backgroundColor: "#e5e5e5",
        flexDirection: "column",
    },
    content:{
        margin:5,
        paddingVertical:10,
        paddingHorizontal:5,
    },
    placeImage: {
        marginRight: 8,
        height: 150,
        width: "100%"
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onOrder: (order, reserve_number) => dispatch(startOrderTour(order, reserve_number))
    };
};

export default connect(null, mapDispatchToProps)(TourDetail);


