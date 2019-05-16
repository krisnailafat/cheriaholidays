/**
 * Created by mata on 6/7/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { startPayment, donePayment, startMainMenu, pushMainMenu } from "../../store/actions/index";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import Iconn from "react-native-vector-icons/Ionicons";
import Icon from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
//custom icon
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon

import {
    Alert,
    View,
    Image,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
    TouchableHighlight,
    ScrollView,
    Linking,
    Picker,
    AsyncStorage,
    Modal
} from "react-native";
import { TextMedium, TextNormal, TextSemiBold, TextBold } from "../../components/UI/TextCustom/TextCustom";

class TourOrder extends Component {

    static navigatorStyle = {
        navBarTextColor: '#2BB04C',
        tabBarHidden: true,
        navBarTextFontFamily: 'EncodeSans-Medium',
        navBarBackgroundColor: '#ffffff',
        navBarButtonColor: '#757575',

    };

    state = {
        modalVisible: false,
        tour_departure: 999,
        traveler: [],
        status: "",
        email: "",
        nama: "",
        telepon: "",
        order_price_adult: 0,
        order_price_child: 0,
        order_price_infant: 0,
        //set harga order
        order_price_adult_double: 0,
        order_price_adult_twin: 0,
        order_price_adult_triple: 0,
        order_price_adult_quad: 0,
        order_price_child_double: 0,
        order_price_child_twin: 0,
        order_price_child_triple: 0,
        order_price_child_quad: 0,

        order_jumlah_adult: 0,
        order_jumlah_child: 0,
        order_jumlah_infant: 0,
        //set jumlah order
        order_jumlah_adult_double: 0,
        order_jumlah_adult_twin: 0,
        order_jumlah_adult_triple: 0,
        order_jumlah_adult_quad: 0,
        order_jumlah_child_double: 0,
        order_jumlah_child_twin: 0,
        order_jumlah_child_triple: 0,
        order_jumlah_child_quad: 0,

        total_tagihan: 0,

        passengers: 0,
    }

    componentWillMount() {
        AsyncStorage.getItem("ap:auth:email").then((value) => {
            this.setState({ "email": value });
            this.setState({ order_price_adult: this.props.order.price_adult })
            this.setState({ order_price_child: this.props.order.price_child })
            this.setState({ order_price_infant: this.props.order.price_infant })

            //set harga order
            this.setState({ order_price_adult_double: this.props.order.price_adult_double })
            this.setState({ order_price_adult_twin: this.props.order.price_adult_twin })
            this.setState({ order_price_adult_triple: this.props.order.price_adult_triple })
            this.setState({ order_price_adult_quad: this.props.order.price_adult_quad })
            this.setState({ order_price_child_double: this.props.order.price_child_double })
            this.setState({ order_price_child_twin: this.props.order.price_child_twin })
            this.setState({ order_price_child_triple: this.props.order.price_child_triple })
            this.setState({ order_price_child_quad: this.props.order.price_child_quad })

            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })

        })
            .then(res => {
                // console.log('state email on drawer:', this.state.email)
            })
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        // console.log('tour order', this.props)
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
        // console.log('request data for', this.state);
        // console.log('this.state.tour_departure', this.state.tour_departure)

        //TODO empty handler

        if (this.state.nama != "" && this.state.telepon != "" && this.state.tour_departure != 999) {
            AsyncStorage.getItem("ap:auth:token").then((value) => {
                this.setState({ "token": value });
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
                                "Authorization": "Token " + this.state.token
                            },
                            body: JSON.stringify({
                                tour_departure: this.state.tour_departure,
                                traveler: [],
                                reservation_number: this.props.reserve_number,
                                status: "Waiting",
                                total_amount: this.state.total_tagihan,
                                order_user: {
                                    fullname: this.state.nama,
                                    email: this.state.email,
                                    phone: this.state.telepon
                                },

                            }),
                            //TODO masukin total_tagihan, phone,
                        }
                    ).then(() => {
                        Alert.alert(
                            'ORDER Sukses',
                            'Terima kasih atas ORDER yg diberikan.\nKami akan & memfollowup ORDER Anda.',
                            [
                                {
                                    text: 'OK', onPress: () =>
                                        this.props.onPaymentDoneGoToMainMenu().then(res => {
                                            AsyncStorage.setItem("ap:order:condition", JSON.stringify(true)).then(res => { console.log('res ', res) })
                                            // console.log('order kepanggil')
                                        })
                                },
                            ],
                            { cancelable: false }
                        )

                        //alert("Inquiry Tour Sukses.\nKami akan & memfollowup permintaan Anda.")
                        //startMainTabs();
                    }
                    )
                        .catch(err => {
                            alert("ORDER error.\nPastikan semua data terisi lengkap!");
                            // console.log(err)
                        });
                });
        } else {
            if (this.state.nama == "") {
                Alert.alert('Perhatian', 'Silahkan isi Nama Anda terlebih dahulu')
            } else if (this.state.telepon == "") {
                Alert.alert('Perhatian', 'Silahkan isi nomor Telepon terlebih dahulu')
            } else if (this.state.tour_departure == 999) {
                Alert.alert('Perhatian', 'Silahkan isi Tanggal Keberangkatan terlebih dahulu')
            }
        }


    }

    onPlusAdultPressed = () => {
        this.setState({ order_jumlah_adult: this.state.order_jumlah_adult + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * (this.state.order_jumlah_adult + 1)) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusAdultPressed = () => {
        if (this.state.order_jumlah_adult != 0) {
            this.setState({ order_jumlah_adult: this.state.order_jumlah_adult - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * (this.state.order_jumlah_adult - 1)) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }

    // Calculate Total Adult Double
    onPlusAdultDoublePressed = () => {
        this.setState({ order_jumlah_adult_double: this.state.order_jumlah_adult_double + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * (this.state.order_jumlah_adult_double + 1)) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusAdultDoublePressed = () => {
        if (this.state.order_jumlah_adult_double != 0) {
            this.setState({ order_jumlah_adult_double: this.state.order_jumlah_adult_double - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * (this.state.order_jumlah_adult_double - 1)) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }

    // Calculate Total Adult Twin
    onPlusAdultTwinPressed = () => {
        this.setState({ order_jumlah_adult_twin: this.state.order_jumlah_adult_twin + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * (this.state.order_jumlah_adult_twin + 1)) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusAdultTwinPressed = () => {
        if (this.state.order_jumlah_adult_twin != 0) {
            this.setState({ order_jumlah_adult_twin: this.state.order_jumlah_adult_twin - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * (this.state.order_jumlah_adult_twin - 1)) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }
    // Calculate Total Adult Triple
    onPlusAdultTriplePressed = () => {
        this.setState({ order_jumlah_adult_triple: this.state.order_jumlah_adult_triple + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * (this.state.order_jumlah_adult_triple + 1)) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusAdultTriplePressed = () => {
        if (this.state.order_jumlah_adult_triple != 0) {
            this.setState({ order_jumlah_adult_triple: this.state.order_jumlah_adult_triple - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * (this.state.order_jumlah_adult_triple - 1)) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }
    // Calculate Total Adult Quad
    onPlusAdultQuadPressed = () => {
        this.setState({ order_jumlah_adult_quad: this.state.order_jumlah_adult_quad + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * (this.state.order_jumlah_adult_quad + 1)) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusAdultQuadPressed = () => {
        if (this.state.order_jumlah_adult_quad != 0) {
            this.setState({ order_jumlah_adult_quad: this.state.order_jumlah_adult_quad - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * (this.state.order_jumlah_adult_quad - 1)) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }

    onPlusChildPressed = () => {
        this.setState({ order_jumlah_child: this.state.order_jumlah_child + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * (this.state.order_jumlah_child + 1)) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusChildPressed = () => {
        if (this.state.order_jumlah_child != 0) {
            this.setState({ order_jumlah_child: this.state.order_jumlah_child - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * (this.state.order_jumlah_child - 1)) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }
    //Calculate Total Child Double
    onPlusChildDoublePressed = () => {
        this.setState({ order_jumlah_child_double: this.state.order_jumlah_child_double + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * (this.state.order_jumlah_child_double + 1)) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusChildDoublePressed = () => {
        if (this.state.order_jumlah_child_double != 0) {
            this.setState({ order_jumlah_child_double: this.state.order_jumlah_child_double - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * (this.state.order_jumlah_child_double - 1)) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }
    //Calculate Total Child Twin
    onPlusChildTwinPressed = () => {
        this.setState({ order_jumlah_child_twin: this.state.order_jumlah_child_twin + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * (this.state.order_jumlah_child_twin + 1)) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusChildTwinPressed = () => {
        if (this.state.order_jumlah_child_twin != 0) {
            this.setState({ order_jumlah_child_twin: this.state.order_jumlah_child_twin - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * (this.state.order_jumlah_child_twin - 1)) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }
    //Calculate Total Child Triple
    onPlusChildTriplePressed = () => {
        this.setState({ order_jumlah_child_triple: this.state.order_jumlah_child_triple + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * (this.state.order_jumlah_child_triple + 1)) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusChildTriplePressed = () => {
        if (this.state.order_jumlah_child_triple != 0) {
            this.setState({ order_jumlah_child_triple: this.state.order_jumlah_child_triple - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * (this.state.order_jumlah_child_triple - 1)) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }
    //Calculate Total Child Quad
    onPlusChildQuadPressed = () => {
        this.setState({ order_jumlah_child_quad: this.state.order_jumlah_child_quad + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * this.state.order_jumlah_infant) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * (this.state.order_jumlah_child_quad + 1))

        })
    }

    onMinusChildQuadPressed = () => {
        if (this.state.order_jumlah_child_quad != 0) {
            this.setState({ order_jumlah_child_quad: this.state.order_jumlah_child_quad - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * this.state.order_jumlah_infant) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * (this.state.order_jumlah_child_quad - 1))

            })
        }
    }

    onPlusInfantPressed = () => {
        this.setState({ order_jumlah_infant: this.state.order_jumlah_infant + 1 })
        this.setState({
            total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                (this.state.order_price_child * this.state.order_jumlah_child) +
                (this.state.order_price_infant * (this.state.order_jumlah_infant + 1)) +
                (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

        })
    }

    onMinusInfantPressed = () => {
        if (this.state.order_jumlah_infant != 0) {
            this.setState({ order_jumlah_infant: this.state.order_jumlah_infant - 1 })
            this.setState({
                total_tagihan: (this.state.order_price_adult * this.state.order_jumlah_adult) +
                    (this.state.order_price_child * this.state.order_jumlah_child) +
                    (this.state.order_price_infant * (this.state.order_jumlah_infant - 1)) +
                    (this.state.order_price_adult_double * this.state.order_jumlah_adult_double) +
                    (this.state.order_price_adult_twin * this.state.order_jumlah_adult_twin) +
                    (this.state.order_price_adult_triple * this.state.order_jumlah_adult_triple) +
                    (this.state.order_price_adult_quad * this.state.order_jumlah_adult_quad) +
                    (this.state.order_price_child_double * this.state.order_jumlah_child_double) +
                    (this.state.order_price_child_twin * this.state.order_jumlah_child_twin) +
                    (this.state.order_price_child_triple * this.state.order_jumlah_child_triple) +
                    (this.state.order_price_child_quad * this.state.order_jumlah_child_quad)

            })
        }
    }

    jumlahAdult = () => {
        if (this.props.order.price_adult != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 12+</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} / Person</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusAdultPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_adult}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusAdultPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahAdultDouble = () => {
        if (this.props.order.price_adult_double != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult Double </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 12+</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_adult_double.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusAdultDoublePressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_adult_double}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusAdultDoublePressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahAdultTwin = () => {
        if (this.props.order.price_adult_twin != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult Twin </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 12+</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_adult_twin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusAdultTwinPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_adult_twin}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusAdultTwinPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahAdultTriple = () => {
        if (this.props.order.price_adult_triple != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult Triple </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 12+</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_adult_triple.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusAdultTriplePressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_adult_triple}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusAdultTriplePressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahAdultQuad = () => {
        if (this.props.order.price_adult_quad != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult Quad </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 12+</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}> - Adult Quad : {this.props.order.currency} {this.state.order_price_adult_quad.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusAdultQuadPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_adult_quad}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusAdultQuadPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahChild = () => {
        if (this.props.order.price_child != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Child </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 2 - 11</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_child.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusChildPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_child}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusChildPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahChildDouble = () => {
        if (this.props.order.price_child_double != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Child Double </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 2 - 11</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_child_double.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusChildDoublePressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_child_double}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusChildDoublePressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahChildTwin = () => {
        if (this.props.order.price_child_twin != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Child Twin </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 2 - 11</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_child_twin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusChildTwinPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_child_twin}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusChildTwinPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahChildTriple = () => {
        if (this.props.order.price_child_triple != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Child Triple </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 2 - 11</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_child_triple.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusChildTriplePressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_child_triple}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusChildTriplePressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahChildQuad = () => {
        if (this.props.order.price_child_quad != null) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Child Quad </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Age 2 - 11</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_child_quad.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusChildQuadPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_child_quad}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusChildQuadPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
    jumlahInfant = () => {
        if (this.props.order.price_infant) {
            return (
                <View style={{ width: '100%', flexDirection: "row", alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 7 }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                            {/* <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Adult : {this.props.order.currency} {this.state.order_price_adult.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium> */}
                            <TextMedium style={{ color: '#2BB04C', fontSize: 16 }}>Infant </TextMedium>
                            <TextMedium style={{ color: '#C0BEBE', fontSize: 11 }}>Below Age 2</TextMedium>
                        </View>
                        <View>
                            <TextMedium style={{ color: '#2BB04C', fontSize: 11 }}>{this.props.order.currency} {this.state.order_price_infant.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextMedium>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '30%' }}>
                        <TouchableOpacity onPress={this.onMinusInfantPressed}>
                            <Icon
                                name={"circle-with-minus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                        <TextNormal style={{ color: '#404040', fontSize: 16 }}>{this.state.order_jumlah_infant}</TextNormal>
                        <TouchableOpacity onPress={this.onPlusInfantPressed}>
                            <Icon
                                name={"circle-with-plus"}
                                size={25}
                                color="#FF9D00"
                                style={{}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }

    render() {
        departure = () => {
            if (this.props.order.departures.length == 0) {
                return (
                    <Picker.Item label="Tidak ada keberangkatan." value="null" />
                )
            } else {
                let departures = []
                for (i = 0; i < this.props.order.departures.length; i++) {
                    // console.log('this.props.departures[i].departure_date', this.props.order.departures[i].departure_date, this.props.order.departures[i].id)
                    departures.push(<Picker.Item key={i} label={this.props.order.departures[i].departure_date} value={this.props.order.departures[i].id} />)
                }
                return (
                    departures
                )
            }
        }

        const onSelesai = () => {
            this.setState({
                passengers: (this.state.order_jumlah_adult) +
                    (this.state.order_jumlah_child) +
                    (this.state.order_jumlah_infant) +
                    (this.state.order_jumlah_adult_double) +
                    (this.state.order_jumlah_adult_twin) +
                    (this.state.order_jumlah_adult_triple) +
                    (this.state.order_jumlah_adult_quad) +
                    (this.state.order_jumlah_child_double) +
                    (this.state.order_jumlah_child_twin) +
                    (this.state.order_jumlah_child_triple) +
                    (this.state.order_jumlah_child_quad)
                ,
                modalVisible: false
            })


        }

        return (
            <ScrollView stlye={{ backgroundColor: '#fff' }}>

                <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#fff' }}>
                    {/* judul */}
                    <View style={{ width: Dimensions.get('window').width, backgroundColor: '#2BB04C', marginTop: 12, marginBottom: 16 }}>
                        <TextMedium style={{ paddingHorizontal: 28, paddingVertical: 14, color: '#ffffff', fontSize: 18 }}>{this.props.order.name}</TextMedium>
                    </View>
                    {/* isi form  */}
                    <View style={{ width: Dimensions.get('window').width, backgroundColor: '#ffffff' }}>
                        <TextNormal style={{ color: '#404040', fontSize: 12, marginTop: 12, marginBottom: 8, paddingLeft: 28 }}>Reservation Number</TextNormal>
                        {/* nomor reeservasi */}
                        <View style={{ width: 150, height: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#2BB04C', borderRadius: 5, marginLeft: 28, marginBottom: 14 }}>
                            <TextNormal style={{ paddingHorizontal: 13, paddingVertical: 5, color: '#2BB04C', fontSize: 16 }}>{this.props.reserve_number}</TextNormal>
                        </View>
                        {/* form nama  */}
                        <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 16, marginBottom: 7 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name='assignment-ind' size={24} color='#757575' style={{ width: '10%', paddingTop: 7 }} />
                                <View style={{ width: '90%' }}>
                                    <TextNormal style={{ color: '#404040', fontSize: 12 }}>Nama</TextNormal>
                                    <View style={{ borderWidth: 1, borderColor: '#2BB04C', borderRadius: 5, width: '100%', height: 40 }}>
                                        <TextInput
                                            underlineColorAndroid='transparent'
                                            placeholder={'Nama Anda'}
                                            style={{ width: '100%', height: '100%', fontFamily: 'EncodeSans-Regular', fontSize: 16, marginLeft: 10 }}
                                            onChangeText={val => this.setState({ nama: val })}
                                            value={this.state.nama}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* form nomor */}
                        <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 16, marginBottom: 7 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name='phone' size={24} color='#757575' style={{ width: '10%', paddingTop: 7 }} />
                                <View style={{ width: '90%' }}>
                                    <TextNormal style={{ color: '#404040', fontSize: 12 }}>Telephone</TextNormal>
                                    <View style={{ borderWidth: 1, borderColor: '#2BB04C', borderRadius: 5, width: '100%', height: 40 }}>
                                        <TextInput
                                            underlineColorAndroid='transparent'
                                            placeholder={'Nomor HP'}
                                            style={{ width: '100%', height: '100%', fontFamily: 'EncodeSans-Regular', fontSize: 16, marginLeft: 10 }}
                                            value={this.state.telepon}
                                            onChangeText={val => this.setState({ telepon: val })}
                                            keyboardType='phone-pad'
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* form passengger */}
                        <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 16, marginBottom: 7 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialIcons name='face' size={24} color='#757575' style={{ width: '10%', paddingTop: 7 }} />
                                <View style={{ width: '90%' }}>
                                    <TextNormal style={{ color: '#404040', fontSize: 12 }}>Passenger {'('}Adult, Child, or Infant {')'}</TextNormal>
                                    <TouchableOpacity onPress={() => { this.setState({ modalVisible: true }) }}>
                                        <View style={{ borderWidth: 1, borderColor: '#2BB04C', borderRadius: 5, width: '100%', height: 40, justifyContent: 'center' }}>
                                            <TextNormal style={{ color: '#757575', fontSize: 16, paddingLeft: 10 }}>{this.state.passengers} Passengers</TextNormal>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                        {/* form departure */}
                        <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 16, marginBottom: 40 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ico name='airplane' size={24} color='#757575' style={{ width: '10%', paddingTop: 7 }} />
                                <View style={{ width: '90%' }}>
                                    <TextNormal style={{ color: '#404040', fontSize: 12 }}>Pilih Keberangkatan</TextNormal>
                                    <View style={{ borderWidth: 1, borderColor: '#2BB04C', borderRadius: 5, width: '100%', height: 40, justifyContent: 'center' }}>

                                        <Picker
                                            selectedValue={this.state.tour_departure}
                                            style={{ height: '100%', width: '100%' }}
                                            onValueChange={(itemValue, itemIndex) => {
                                                if (itemValue === "null") {
                                                    alert('tanggal belum dipilih')
                                                } else {
                                                    this.setState({ tour_departure: itemValue })
                                                }
                                            }}>
                                            <Picker.Item label="..." value="null" />
                                            {departure()}
                                        </Picker>

                                    </View>
                                </View>
                            </View>
                        </View>
                        {/* total */}
                        <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 16, marginBottom: 20 }}>
                            <View style={{ flexDirection: 'row', width: '100%', alignItems: "center", justifyContent: 'space-between' }}>
                                <View style={{ width: '45%', alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", paddingHorizontal: 5 }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14 }}>Total Tagihan</TextNormal>
                                    <TextNormal style={{ color: '#757575', fontSize: 14 }}>:</TextNormal>
                                </View>
                                <View style={{ width: '55%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ width: 131, borderWidth: 1, borderColor: '#2BB04C', borderRadius: 5, justifyContent: 'center', height: 33 }}>
                                        <TextNormal style={{ color: '#404040', fontSize: 16, paddingLeft: 15 }}>{this.state.total_tagihan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextNormal>
                                    </View>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, }}>{this.props.order.currency}</TextNormal>
                                </View>
                            </View>
                        </View>
                        {/* tomobol */}
                        <View style={{ width: Dimensions.get('window').width, alignItems: 'center', backgroundColor: '#C4C4C4', paddingVertical: 30 }}>
                            <TouchableOpacity onPress={this.onRequestHandler}>
                                <View style={{ width: 151, height: 40, backgroundColor: '#FF9D00', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                    <TextMedium style={{ color: '#ffffff', fontSize: 22 }}>Kirim</TextMedium>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <Modal
                    animationType="fade"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setState({ modalVisible: false }) }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        paddingBottom: 20
                    }}>
                        <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }} style={[{ alignItems: 'flex-end', justifyContent: 'flex-end', width: "100%", width: '85%' }]}>
                            <Iconn name='md-close' size={20} color='#ffffff' />
                        </TouchableOpacity>
                        <View style={{ width: '85%', height: Dimensions.get('window').height / 1.15, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5 }}>

                            {this.jumlahAdult()}
                            {this.jumlahChild()}
                            {this.jumlahInfant()}
                            {this.jumlahAdultDouble()}
                            {this.jumlahAdultTwin()}
                            {this.jumlahAdultTriple()}
                            {this.jumlahAdultQuad()}
                            {this.jumlahChildDouble()}
                            {this.jumlahChildTwin()}
                            {this.jumlahChildTriple()}
                            {this.jumlahChildQuad()}
                            {/* total */}
                            <View style={{ width: '100%', paddingHorizontal: 16, marginBottom: 20 }}>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: "center", justifyContent: 'space-between' }}>
                                    <View style={{ width: '45%', alignItems: 'center', justifyContent: 'space-between', flexDirection: "row", paddingHorizontal: 5 }}>
                                        <TextNormal style={{ color: '#757575', fontSize: 14 }}>Total Tagihan</TextNormal>
                                        <TextNormal style={{ color: '#757575', fontSize: 14 }}>:</TextNormal>
                                    </View>
                                    <View style={{ width: '55%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ width: 131, borderWidth: 1, borderColor: '#2BB04C', borderRadius: 5, justifyContent: 'center', height: 33 }}>
                                            <TextNormal style={{ color: '#404040', fontSize: 16, paddingLeft: 15 }}>{this.state.total_tagihan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextNormal>
                                        </View>
                                        <TextNormal style={{ color: '#757575', fontSize: 14, }}>{this.props.order.currency}</TextNormal>
                                    </View>
                                </View>
                            </View>
                            {/* tomobol */}
                            <View style={{ width: '100%', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => onSelesai()}>
                                    <View style={{ width: 151, height: 40, backgroundColor: '#FF9D00', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                        <TextSemiBold style={{ color: '#ffffff', fontSize: 18 }}>Selesai</TextSemiBold>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </Modal>

                {/* <Modal
                    animationType="fade"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { this.setState({ modalVisible: false }) }}>
                    >
                    <View style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        paddingBottom: 20
                    }}>

                        <TouchableOpacity onPress={() => { this.setState({ modalVisible: false }) }} style={[{ alignItems: 'flex-end', justifyContent: 'flex-end', width: "100%", width: '85%' }]}>
                            <Iconn name='md-close' size={20} color='#ffffff' />
                        </TouchableOpacity>
                        <View style={{ width: '85%', height: Dimensions.get('window').height / 1.15, alignItems: 'center', justifyContent: 'space-around', backgroundColor: '#fff', borderRadius: 5 }}>

                        </View>
                    </View>
                </Modal> */}


            </ScrollView >

        );
    }
}

const styles = StyleSheet.create({
});

const mapDispatchToProps = dispatch => {
    return {
        // onPayment: () => dispatch(startPayment())
        onPaymentDoneGoToMainMenu: () => dispatch(startMainMenu())
    };
};

export default connect(null, mapDispatchToProps)(TourOrder);




