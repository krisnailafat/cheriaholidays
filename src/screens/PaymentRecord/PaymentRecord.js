/**
 * Created by mata on 6/7/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import { paymentConfirm } from "../../store/actions/index";

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
    Modal,
    FlatList,
    ActivityIndicator
} from "react-native";
import { TextMedium, TextBold, TextNormal, TextSemiBold } from "../../components/UI/TextCustom/TextCustom";
import { pembelian, setLogged, profile } from "../../store/actions/index";

class PaymentRecord extends Component {

    static navigatorStyle = {
        // navBarTextColor: '#2BB04C',
        // tabBarHidden: true,
        navBarTextFontFamily: 'EncodeSans-Medium',
        // navBarBackgroundColor: '#ffffff',
        // navBarButtonColor: '#3EBA49',

    };

    state = {
        isLoading: true,
        total_point: 0,
        used_point: 0,
        total_purchase: 0,
        email: '',
        pembelian: null,
        rate_conversion: null,

        pembayaran: null,
        jumlah: 0,
        authToken: null,
        errorMessage: null,

        modalVisibleBayar: false,

        isBoxLogin: true,
        isUpdate: false
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);


        // let url2 = "https://travelfair.co/api/rateconversion/";
        // console.log('URL:', url2)
        // fetch(url2)
        //     .catch(err => {
        //         console.log(err);
        //         alert("Error accessing travelfair");
        //         //dispatch(uiStopLoading());
        //     })
        //     .then(res => res.json())
        //     .then(parsedRes => {
        //         console.log('rate conversion:',parsedRes)
        //         this.setState({rate_conversion:parsedRes.conversion_rate})
        //     })

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
        switch (event.id) {
            case "didAppear":
                // console.log("didAppear")
                // this.setState({ test: 'ya' })
                AsyncStorage.getItem("ap:logged").then((value) => {

                    if (value !== null) {
                        if (this.props.isLogin) {
                            console.log('login pertama')

                            this.props.onPembelian().then(parsedRes => {
                                this.setState({ total_purchase: parsedRes.length, isLoading: false, total_point: 0 })
                                for (i = 0; i < parsedRes.length; i++) {
                                    this.setState({ total_point: this.state.total_point + parsedRes[i].tour_departure.tour.poin })
                                }
                            })

                            this.props.onSetLogged()
                            this.setState({ isBoxLogin: false, })
                        }
                        console.log('ga kebaca lagi')
                    }
                    else {
                        console.log('belum login')
                    }
                })
                break;
        }
    };

    componentDidMount() {
        AsyncStorage.getItem("ap:logged").then((value) => {

            if (value !== null) {
                console.log('udah login')
                this.props.onPembelian().then(parsedRes => {
                    this.setState({ total_purchase: parsedRes.length, isLoading: false, total_point: 0 })
                    for (i = 0; i < parsedRes.length; i++) {
                        this.setState({ total_point: this.state.total_point + parsedRes[i].tour_departure.tour.poin })
                    }
                })
                this.setState({ isBoxLogin: false, })
            }
            else {
                console.log('belum login')
            }
        })
        console.log('componentDidMount payment')
        // AsyncStorage.getItem("ap:auth:email").then((value) => {
        //     this.setState({ email: value });
        // })
        //     .then(res => {
        //         let url = "https://travelfair.co/api/orderbyemail/" + this.state.email;
        //         console.log('URL:', url)
        //         fetch(url)
        //             .catch(err => {
        //                 console.log(err);
        //                 alert("Error accessing travelfair");
        //                 //dispatch(uiStopLoading());
        //             })
        //             .then(res => res.json())
        //             .then(parsedRes => {
        //                 console.log('pembelian:', parsedRes)
        //                 this.setState({ isLoading: false, pembelian: parsedRes, total_purchase: parsedRes.length })
        //                 for (i = 0; i < parsedRes.length; i++) {
        //                     this.setState({ total_point: this.state.total_point + parsedRes[i].tour_departure.tour.poin })
        //                 }
        //             })
        //     })
    }

    componentWillUnmount() {
        // this._sub.remove();
    }

    componentDidUpdate(prevProps, prevState) {

        if (!this.state.isUpdate) {
            AsyncStorage.getItem("ap:logged").then((value) => {

                if (value !== null) {
                    console.log('udah login')
                    this.props.onPembelian().then(parsedRes => {
                        this.setState({ total_purchase: parsedRes.length, isLoading: false, total_point: 0 })
                        for (i = 0; i < parsedRes.length; i++) {
                            this.setState({ total_point: this.state.total_point + parsedRes[i].tour_departure.tour.poin })
                        }
                    })
                    this.setState({ isBoxLogin: false, isUpdate: true })
                }
                else {
                    // console.log('belum login')
                }
            })
        }
    }

    onButtonKlik = (key) => {
        this.props.navigator.showModal({
            screen: 'cheria-holidays.AuthScreen', // unique ID registered with Navigation.registerScreen
            title: 'Log In', // navigation bar title of the pushed screen (optional)
            navigatorStyle: {
                // tabBarHidden: true,
                // drawUnderTabBar: true
            }, // override the navigator style for the pushed screen (optional)
            passProps: {
                valueAuth: key,
                // enableScreenUpdates: () => this.setState({ canUpdate: true })
            },
            animationType: 'fade',
            adjustSoftInput: "pan"
        });
    }

    paymentConfirm = item => {
        this.props.navigator.showModal({
            screen: "cheria-holidays.PaymentConfirm",
            title: "Konfirmasi Pembayaran",
            passProps: {
                paymentconfirm: item
            },
            navigatorStyle: {},
            animationType: 'fade'
        });


        // this.props.onConfirmPayment(item)
    }

    renderNotes = item => {
        if (item != undefined) {
            return (
                // <View>

                <View style={{ width: '100%', paddingHorizontal: 11, marginBottom: 10 }}>
                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ width: '35%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <TextNormal style={{ color: '#757575', fontSize: 14 }}>Notes</TextNormal>
                            <TextNormal style={{ color: '#757575', fontSize: 14, paddingRight: 5 }}>:</TextNormal>
                        </View>
                        <View style={{ width: '65%', flexDirection: 'row', alignItems: 'center' }}>
                            <TextNormal style={{ color: '#757575', fontSize: 14 }}>{item}</TextNormal>
                        </View>
                    </View>
                </View>

                //     <Text style={{ paddingLeft: 5 }}><Text style={{ paddingLeft: 10, fontWeight: 'bold', color: "#490E14" }}>Notes: </Text></Text>
                //     <Text style={{ paddingLeft: 5 }}><Text style={{ paddingLeft: 10 }}></Text>{item.notes}</Text>
                // </View>
            )
        }
    }

    renderButton = item => {
        console.log(item)
        if (item.status != "FP_Confirmed") {
            // {this.renderNotes(item)}
            return (
                // <View style={{ borderWidth: 1 }}>
                <TouchableOpacity onPress={() => this.paymentConfirm(item)}>
                    <View style={{ width: 145, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF9D00', borderRadius: 5 }}>
                        <TextSemiBold style={{ color: '#ffffff', fontSize: 18 }}>Konfirmasi</TextSemiBold>
                    </View>
                </TouchableOpacity>
                // <View style={{ paddingVertical: 10, paddingHorizontal: 40 }}>
                // <Button title="Konfirmasi Bayar" onPress={() => this.paymentConfirm(item)} color="#C91728" />
                // </View> 
                // </View>
            )
        } else {
            return (
                // <View>
                <TouchableOpacity disabled={true}>
                    <View style={{ width: 145, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FF9D00', borderRadius: 5 }}>
                        <TextSemiBold style={{ color: '#ffffff', fontSize: 18 }}>LUNAS</TextSemiBold>
                    </View>
                </TouchableOpacity>

                //     <Text style={{ paddingLeft: 5 }}>Pembayaran telah <Text style={{ fontWeight: 'bold' }}>LUNAS</Text></Text>
                //     <View style={{ paddingVertical: 10, paddingHorizontal: 40 }}>
                //         <Button disabled={true} title="Konfirmasi Bayar" onPress={() => this.paymentConfirm(item)} color="#C91728" />
                //     </View>
                // </View>
            )
        }

    }

    renderbayar = item => {
        return (
            // <View>
            // <View style={{}}>

            <TouchableOpacity
                onPress={() => {
                    let url = "https://travelfair.co/api/paymentconfirmation/?reservation_number=" + item.reservation_number;
                    AsyncStorage.getItem("ap:auth:token").then((value) => {
                        this.setState({ authToken: value });
                    }).then(res => {
                        fetch(url, {
                            credentials: 'include',
                            method: 'GET',
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": "Token " + this.state.authToken
                            },
                        })
                            .catch(err => {
                                console.log(err);
                                this.setState({ errorMessage: err })
                            })
                            .then(res => res.json())
                            .then(parsedRes => {
                                console.log("ini pembayaran ", parsedRes)
                                this.setState({
                                    pembayaran: parsedRes,
                                })
                                for (i = 0; i < parsedRes.length; i++) {
                                    this.setState({ jumlah: this.state.jumlah + parsedRes[i].amount })
                                }
                            });

                    }).catch(err => Alert.alert("Error", err))
                    this.setState({ modalVisibleBayar: true })
                }
                }
            >
                <View style={{ width: 145, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: 5, borderWidth: 1, borderColor: '#757575' }}>
                    <TextSemiBold style={{ color: '#757575', fontSize: 18 }}>Detail</TextSemiBold>
                </View>
            </TouchableOpacity>


            //     <Button title="Detail Bayar" onPress={() => {
            //         let url = "https://travelfair.co/api/paymentconfirmation/?reservation_number=" + item.reservation_number;
            //         AsyncStorage.getItem("ap:auth:token").then((value) => {
            //             this.setState({ authToken: value });
            //         }).then(res => {
            //             fetch(url, {
            //                 credentials: 'include',
            //                 method: 'GET',
            //                 headers: {
            //                     "Content-Type": "application/json",
            //                     "Authorization": "Token " + this.state.authToken
            //                 },
            //             })
            //                 .catch(err => {
            //                     console.log(err);
            //                     this.setState({ errorMessage: err })
            //                 })
            //                 .then(res => res.json())
            //                 .then(parsedRes => {
            //                     console.log("ini pembayaran ", parsedRes)
            //                     this.setState({
            //                         pembayaran: parsedRes,
            //                     })
            //                     for (i = 0; i < parsedRes.length; i++) {
            //                         this.setState({ jumlah: this.state.jumlah + parsedRes[i].amount })
            //                     }
            //                 });

            //         }).catch(err => Alert.alert("Error", err))
            //         this.setState({ modalVisibleBayar: true })
            //     }
            //     } color="#C91728" />
            // </View> 
            // </View>
        )
    }

    renderModal() {
        let sudah_dibayar = []
        let sisa_tagihan = null
        if (this.state.pembayaran != null) {
            if (this.state.pembayaran != 0) {
                sudah_dibayar = this.state.pembayaran.map((item, key) => {
                    console.log("ini key ", key)
                    return (
                        // <View style={{ flexDirection: 'row', alignItems: 'center' }} key={key}>

                        <View style={{ width: '100%', paddingHorizontal: 14, marginBottom: 10 }} key={key}>
                            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ flexDirection: 'row', width: '40%', justifyContent: 'space-between' }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14 }}>Sudah dibayar</TextNormal>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, paddingRight: 5 }}>:</TextNormal>
                                </View>
                                <View style={{ flexDirection: 'row', width: '33%' }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, textAlign: 'center' }}>{item.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextNormal>
                                </View>
                                <View style={{ flexDirection: 'row', width: '33%' }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14 }}>{item.created_at.substr(0, 10)}</TextNormal>
                                </View>
                            </View>

                        </View>


                        //     <Text style={{ paddingHorizontal: 10, color: "#490E14" }}>Sudah dibayar: &nbsp;
                        //     <Text style={{ fontWeight: 'bold' }}>{item.amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} </Text></Text>
                        //     <Text style={{ color: "#490E14" }}>Tanggal:&nbsp;
                        //     <Text style={{ fontWeight: 'bold' }}>{item.created_at.substr(0, 10)}</Text></Text>
                        // </View>
                    )
                })
                sisa_tagihan = (
                    <View style={{ paddingTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                        <TextNormal style={{ paddingHorizontal: 14, color: "#490E14" }}>Sisa pembayaran:&nbsp;
                        <TextNormal style={{ color: '#2BB04C', fontSize: 14 }}>&nbsp;{(Number(this.state.pembayaran[0].tour.total_amount) - Number(this.state.jumlah)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextNormal></TextNormal>
                    </View>
                )
                return (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisibleBayar}
                        onRequestClose={() => {
                            this.setState({ modalVisibleBayar: false });
                        }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            paddingBottom: 20
                        }}>
                            <View style={{ width: '85%', height: Dimensions.get('window').height / 1.75, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5 }}>
                                <TextMedium style={{ color: '#2BB04C', fontSize: 22, marginBottom: 19 }}>Detail</TextMedium>

                                <View style={{ width: '100%', marginBottom: 19 }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, paddingLeft: 14 }}>Catatan Pembayaran</TextNormal>
                                </View>



                                <View style={{ width: '100%' }}>
                                    {sudah_dibayar}
                                    {sisa_tagihan}
                                </View>

                                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setState({
                                                modalVisibleBayar: false,
                                                jumlah: 0
                                            })
                                        }}>
                                        <View style={{ width: 151, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF9D00', borderRadius: 5 }}>
                                            <TextSemiBold style={{ color: '#ffffff', fontSize: 18 }}>SELESAI</TextSemiBold>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={{ paddingVertical: 5 }}>

                                </View>
                            </View>
                        </View>
                    </Modal>
                )
            }
            else {
                return (
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisibleBayar}
                        onRequestClose={() => {
                            this.setState({ modalVisibleBayar: false });
                        }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            paddingBottom: 20
                        }}>
                            <View style={{ width: '85%', height: Dimensions.get('window').height / 1.75, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5 }}>
                                <TextMedium style={{ color: '#2BB04C', fontSize: 22, marginBottom: 19 }}>Tidak Ada History</TextMedium>
                                {/* <Text style={{ paddingTop: 20, fontSize: 18, fontWeight: 'bold' }}>Tidak Ada History</Text> */}
                                {/* <View style={{ paddingHorizontal: 10, width: '100%' }}>
                                {sudah_dibayar}
                            </View> */}

                                <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' }}>
                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setState({
                                                modalVisibleBayar: false,
                                                jumlah: 0
                                            })
                                        }}>
                                        <View style={{ width: 151, height: 40, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#757575', borderRadius: 5 }}>
                                            <TextSemiBold style={{ color: '#757575', fontSize: 18 }}>SELESAI</TextSemiBold>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={{ paddingVertical: 5 }}>

                                </View>
                            </View>
                        </View>
                    </Modal>
                )
            }
        }
    }

    _listEmptyComponent = () => {

        return (
            <View style={{ width: Dimensions.get('window').width, marginTop: 30 }}>
                <TextNormal style={{ width: '100%', color: '#757575', fontSize: 14, textAlign: 'center' }}>Anda belum memiliki pembelian, silahkan pilih atau tentukan tujuan anda pada main menu</TextNormal>
            </View>
        )
    }

    renderMain() {
        if (this.state.isLoading) {
            // return (
            //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            //         <ActivityIndicator size="large" color="#FF9D00" />
            //         <Text style={{ paddingTop: 10 }}>Loading ...</Text>
            //     </View>
            // )
        } else {
            return (
                <ScrollView>
                    <FlatList
                        data={this.state.pembelian || this.props.pembelian}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            <View style={{ marginVertical: 10, borderRadius: 8, marginHorizontal: 19, backgroundColor: '#ffffff' }}>
                                {/* panel atas */}
                                <View style={{ width: '100%', height: 30, paddingHorizontal: 11, backgroundColor: '#F19AC2', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                                    <TextNormal style={{ color: '#ffffff', fontSize: 14 }}>Kode Booking</TextNormal>
                                    <TextNormal style={{ color: '#ffffff', fontSize: 14 }}>{item.reservation_number}</TextNormal>
                                </View>
                                {/* panel tengah */}
                                {/* wisata */}
                                <View style={{ width: '100%', paddingHorizontal: 11, marginBottom: 10 }}>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ width: '35%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <TextNormal style={{ color: '#757575', fontSize: 14 }}>Wisata</TextNormal>
                                            <TextNormal style={{ color: '#757575', fontSize: 14, paddingRight: 5 }}>:</TextNormal>
                                        </View>
                                        <View style={{ width: '65%', flexDirection: 'row', alignItems: 'center' }}>
                                            <TextNormal style={{ color: '#757575', fontSize: 14 }}>{item.tour_departure.tour.name}</TextNormal>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: '100%', paddingHorizontal: 11, marginBottom: 10 }}>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ width: '35%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <TextNormal style={{ color: '#757575', fontSize: 14 }}>Total tagihan</TextNormal>
                                            <TextNormal style={{ color: '#757575', fontSize: 14, paddingRight: 5 }}>:</TextNormal>
                                        </View>
                                        <View style={{ width: '65%', flexDirection: 'row', alignItems: 'center' }}>
                                            <TextNormal style={{ color: '#757575', fontSize: 14 }}>{item.tour_departure.tour.currency} {item.total_amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</TextNormal>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ width: '100%', paddingHorizontal: 11, marginBottom: 10 }}>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ width: '35%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <TextNormal style={{ color: '#757575', fontSize: 14 }}>Status</TextNormal>
                                            <TextNormal style={{ color: '#757575', fontSize: 14, paddingRight: 5 }}>:</TextNormal>
                                        </View>
                                        <View style={{ width: '65%', flexDirection: 'row', alignItems: 'center' }}>
                                            <TextNormal style={{ color: '#757575', fontSize: 14 }}>{item.status}</TextNormal>
                                        </View>
                                    </View>
                                </View>
                                {/* note */}
                                {this.renderNotes(item.notes)}
                                {/* border */}
                                <View style={{ width: '100%', borderBottomWidth: 1, borderColor: '#C8CACC', marginBottom: 10 }} />



                                {/* <View style={{ backgroundColor: "#490E14" }}>
                                    <Text style={{ padding: 5, fontWeight: 'bold', color: "white" }}>Booking code: {item.reservation_number} </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: '#490E14',
                                        borderBottomWidth: 0.5,
                                    }}
                                />
                                <Text style={{ paddingLeft: 5 }}><Text style={{ paddingLeft: 10, fontWeight: 'bold', color: "#490E14" }}>Tour:  </Text>{item.tour_departure.tour.name} </Text>
                                <Text style={{ paddingLeft: 5 }}><Text style={{ paddingLeft: 10, fontWeight: 'bold', color: "#490E14" }}>Total Tagihan:  </Text> {item.tour_departure.tour.currency} {item.total_amount.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}</Text>
                                <Text style={{ paddingLeft: 5 }}><Text style={{ paddingLeft: 10, fontWeight: 'bold', color: "#490E14" }}>Status: </Text> {item.status}</Text> */}

                                <View style={{ width: '100%', paddingHorizontal: 9, justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', marginBottom: 20 }}>

                                    {this.renderButton(item)}
                                    {this.renderbayar(item)}
                                </View>
                            </View>
                        }
                        ListEmptyComponent={this._listEmptyComponent}
                    />
                </ScrollView>
            )
        }
    }
    render() {
        // console.log('this.state', this.state)
        let boxLogin = null

        if (this.state.isBoxLogin) {
            boxLogin = (
                <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, marginTop: 35 }}>
                    <TextNormal style={{ color: '#757575', fontSize: 14, width: '100%', textAlign: 'center' }}>Anda belum memiliki pembelian, silahkan login atau register untuk melakukan pembelian</TextNormal>
                    <View style={{ width: '100%', flexDirection: 'row', paddingHorizontal: 5, alignItems: 'center', justifyContent: 'space-between', marginTop: 22 }}>
                        <TouchableOpacity onPress={() => this.onButtonKlik("login")}>
                            <View style={{ width: 150, height: 40, backgroundColor: '#FF9D00', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <TextMedium style={{ color: '#ffffff', fontSize: 16 }}>Login</TextMedium>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.onButtonKlik("signup")}>
                            <View style={{ width: 150, height: 40, backgroundColor: '#fff', borderRadius: 5, borderWidth: 1, borderColor: '#c4c4c4', alignItems: 'center', justifyContent: 'center' }}>
                                <TextMedium style={{ color: '#757575', fontSize: 16 }}>Register</TextMedium>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

        let rate_conversion = null
        // if(this.props.paymentconfirm.tour_departure.tour.currency === "USD"){
        //     rate_conversion = (
        //         <Text>(1 USD = {this.state.rate_conversion.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")} IDR)</Text>
        //     )
        // }
        if (this.props.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF9D00" />
                    <Text style={{ paddingTop: 10 }}>Loading ...</Text>
                </View>
            )
        } else {
            return (
                <View style={{ flex: 1, backgroundColor: '#C4C4C4' }}>
                    {/* panel atas  */}
                    <View style={{ width: Dimensions.get('window').width, paddingHorizontal: 19, marginBottom: 14, marginTop: 15 }}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ width: "49%", height: 65, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: 5, flexDirection: 'row' }}>
                                <TextMedium style={{ color: '#4F7BBE', fontSize: 16 }}>Total Pembelian </TextMedium>
                                <TextBold style={{ color: '#4F7BBE', fontSize: 16 }}>{this.state.total_purchase}</TextBold>
                            </View>
                            <View style={{ width: "49%", height: 65, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff', borderRadius: 5, flexDirection: 'row' }}>
                                <TextMedium style={{ color: '#FF9D00', fontSize: 16 }}>Bonus Point </TextMedium>
                                <TextBold style={{ color: '#FF9D00', fontSize: 16 }}>{this.state.total_point}</TextBold>
                            </View>
                        </View>
                    </View>

                    {boxLogin}

                    {/* <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
                        <View style={{ borderColor: '#490E14', justifyContent: 'center', alignItems: 'center', width: '40%', height: 40, margin: 5, borderWidth: 0.5, padding: 5 }}>
                            <Text style={{ color: '#490E14' }}>Total Purchase <Text style={{ fontWeight: 'bold' }}>{this.state.total_purchase}</Text></Text>
                        </View>
                        <View style={{ borderColor: '#490E14', justifyContent: 'center', alignItems: 'center', width: '40%', height: 40, margin: 5, borderWidth: 0.5, padding: 5 }}>
                            <Text style={{ color: '#490E14' }}>Bonus Point <Text style={{ fontWeight: 'bold' }}>{this.state.total_point}</Text></Text>
                        </View>
                    </View> */}
                    {this.renderMain()}
                    {this.renderModal()}
                </View>
            );
        }

    }
}

const styles = StyleSheet.create({
});

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading,
        isLogin: state.isLogin.isLogin,
        pembelian: state.pembelian.pembelian
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onConfirmPayment: (item) => dispatch(paymentConfirm(item)),
        onProfile: () => dispatch(profile()),
        onPembelian: () => dispatch(pembelian()),
        onSetLogged: () => dispatch(setLogged()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRecord);


