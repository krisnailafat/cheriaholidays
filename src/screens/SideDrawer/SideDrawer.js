import React, {Component} from "react";

import {Navigation} from 'react-native-navigation';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Platform,
    AsyncStorage,
    ActivityIndicator,
    FlatList,
    ScrollView
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {connect} from "react-redux";

import {authLogout, startRequestTour, startTourPackage, startPayment} from "../../store/actions/index";
import startMainTabs from "../../screens/MainTabs/startMainTabs";

class SideDrawer extends Component {
    state = {
        email:'',
        ref_code_user:'',
        isLoading: true,
        tours: {},
        token:''
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
        console.log('navigator props', props)
    }

    componentDidMount(){
        AsyncStorage.getItem("ap:auth:email").then((value) => {
            this.setState({"email": value});
        })
            .then(res => {
                // console.log('state email on drawer:', this.state.email)
            })

        let url = "https://travelfair.co/api/category/";
        fetch(url)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair.co");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
                alert("JSON error");
            })
            .then(parsedRes => {
                //dispatch(uiStopLoading());
                console.log('data side: ',parsedRes);
                this.setState({tours: parsedRes, isLoading:false})
            });

        let url2 = "https://travelfair.co/auth/users/me/";
        AsyncStorage.getItem("ap:auth:token").then((value) => {
            this.setState({"token": value});
        })
            .then(res => {
                //console.log('this.state.tour_departure 2', this.state.tour_departure)
                //console.log('this.state.tour_departure 2', this.state.reservation_number)
                fetch(
                    url2,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token "+this.state.token
                        },
                        //TODO masukin total_tagihan, phone,
                    }
                ).catch(err => {
                    console.log(err);
                    alert("Error accessing travelfair.co");
                    //dispatch(uiStopLoading());
                })
                    .then(res => res.json())
                    .catch(err => {
                        console.log(err);
                        alert("JSON error");
                    })
                    .then(parsedRes => {
                        //dispatch(uiStopLoading());
                        console.log('auth users: ',parsedRes);
                        this.setState({ref_code_user: parsedRes.ref_code_user})
                    });
            });


    }

    itemSelectedHandler = key => {
        console.log('key', key)

        Navigation.startSingleScreenApp({
            screen: {
                screen: 'cheria-holidays.TourPackage', // unique ID registered with Navigation.registerScreen
                title:  key.name, // title of the screen as appears in the nav bar (optional)
            },
            drawer: {
                left: {
                    screen: "cheria-holidays.SideDrawer"
                }
            },
            passProps: {
                tourcontent: key.cat_tours,
                tourtitle: key.name,
                tourid: key.cat_tours[0].category
            }
        })
        //
        //     this.props.navigator.push({
        //         screen: "cheria-holidays.TourPackage",
        //         title: key.name,
        //         passProps: {
        //             tourcontent: key.cat_tours,
        //             tourtitle : key.name,
        //             tourid: key.cat_tours[0].category
        //         }
        //     });
    };

    renderMain(){
        if (this.state.isLoading) {
            return (
                <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#490E14"/>
                    <Text style={{paddingTop: 10}}>Loading ...</Text>
                </View>
            )
        }else{
            return(
                <FlatList
                    style={styles.listContainer}
                    data={this.state.tours}
                    keyExtractor={(item, index) => index}
                    renderItem={(info) =>{
                        console.log('info', info)
                return(
                <TouchableOpacity onPress={() => this.itemSelectedHandler(info.item)}>
                    <View style={styles.drawerItem3}>
                        <Text style={styles.textOnList}> {info.item.name.toUpperCase()}</Text>
                    </View>
                </TouchableOpacity>
            )}}
        />
            )
        }
    }

    gotoHome() {
        startMainTabs();
    }

    render() {
        return (
            <View
                style={[
                    styles.container,
                    {width: Dimensions.get("window").width * 0.8}
                ]}
            >

                

                <TouchableOpacity onPress={this.props.onLogout}>
                        <View style={styles.drawerItem}>
                                <Icon
                                    name={Platform.OS === "android" ? "md-log-out" : "ios-log-out"}
                                    size={30}
                                    color="white"
                                    style={styles.drawerItemIcon}
                                />
                            <View>
                                <Text style={{color:"white"}}>Sign Out</Text>
                                <Text style={{fontSize:10, color:"white"}}>REF_CODE: {this.state.ref_code_user}</Text>
                                <Text style={{fontSize:10, color:"white"}}>{this.state.email}</Text>
                            </View>
                        </View>
                </TouchableOpacity>
                <ScrollView>
                <View style={styles.listOnDrawer}>
                    <TouchableOpacity onPress={this.gotoHome}>
                        <View style={styles.drawerItem2}>
                            <View  style={{width:45}}>
                                <Icon
                                    name={Platform.OS === "android" ? "md-home" : "ios-home"}
                                    size={30}
                                    color="#490E14"
                                    style={styles.drawerItemIcon}
                                />
                            </View>
                            <View>
                                <Text style={styles.textOnList}>Home</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.goTourPackage}>
                        <View style={styles.drawerItem2}>
                            <View  style={{width:45}}>
                                <Icon
                                    name="ios-briefcase"
                                    size={30}
                                    color="#490E14"
                                    style={styles.drawerItemIcon}
                                />
                            </View>
                            <View>
                            <Text style={styles.textOnList}>All Tour Package</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    {/* category */}
                    <View >
                    {/* {this.renderMain()} */}
                            {/* <View  style={{width:45}}>
                            <Text style={styles.textOnList}>ikon</Text>
                            </View>
                            <View>
                            <Text style={styles.textOnList}>flat list</Text>
                            </View> */}
                    </View>
                    <TouchableOpacity onPress={this.props.onRequestTour}>
                        <View style={styles.drawerItem2}>
                            <View  style={{width:45}}>
                                <Icon
                                    name="ios-open"
                                    size={30}
                                    color="#490E14"
                                    style={styles.drawerItemIcon}
                                />
                            </View>
                            <View>
                            <Text style={styles.textOnList}>Request Tour</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.props.onPayment}>
                        <View style={styles.drawerItem2}>
                            <View style={{width:45}}>
                                <Icon
                                    name="md-cash"
                                    size={30}
                                    color="#490E14"
                                    style={styles.drawerItemIcon}
                                />
                            </View>
                            <View>
                            <Text style={styles.textOnList}>Purchase & Payment</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        backgroundColor: "white",
        flex: 1
    },
    drawerItem: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        height: 100,
        backgroundColor: "#490E14"
    },
    drawerItem2: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        height: 50,
        backgroundColor: "white"
    },
    drawerItem3:{
        marginLeft:40,
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        height: 50,
        backgroundColor: "white"
    },
    drawerItemIcon: {
        marginRight: 10,
    },
    listOnDrawer: {
        padding: 10,
        paddingVertical: 10
    },
    textOnList: {
        padding:5,
        alignItems: "center",
        justifyContent:'center',
        color:"#490E14"
    },
    listContainer: {
        width: "100%"
    },
    listItem: {
        width:"100%",
        height:50,
        alignItems:'flex-start',

    },
});

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authLogout()),
        onRequestTour: () => dispatch(startRequestTour()),
        goTourPackage: () => dispatch(startTourPackage()),
        onPayment: () => dispatch(startPayment()),
        itemSelectedHandler: () => dispatch(startTourPackage())
    };
};

export default connect(null, mapDispatchToProps)(SideDrawer);
