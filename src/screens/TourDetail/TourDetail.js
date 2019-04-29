/**
 * Created by mata on 6/4/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { startOrderTour, setLogged } from "../../store/actions/index";

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
    Linking,
    ImageBackground,
    AsyncStorage
} from "react-native";
import { TextMedium, TextNormal, TextSemiBold, TextBold } from "../../components/UI/TextCustom/TextCustom";
import Card from '../../components/Card/Card'
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import ProgressiveImage from "../../components/UI/ProgressiveImage/ProgressiveImage"


class TourDetail extends Component {

    static navigatorStyle = {
        navBarTransparent: true,
        tabBarHidden: true,
        topBarElevationShadowEnabled: false,
    };

    state = {
        menu: ["Itinerary", "Notes", "Schedule"],
        harga: [
            { type: "Adult:", price: this.props.tourcontent.price_adult },
            { type: "Child:", price: this.props.tourcontent.price_child },
            { type: "Infant:", price: this.props.tourcontent.price_infant },
            { type: "Price Adult Double:", price: this.props.tourcontent.price_adult_double },
            { type: "Price Adult Twin:", price: this.props.tourcontent.price_adult_twin },
            { type: "Price Adult Triple:", price: this.props.tourcontent.price_adult_triple },
            { type: "Price Adult Quad:", price: this.props.tourcontent.price_adult_quad },
            { type: "Price Child Double:", price: this.props.tourcontent.price_child_double },
            { type: "Price Child Twin:", price: this.props.tourcontent.price_child_twin },
            { type: "Price Child Triple:", price: this.props.tourcontent.price_child_triple },
            { type: "Price Child Quad:", price: this.props.tourcontent.price_child_quad }
        ],
        activeSections: [],
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

    componentDidUpdate() {
        console.log('componentDidUpdate tour detail')
        if (this.props.isLogin) {
            AsyncStorage.getItem("ap:logged").then((value) => {
                if (value !== null) {
                    this._onOrderHandler()
                    this.props.onSetLogged()
                }
            })
        }
    }

    price = () => {
        return (
            <Text>Rp. </Text>
        )
    }

    shareToWhatsAppWithContact = (text, phoneNumber) => {
        Linking.openURL(`whatsapp://send?text=${text}&phone=${phoneNumber}`);
    }

    renderDepartureDate = (departure) => {
        // console.log('jumlah berangkat', departure.length, ' -- ', departure)

        if (departure.length == 0) {
            return (
                <TextNormal style={{ color: '#404040', fontSize: 14, marginBottom: 6 }}>Tidak ada keberangkatan untuk tour ini</TextNormal>
            )
        } else {
            departures = []
            for (i = 0; i < departure.length; i++) {
                departures.push(<TextNormal key={i} style={{ color: '#404040', fontSize: 14, marginBottom: 6 }}>- {departure[i].departure_date}</TextNormal>)
            }
            return (
                departures
            )
        }

    }

    _onOrderHandler = () => {
        let year = new Date().getYear();
        let month = new Date().getMonth();
        let day = new Date().getDay()
        let random = ("" + Math.random()).substring(5, 7)
        let reserve_number = 'CHE' + year + month + day + random
        // this.props.onOrder(this.props.tourcontent, reserve_number)

        this.props.navigator.push({
            screen: "cheria-holidays.TourOrder",
            title: "Pemesanan Tour",
            passProps: {
                order: this.props.tourcontent,
                reserve_number: reserve_number
            }
        });
    }

    onOrderHandler = () => {

        AsyncStorage.getItem("ap:logged").then((value) => {

            if (value !== null) {
                this._onOrderHandler()
            }
            else {
                this.props.navigator.showModal({
                    screen: 'cheria-holidays.AuthScreen', // unique ID registered with Navigation.registerScreen
                    title: 'Log In', // navigation bar title of the pushed screen (optional)
                    navigatorStyle: {
                        // tabBarHidden: true,
                        // drawUnderTabBar: true
                    }, // override the navigator style for the pushed screen (optional)
                    passProps: {
                        valueAuth: 'login',
                        // enableScreenUpdates: () => this.setState({ canUpdate: true })
                    },
                    animationType: 'fade',
                    adjustSoftInput: "pan"
                });
            }
        })


        // Promise.all([
        //     Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30)
        // ]).then(sources => {


        // Navigation.startSingleScreenApp({
        //     screen: {
        //         screen: "cheria-holidays.TourOrder",
        //         title: "Pemesanan Tour Cheria",
        //         navigatorButtons: {
        //             leftButtons: [
        //                 {
        //                     icon: sources[0],
        //                     title: "Menu",
        //                     id: "sideDrawerToggle"
        //                 }
        //             ]
        //         }
        //     },
        //     drawer: {
        //         left: {
        //             screen: "cheria-holidays.SideDrawer"
        //         }
        //     },
        //     appStyle: {
        //         navBarTextColor: "#490E14",
        //         navBarButtonColor: "#490E14"
        //     },
        //     passProps: {
        //         order: order,
        //         reserve_number: reserve_number
        //     }
        // });
        // })

    }


    render() {
        // console.log('this props detail:', this.props.tourcontent)
        let price = (
            <TextNormal>IDR</TextNormal>
        )
        let rate_conversion = null
        if (this.props.tourcontent.currency === "USD") {
            price = (
                <TextNormal>USD</TextNormal>
            )
            rate_conversion = (
                <TextSemiBold style={{}}>(1 USD = {this.props.tourcontent.conversion_rate.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} IDR)</TextSemiBold>
            )
        }
        // return harga
        let list_harga = []
        if (this.state.harga != null) {
            if (this.state.harga != 0) {
                // console.log("ini pembayaran ", this.state.harga)
                list_harga = this.state.harga.map((item, key) => {
                    // console.log("ini harga ", item, " ", key)
                    if (item.price != null) {
                        return (
                            <View key={key}>
                                <TextNormal style={{ color: '#404040', fontSize: 14, marginBottom: 6 }}>- {item.type} {price} {item.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextNormal>
                            </View>
                        )
                    }

                })
            }
        }

        return (
            <ScrollView style={{ backgroundColor: '#ffffff' }}>
                <View style={styles.mainContainer}>
                    {/* gambar */}
                    {/* <ProgressiveImage thumbnailSource={{ uri: this.props.tourcontent.images }} source={{ uri: this.props.tourcontent.images }} imageStyle={{ resizeMode: 'cover', }} style={{ width: Dimensions.get('window').width, height: 400 }} > */}
                    <ImageBackground source={{ uri: this.props.tourcontent.images }} imageStyle={{ resizeMode: 'cover', }} style={{ width: Dimensions.get('window').width, height: 400 }} >
                        {/* panel detail gambar */}
                        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 5, justifyContent: 'flex-end' }}>
                            <View style={{ width: '100%', paddingLeft: 19 }}>
                                <TextSemiBold style={{ color: '#ffffff', fontSize: 22 }}>{this.props.tourcontent.name}</TextSemiBold>
                                <TextMedium style={{ color: '#ffffff', fontSize: 12, marginBottom: 5 }}>Bonus Point {this.props.tourcontent.poin}</TextMedium>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ width: 47, height: 22, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#FEBB12', borderRadius: 3, marginRight: 10 }}>
                                        <TextMedium style={{ color: '#ffffff', fontSize: 13 }}>{this.props.tourcontent.day_duration}</TextMedium>
                                        <TextMedium style={{ color: '#ffffff', fontSize: 13 }}>Days</TextMedium>
                                    </View>
                                    <View style={{ width: 47, height: 22, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#4F7BBE', borderRadius: 3 }}>
                                        <TextMedium style={{ color: '#ffffff', fontSize: 13 }}>{this.props.tourcontent.night_duration}</TextMedium>
                                        <TextMedium style={{ color: '#ffffff', fontSize: 13 }}>Night</TextMedium>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                    {/* bagian detai;  */}
                    <View style={{ flex: 1, alignItems: 'center', width: Dimensions.get('window').width, backgroundColor: '#C4C4C4' }}>
                        {/* collapse data */}
                        <View style={{ width: "100%", borderWidth: 0, marginTop: 8, marginBottom: 8, paddingHorizontal: 16, backgroundColor: '#ffffff' }}>
                            <View style={{ width: "100%" }}>
                                <Card title='Tour Summary' expanded={false} style={{ color: '#404040', fontSize: 16 }}>
                                    <TextNormal style={{ color: '#404040', fontSize: 14 }}>{this.props.tourcontent.tour_summary}</TextNormal>
                                </Card>
                            </View>
                        </View>
                        <View style={{ width: "100%", borderWidth: 0, marginBottom: 8, paddingHorizontal: 16, backgroundColor: '#ffffff' }}>
                            <Card title='Itinerary' expanded={false} style={{ color: '#404040', fontSize: 16 }}>
                                <TextNormal style={{ color: '#404040', fontSize: 14 }}>{this.props.tourcontent.itinerary}</TextNormal>
                            </Card>
                        </View>
                        <View style={{ width: "100%", borderWidth: 0, marginBottom: 8, paddingHorizontal: 16, backgroundColor: '#ffffff' }}>
                            <Card title='Notes' expanded={false} style={{ color: '#404040', fontSize: 16 }}>
                                <TextNormal style={{ color: '#404040', fontSize: 14 }}>{this.props.tourcontent.notes}</TextNormal>
                            </Card>
                        </View>
                        <View style={{ width: "100%", borderWidth: 0, marginBottom: 8, paddingHorizontal: 16, backgroundColor: '#ffffff' }}>
                            <Card title='Harga' expanded={false} style={{ color: '#404040', fontSize: 16 }}>
                                <TextNormal style={{ color: '#404040', fontSize: 14, marginBottom: 6 }}>Pricing: {rate_conversion}</TextNormal>
                                {list_harga}
                            </Card>
                        </View>
                        <View style={{ width: "100%", borderWidth: 0, marginBottom: 30, paddingHorizontal: 16, backgroundColor: '#ffffff', }}>
                            <Card title='Tanggal Keberangkatan' expanded={false} style={{ color: '#404040', fontSize: 16 }}>
                                {this.renderDepartureDate(this.props.tourcontent.departures)}
                            </Card>
                        </View>

                        {/* tombol pesa */}
                        <View style={{ width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center', marginBottom: 40 }}>
                            <TouchableOpacity onPress={this.onOrderHandler}>
                                <View style={{ height: 40, width: 155, backgroundColor: '#FF9D00', alignItems: 'center', justifyContent: 'center', borderRadius: 5 }}>
                                    <TextMedium style={{ color: '#ffffff', fontSize: 22 }}>Pesan</TextMedium>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView >

            // <ParallaxScrollView
            //     backgroundColor="#490E14"
            //     contentBackgroundColor="white"
            //     parallaxHeaderHeight={220}
            //     stickyHeaderHeight={50}
            //     renderStickyHeader={() => (
            //         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5, paddingVertical: 10, backgroundColor: "#490E14" }}>
            //             <Text style={{ fontSize: 14, color: 'white', flexWrap: 'wrap', flex: 1 }}>{this.props.tourcontent.name}</Text>
            //         </View>

            //     )}
            //     renderForeground={() => (
            //         <View style={styles.listItem}>
            //             <Image resizeMode="cover" source={{ uri: this.props.tourcontent.images }} style={styles.placeImage} />
            //             <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, paddingVertical: 10, backgroundColor: "#490E14" }}>
            //                 <Text style={{ fontSize: 14, color: 'white', flexWrap: 'wrap', flex: 1 }}>{this.props.tourcontent.name}</Text>
            //             </View>
            //         </View>
            //     )}>

            //     <View style={styles.content}>
            //         <Text style={{ fontWeight: 'bold' }}>Tour Summary:</Text>
            //         <Text style={{ textAlign: 'justify', flex: 1 }}>{this.props.tourcontent.tour_summary}</Text>
            //         <Text style={{ fontWeight: 'bold', paddingTop: 10 }}>Itinerary:</Text>
            //         <Text>{this.props.tourcontent.itinerary}</Text>
            //         <Text style={{ fontWeight: 'bold', paddingTop: 10 }}>Pricing: {rate_conversion}</Text>
            //         {list_harga}
            //         {/* <Text style={{ paddingLeft: 5 }}>- Adult: {price} {this.props.tourcontent.price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
            //         <Text style={{ paddingLeft: 5 }}>- Child: {price} {this.props.tourcontent.price_child.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
            //         <Text style={{ paddingLeft: 5 }}>- Infant: {price} {this.props.tourcontent.price_infant.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text> */}
            //         <Text style={{ paddingTop: 10 }}><Text style={{ fontWeight: 'bold' }}>Durasi: </Text>{this.props.tourcontent.day_duration} D {this.props.tourcontent.night_duration} N</Text>
            //         <Text><Text style={{ fontWeight: 'bold' }}>Bonus Point: </Text>{this.props.tourcontent.poin}</Text>
            //     </View>
            //     <View style={styles.content}>
            //         <Text style={{ fontWeight: 'bold' }}>Tanggal Keberangkatan:</Text>
            //         {this.renderDepartureDate(this.props.tourcontent.departures)}
            //     </View>
            //     <View style={styles.content}>
            //         <Text style={{ fontWeight: 'bold' }}>Notes:</Text>
            //         <Text>{this.props.tourcontent.notes}</Text>
            //     </View>

            //     <View style={{ paddingTop: 10, paddingBottom: 20, alignItems: 'center' }}>
            //         <Button
            //             title="PESAN SEKARANG"
            //             onPress={this.onOrderHandler}
            //             color="#490E14"
            //         />
            //     </View>


            // </ParallaxScrollView>

        );
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    listItem: {
        width: "100%",
        height: 230,
        marginBottom: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
        backgroundColor: "#e5e5e5",
        flexDirection: "column",
    },
    content: {
        margin: 5,
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    placeImage: {
        marginRight: 8,
        height: 150,
        width: "100%"
    }
});

const mapStateToProps = state => {
    return {
        isLogin: state.isLogin.isLogin,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrder: (order, reserve_number) => dispatch(startOrderTour(order, reserve_number)),
        onSetLogged: () => dispatch(setLogged()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TourDetail);


