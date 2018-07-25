import React, {Component} from "react";

import {Navigation} from 'react-native-navigation';

import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    Platform,
    AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {connect} from "react-redux";

import {authLogout, startRequestTour, startTourPackage, startPayment} from "../../store/actions/index";

class SideDrawer extends Component {
    state = {
        email:'',
    }

    constructor(props) {
        super(props);
        console.log('navigator props', props)
    }

    componentWillMount(){
        AsyncStorage.getItem("ap:auth:email").then((value) => {
            this.setState({"email": value});
        })
            .then(res => {
                // console.log('state email on drawer:', this.state.email)
            })
    }

    gotoHome() {
        Navigation.startSingleScreenApp({
            screen: {
                screen: "cheria-holidays.AuthScreen",
                title: "Login"
            }
        });
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
                                <Text style={{fontSize:10, color:"white"}}>{this.state.email}</Text>
                            </View>
                        </View>
                </TouchableOpacity>
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
                            <Text style={styles.textOnList}>Paket Tour Cheria</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
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
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authLogout()),
        onRequestTour: () => dispatch(startRequestTour()),
        goTourPackage: () => dispatch(startTourPackage()),
        onPayment: () => dispatch(startPayment())
    };
};

export default connect(null, mapDispatchToProps)(SideDrawer);
