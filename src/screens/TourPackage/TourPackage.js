/**
 * Created by mata on 6/1/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import DatePicker from 'react-native-datepicker';
import TourList from "../../components/TourList/TourList";
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';

import {
    Alert,
    View,
    Image,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Platform,
    Dimensions,
    Modal,
    ActivityIndicator
} from "react-native";
import { TextMedium, TextNormal } from "../../components/UI/TextCustom/TextCustom";



class TourPackage extends Component {
    static navigatorStyle = {
        navBarTextColor: '#3EBA49',
        navBarBackgroundColor: '#ffffff',
        navBarButtonColor: '#3EBA49',
        tabBarHidden: true,
        // navBarCustomView: 'cheria-holidays.CustomNavBar',
        // navBarHidden: true
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

    }

    state = {
        isLoading: false,
        filterDate: '',
        modalVisibleFilter: false,
        tours: []
    }

    getTourContent = () => {
        const promise = new Promise((resolve, reject) => {
            const tourcontent = this.props.tourcontent.slice().reverse()
            resolve(tourcontent)
        });
        return promise
    }

    componentDidMount() {
        console.log('tour content: ', this.props.tourcontent)
        if (this.props.tourcontent !== undefined) {
            this.getTourContent().then(res => {
                // console.log('tourcontent', res)
                this.setState({ tours: res })
            })
        } else {
            this.setState({ isLoading: true })
            let url = "https://travelfair.co/api/tour/";
            fetch(url)
                .catch(err => {
                    // console.log(err);
                    alert("Error accessing travelfair.co");
                    //dispatch(uiStopLoading());
                })
                .then(res => res.json())
                .then(parsedRes => {
                    //dispatch(uiStopLoading());
                    // console.log('data from travelfair: ', parsedRes);
                    this.setState({ tours: parsedRes, isLoading: false })
                });
        }
    }


    onNavigatorEvent = event => {
        //TODO buat onloads event

        //ini buat toogle side drawer
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
            if (event.id === "filter") {
                // console.log('filter pressed')
            }
        }
    };

    itemSelectedHandler = key => {
        // console.log('selected', key);
        // console.log('this.props', this.props)


        this.props.navigator.push({
            screen: "cheria-holidays.TourDetail",
            // title: "Detail Tour",
            passProps: {
                tourcontent: key
            }
        });


    };

    OnDrawerClicked = () => {
        this.props.navigator.toggleDrawer({
            side: "left"
        });
    };

    onHandlerFilter = () => {
        //enable modal
        this.setState({ modalVisibleFilter: true })
    }

    filterTour = () => {
        //TODO nembak API search
        if (this.props.tourid != undefined) {
            a = "https://travelfair.co/api/tour/?start_departure_date=" + this.state.filterDate + "&category=" + this.props.tourid;
        } else {
            a = "https://travelfair.co/api/tour/?start_departure_date=" + this.state.filterDate;
        }
        if (this.state.filterDate != '') {
            this.setState({ modalVisibleFilter: false, isLoading: true })
            // console.log('date', this.state.filterDate)
            let url = a;
            fetch(url)
                .catch(err => {
                    // console.log(err);
                    alert("Error accessing travelfair.co");
                    //dispatch(uiStopLoading());
                })
                .then(res => res.json())
                .then(parsedRes => {
                    //dispatch(uiStopLoading());
                    // console.log('data from travelfair: ', parsedRes);
                    // console.log('ini url: ', url);
                    this.setState({ tours: parsedRes, isLoading: false })
                });

        } else {
            Alert.alert("ERROR", "Tanggal belum di isi")
        }
    }

    renderPageTour() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#490E14" />
                    <Text style={{ paddingTop: 10 }}>Loading ...</Text>
                </View>
            )
        } else {
            console.log('this.state.tours', this.state.tours)
            return (
                <View style={{ width: Dimensions.get('window').width, alignItems: 'center', flex: 1 }}>
                    {/* modal filter */}
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisibleFilter}
                        onRequestClose={() => {
                            this.setState({ modalVisibleFilter: false });
                        }}>
                        <View style={{
                            // marginTop: 100,
                            // marginHorizontal: 20,
                            // justifyContent: 'center',
                            // alignItems: 'center',
                            // backgroundColor: '#DADADA'
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            paddingBottom: 20
                        }}>
                            <TouchableOpacity onPress={() => { this.setState({ modalVisibleFilter: false }) }} style={[{ alignItems: 'flex-end', justifyContent: 'flex-end', width: "100%", width: '85%' }]}>
                                <Icon name='md-close' size={40} color='#ffffff' />
                            </TouchableOpacity>
                            <View style={{ width: '85%', height: Dimensions.get('window').height / 1.35, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 5 }}>
                                <TextNormal style={{ paddingTop: 20, fontSize: 18, color: '#2BB04C' }}>Filter Tanggal
                                Keberangkatan</TextNormal>
                                <TextNormal style={{ fontSize: 18, color: '#2BB04C' }}>mulai dari ...</TextNormal>
                                <View style={{ paddingHorizontal: 10, width: '100%' }}>
                                </View>

                                <View style={{ paddingVertical: 20 }}>
                                    <DatePicker
                                        style={{ width: 200 }}
                                        date={this.state.filterDate}
                                        mode="date"
                                        placeholder="select date"
                                        format="YYYY-MM-DD"
                                        minDate={new Date()}
                                        maxDate="2030-06-01"
                                        confirmBtnText="OK"
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
                                        onDateChange={val => this.setState({ filterDate: val })}
                                    />

                                </View>
                                <View style={{
                                    marginTop: 10,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    alignItems: 'center'
                                }}>

                                    <TouchableHighlight
                                        onPress={() => {
                                            this.setState({ modalVisibleFilter: false })
                                        }}>
                                        <View style={{
                                            marginRight: 40,
                                            width: 80,
                                            height: 40,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#FF9D00',
                                            borderRadius: 5
                                        }}>
                                            <TextMedium style={{ color: 'white', fontSize: 14 }}>Cancel</TextMedium>
                                        </View>
                                    </TouchableHighlight>

                                    <TouchableHighlight
                                        onPress={this.filterTour}>
                                        <View style={{
                                            width: 80,
                                            height: 40,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            backgroundColor: '#FF9D00',
                                            borderRadius: 5
                                        }}>
                                            <TextMedium style={{ color: 'white', fontSize: 14 }}>Search</TextMedium>
                                        </View>
                                    </TouchableHighlight>
                                </View>
                                <View style={{ paddingVertical: 5 }}>

                                </View>
                            </View>
                        </View>
                    </Modal>
                    <TourList
                        tours={this.state.tours}
                        onItemSelected={this.itemSelectedHandler}
                    />
                </View >
            )
        }
    }

    render() {
        // console.log("ini prop tour id ", this.props)
        // console.log("ini date ,",this.state.filterDate," ",this.props.tourid)
        return (
            <View style={{ flex: 1, alignItems: 'center' }}>
                {/* <View style={{
                    paddingHorizontal: 20,
                    height: 60,
                    width: '100%',
                    backgroundColor: '#e5e5e5',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <TouchableOpacity onPress={this.OnDrawerClicked}>
                        <Icon
                            name={"md-menu"}
                            size={30}
                            color="#490E14"
                        />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: '#490E14', fontSize: 18 }}>{this.props.tourtitle != undefined ? this.props.tourtitle : "All Tour Package"}</Text>
                    </View>
                    <TouchableOpacity onPress={this.onHandlerFilter}>
                        <Feather
                            name={"filter"}
                            size={25}
                            color="#490E14"
                        />
                    </TouchableOpacity>
                </View> */}

                {this.renderPageTour()}
                {/* tombol filter dibawah */}
                <View style={{ flex: 0.1, alignItems: 'center', backgroundColor: '#2BB04C' }}>
                    <TouchableOpacity onPress={this.onHandlerFilter}>
                        <View style={{ width: Dimensions.get('window').width, height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                            <Icon name='ios-options-outline' size={24} color='#ffffff' style={{ marginRight: 14 }} />
                            <TextMedium style={{ color: '#ffffff', fontSize: 12 }}>FILTER</TextMedium>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default connect(null, null)(TourPackage);


