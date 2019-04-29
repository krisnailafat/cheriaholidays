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
    Alert
} from "react-native";
import { connect } from "react-redux";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import { Navigation } from "react-native-navigation";
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../../components/UI/TextCustom/TextCustom"
//custom icon
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon

class LupaPassword extends Component {
    static navigatorStyle = {
        navBarTextColor: '#757575',
        navBarBackgroundColor: '#ffffff',
        navBarTextFontFamily: 'EncodeSans-Regular',
        navBarButtonColor: '#3EBA49',
        topBarElevationShadowEnabled: false,
        navBarTitleTextCentered: true,
    };

    state = {
        email: ''
    }

    handlerLupaPassword = () => {
        console.log('email', this.state.email)

        url = 'https://travelfair.co/auth/password/reset/';
        fetch(url, {
            method: "POST",
            body: JSON.stringify({
                email: this.state.email,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .catch(err => {
                console.log(err);
            })
            .then(res => {
                Alert.alert(
                    'RESET PASSWORD',
                    'Silahkan cek email Anda untuk mereset password Cheria Holiday Apps',
                    [
                        {
                            text: 'OK', onPress: () => {
                                Navigation.startSingleScreenApp({
                                    screen: {
                                        screen: "cheria-holidays.AuthScreen",
                                        title: "Login"
                                    }
                                });
                            }
                        },
                    ],
                    { cancelable: false }
                )
            })

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <View style={{ paddingVertical: 0, width: "90%" }}>
                    {/* Text input email */}
                        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 }}>
                            <View style={{ width: '10%' }}>
                                <Ico name='email' size={25} color='#3EBA49' />
                            </View>
                            <View style={{ width: '90%', justifyContent: 'space-between' }}>
                                <TextNormal style={{ color: '#CECECE', fontSize: 12 }}>Masukan Email Anda</TextNormal>
                                <DefaultInput
                                    // placeholder="Tulis alamat Email Anda"
                                    style={styles.input}
                                    value={this.state.email}
                                    onChangeText={val => this.setState({ email: val })}
                                    //valid={this.state.controls.email.valid}
                                    //touched={this.state.controls.email.touched}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>
                        {/* <DefaultInput
                            placeholder="Tulis alamat Email Anda"
                            style={styles.input}
                            value={this.state.email}
                            onChangeText={val => this.setState({ email: val })}
                            //valid={this.state.controls.email.valid}
                            //touched={this.state.controls.email.touched}
                            autoCapitalize="none"
                            autoCorrect={false}
                            keyboardType="email-address"
                        /> */}
                    </View>
                </View>
                <View style={{ flex: 0.3, alignItems: 'center' }}>
                    <View style={{ paddingHorizontal: 18, width: Dimensions.get('window').width }}>
                        <TouchableOpacity onPress={this.handlerLupaPassword}>
                            <View style={{ borderRadius: 5, height: 40, backgroundColor: '#FF9D00', width: '100%', alignItems: "center", justifyContent: 'center' }}>
                                <TextMedium style={{ color: '#ffffff', fontSize: 16 }}>Reset Password</TextMedium>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    formInput: {
        borderColor: '#333',
    },
    container: {
        // width: "100%",
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    input: {
        // backgroundColor: "#eee",
        // borderColor: "#bbb"
    },
})

export default connect(null, null)(LupaPassword);