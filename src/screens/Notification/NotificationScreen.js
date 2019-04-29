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
    ScrollView,
    FlatList,
    AsyncStorage
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

class NotificationScreen extends Component {
    static navigatorStyle = {
        navBarTextColor: '#2BB04C',
        navBarBackgroundColor: '#ffffff',
        navBarTextFontFamily: 'EncodeSans-SemiBold',
        navBarButtonColor: '#3EBA49',
    };

    state = {
        email: '',
        screenState: null,

        // data notif array tanpa notif
        notifArray: []
    }

    componentDidMount() {
        AsyncStorage.getItem('notif:array').then((value1) => {
            this.setState({ notifArray: JSON.parse(value1) })
            console.log(value1)
        })
    }

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    }

    onNavigatorEvent(event) {
        switch (event.id) {
            case 'willAppear':
                this.screenState = "willAppear";
                break;
            case 'didAppear':
                this.screenState = "didAppear";
                break;
            case 'willDisappear':
                this.screenState = "willDisappear";
                break;
            case 'didDisappear':
                this.screenState = "didDisappear";
                break;
        }

        // if (event.type == 'DeepLink' && (this.screenState == "willAppear" || this.screenState == "didAppear")) {
        if (event.type == 'DeepLink') {
            //Make your things..
            console.log("ini halaman notif notif ^^")
        }
    }

    renderDataNotif = () => {
        // console.log('render data notif, ', this.props.dataNotif.dataArrayNotif)



        if (this.props.dataNotif !== undefined || null || this.state.notifArray !== null) {

            return (
                <FlatList
                    // style={{marginBottom}}
                    data={this.state.notifArray || this.props.dataNotif.dataArrayNotif}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={(info) => {
                        console.log('render data notif info, ', info)
                        return (
                            <View style={{ marginBottom: 8 }}>
                                <TextNormal style={{ color: '#404040', fontSize: 14, marginBottom: 8 }}>{this.props.dataNotif !== undefined ? info.item.title : info.item.title}</TextNormal>
                                <TextNormal style={{ color: '#404040', fontSize: 12 }}>{this.props.dataNotif !== undefined ? info.item.body : info.item.body}</TextNormal>
                            </View>
                        )
                    }}
                />
            )
        } else {
            return (
                <View>
                    <TextNormal style={{ color: '#404040', fontSize: 14, marginBottom: 8 }}>Belum ada notif</TextNormal>
                </View>
            )
        }
    }

    render() {
        console.log(this.props.dataNotif)
        return (
            <ScrollView style={{ backgroundColor: '#C4C4C4' }} >
                <View style={styles.container}>
                    <View style={{ width: '100%', backgroundColor: '#ffffff', borderRadius: 8, padding: 12 }}>
                        {this.renderDataNotif()}
                    </View>
                </View>
            </ScrollView>
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
        backgroundColor: '#C4C4C4',
        paddingHorizontal: 8,
        marginTop: 8
    },
    input: {
        // backgroundColor: "#eee",
        // borderColor: "#bbb"
    },
})

export default connect(null, null)(NotificationScreen);