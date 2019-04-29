/**
 * Created by mata on 9/11/18.
 */

import React, { Component } from "react";
import {
    ImageBackground,
    View,
    Text,
    Image,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    TouchableHighlight,
    Button,
    Alert,
    TextInput,
    ScrollView,
    AsyncStorage,
    ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import { Navigation } from "react-native-navigation";
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../../components/UI/TextCustom/TextCustom"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import FontAwesome from "react-native-vector-icons/FontAwesome"

import { authLogout, startRequestTour, startTourPackage, startPayment, profile, setLogged } from "../../store/actions/index";

//custom icon
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon

class Profile extends Component {
    static navigatorStyle = {

    };

    state = {
        email: '',
        isLoading: true,
        screenState: null,
        test: '',
        isBoxLogin: true,
        isBoxProfile: false,


        isUpdate: false
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case "didAppear":
                // console.log("didAppear")
                // this.setState({ test: 'ya' })
                AsyncStorage.getItem("ap:logged").then((value) => {

                    if (value !== null) {

                        if (this.props.isLogin) {
                            console.log('login pertama')
                            this.props.onProfile()
                            this.props.onSetLogged()
                            this.setState({ isBoxLogin: false, isBoxProfile: true })
                        }
                        console.log('ga kebaca lagi')
                    }
                    else {
                        console.log('belum login')
                    }
                })
                break;
            // case 'didDisappear':
            //     // this.setState({ isCameraLoading: true })
            //     this.componentWillUnmount()
            //     RNSimpleCompass.stop();
            //     console.log("kompas dead")
            //     break;
        }
    }

    componentWillMount() {

        AsyncStorage.getItem("ap:logged").then((value) => {

            if (value !== null) {
                console.log('udah login')
                this.props.onProfile()
                this.setState({ isBoxLogin: false, isBoxProfile: true })
            }
            else {
                console.log('belum login')
            }
        })

    }

    componentWillUnmount() {
        // this._sub.remove();
    }

    componentDidUpdate(prevProps, prevState) {

        if (!this.state.isUpdate) {
            AsyncStorage.getItem("ap:logged").then((value) => {

                if (value !== null) {
                    console.log('udah login')
                    this.props.onProfile()
                    this.setState({ isBoxLogin: false, isBoxProfile: true, isUpdate: true })
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

    render() {
        console.log('this.props', this.props)
        let boxLogin = null
        let boxProfile = null
        let boxPoint = null
        let logout = null
        if (this.state.isBoxLogin) {
            boxLogin = (
                <View style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: 8, padding: 16 }}>
                    <TextNormal style={{ color: '#757575', fontSize: 14, width: '100%', textAlign: 'center', marginTop: 64, marginBottom: 40 }}>Become a member and enjoy the benefits!</TextNormal>
                    <View style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', marginBottom: 38 }}>
                        <TouchableOpacity onPress={() => this.onButtonKlik("login")}>
                            <View style={{ width: 150, height: 40, backgroundColor: '#FF9D00', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                                <TextMedium style={{ color: '#ffffff', fontSize: 16 }}>Login</TextMedium>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.onButtonKlik("signup")}>
                            <View style={{ width: 150, height: 40, backgroundColor: '#fff', borderRadius: 5, borderWidth: 1, borderColor: '#757575', alignItems: 'center', justifyContent: 'center' }}>
                                <TextMedium style={{ color: '#757575', fontSize: 16 }}>Register</TextMedium>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
            )
        }

        if (this.state.isBoxProfile) {
            boxProfile = (
                <View style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: 8 }}>
                    <TextNormal style={{ width: '100%', paddingLeft: 12, color: '#757575', fontSize: 18, marginTop: 10, marginBottom: 14 }}>Umum</TextNormal>

                    <View style={{ width: '100%', paddingHorizontal: 18, marginBottom: 8 }}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: "center", height: 40 }}>
                            <Ico name='user-shape' color='#3EBA49' size={24} style={{ width: '15%' }} />
                            <TouchableOpacity style={{ width: '85%', height: "100%", justifyContent: 'center' }} onPress={this.onKlik}>
                                <View style={{ width: '100%', height: "100%", borderBottomColor: '#3EBA49', borderBottomWidth: 1, justifyContent: "center" }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, paddingLeft: 10 }}>{this.props.profile !== null ? this.props.profile.email : "Username"}</TextNormal>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 18, marginBottom: 8 }}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: "center", height: 40 }}>
                            <Ico name='email' color='#3EBA49' size={24} style={{ width: '15%' }} />
                            <TouchableOpacity style={{ width: '85%', height: "100%", justifyContent: 'center' }} onPress={this.onKlik}>
                                <View style={{ width: '100%', height: "100%", borderBottomColor: '#3EBA49', borderBottomWidth: 1, justifyContent: "center" }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, paddingLeft: 10 }}>{this.props.profile !== null ? this.props.profile.email : "Email"}</TextNormal>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 18, marginBottom: 8 }}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: "center", height: 40 }}>
                            <MaterialIcons name='link' color='#3EBA49' size={24} style={{ width: '15%' }} />
                            <TouchableOpacity style={{ width: '85%', height: "100%", justifyContent: 'center' }} onPress={this.onKlik} >
                                <View style={{ width: '100%', height: "100%", borderBottomColor: '#3EBA49', borderBottomWidth: 1, justifyContent: "center" }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, paddingLeft: 10 }}>{this.props.profile !== null ? this.props.profile.ref_code_user : "Ref Code"}</TextNormal>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 18, marginBottom: 8 }}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: "center", height: 40 }}>
                            <MaterialIcons name='phone' color='#3EBA49' size={24} style={{ width: '15%' }} />
                            <TouchableOpacity style={{ width: '85%', height: "100%", justifyContent: 'center' }} onPress={this.onKlik}>
                                <View style={{ width: '100%', height: "100%", borderBottomColor: '#3EBA49', borderBottomWidth: 1, justifyContent: "center" }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, paddingLeft: 10 }}>{this.props.profile !== null ? this.props.profile.phone : "No Telepon"}</TextNormal>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ width: '100%', paddingHorizontal: 18, marginBottom: 8 }}>
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: "center", height: 40 }}>
                            <Ico name='lock' color='#3EBA49' size={24} style={{ width: '15%' }} />
                            <TouchableOpacity style={{ width: '85%', height: "100%", justifyContent: 'center' }} onPress={this.onKlik}>
                                <View style={{ width: '100%', height: "100%", borderBottomColor: '#3EBA49', borderBottomWidth: 1, justifyContent: "center" }}>
                                    <TextNormal style={{ color: '#757575', fontSize: 14, paddingLeft: 10 }}>******</TextNormal>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )
            boxPoint = (
                <View style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 18, flexDirection: 'row', }}>
                    <MaterialIcons name={'attach-money'} color={'#FEBB12'} size={19} />
                    <TextNormal style={{ color: '#FEBB12', fontSize: 16, marginLeft: 40 }}>{this.props.point}</TextNormal>
                    <TextNormal style={{ color: '#757575', fontSize: 16, marginLeft: 35 }}>My bonus point</TextNormal>
                </View>
            )
            logout = (
                <View style={{ width: deviceWidth, flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', marginTop: 10 }}>
                    <View style={{ width: '100%', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                        <FontAwesome name='sign-out' color='#EF3D2F' size={24} style={{ width: '15%' }} />
                        <TouchableOpacity style={{ width: '85%' }} onPress={this.props.onLogout}>
                            <TextSemiBold style={{ color: '#757575', fontSize: 18 }}>Log Out</TextSemiBold>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }

        // console.log('this props', this.props.profile)
        // return (
        //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >

        //         <Text style={{ paddingTop: 10 }}>Hello world</Text>
        //     </View >
        // )
        if (this.props.isLoading) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#FF9D00" />
                    <Text style={{ paddingTop: 10 }}>Loading ...</Text>
                </View>
            )
        } else {
            return (
                <ScrollView style={{ backgroundColor: '#c4c4c4' }}>
                    <View style={styles.container}>

                        <View style={{ width: deviceWidth, paddingHorizontal: 8, marginVertical: 8 }}>
                            {boxLogin}
                            {boxProfile}
                            <View style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: 8, paddingHorizontal: 18, paddingVertical: 18, flexDirection: 'row', marginTop: 8 }}>
                                <MaterialIcons name={'attach-money'} color={'#FEBB12'} size={19} />
                                <TextNormal style={{ color: '#FEBB12', fontSize: 16, marginLeft: 40 }}>{this.props.point}</TextNormal>
                                <TextNormal style={{ color: '#757575', fontSize: 16, marginLeft: 35 }}>My bonus point</TextNormal>
                            </View>
                        </View>
                        {/* panel bawah */}
                        <View style={{ width: deviceWidth, paddingHorizontal: 8 }}>
                            <View style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: 8 }}>
                                <TextNormal style={{ width: '100%', paddingLeft: 12, color: '#757575', fontSize: 18, marginTop: 10, marginBottom: 14 }}>Terms and Condition</TextNormal>
                                {/* service */}
                                <View style={{ width: '100%', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <FontAwesome name='info' color='#FF9D00' size={24} style={{ width: '15%' }} />
                                    <TouchableOpacity style={{ width: '85%' }} onPress={this.onKlik}>
                                        <TextMedium style={{ color: '#757575', fontSize: 14 }}>Services</TextMedium>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ width: '100%', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <FontAwesome name='file-text' color='#3EBA49' size={24} style={{ width: '15%' }} />
                                    <TouchableOpacity style={{ width: '85%' }} onPress={this.onKlik}>
                                        <TextMedium style={{ color: '#757575', fontSize: 14 }}>FAQ</TextMedium>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ width: '100%', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                                    <FontAwesome name='question-circle' color='#4F7BBE' size={24} style={{ width: '15%' }} />
                                    <TouchableOpacity style={{ width: '85%' }} onPress={this.onKlik}>
                                        <TextMedium style={{ color: '#757575', fontSize: 14 }}>Help</TextMedium>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {logout}
                        {/* <View style={{ width: deviceWidth, flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center', marginTop: 10 }}>
                        <View style={{ width: '100%', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                            <FontAwesome name='sign-out' color='#EF3D2F' size={24} style={{ width: '15%' }} />
                            <TouchableOpacity style={{ width: '85%' }} onPress={this.props.onLogout}>
                                <TextSemiBold style={{ color: '#757575', fontSize: 18 }}>Log Out</TextSemiBold>
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    </View>
                </ScrollView >
            )
        }
    }
}
const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
    formInput: {
        borderColor: '#333',
    },
    container: {
        // width: "100%",
        flex: 1,
        backgroundColor: '#C4C4C4'
    },
    input: {
        // backgroundColor: "#eee",
        // borderColor: "#bbb"
    },
})

const mapStateToProps = state => {
    return {
        isLoading: state.ui.isLoading,
        isLogin: state.isLogin.isLogin,
        profile: state.profile.profile,
        point: state.point.point
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onLogout: () => dispatch(authLogout()),
        onRequestTour: () => dispatch(startRequestTour()),
        goTourPackage: () => dispatch(startTourPackage()),
        onPayment: () => dispatch(startPayment()),
        itemSelectedHandler: () => dispatch(startTourPackage()),

        onProfile: () => dispatch(profile()),
        onSetLogged: () => dispatch(setLogged()),
        // checkLogin :()=>dispatch(setl)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);