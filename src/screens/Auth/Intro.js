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
    AsyncStorage,
    TouchableOpacity,
    TouchableHighlight,
    Button,
    Alert,
    BackHandler
} from "react-native";
import { connect } from "react-redux";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import { Navigation } from "react-native-navigation";
import Ionicons from "react-native-vector-icons/Ionicons";
import AppIntroSlider from 'react-native-app-intro-slider';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json';
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../../components/UI/TextCustom/TextCustom"

const Ico = createIconSetFromIcoMoon(icoMoonConfig);

class Intro extends Component {
    static navigatorStyle = {
        // navBarTextColor:'white',
        // navBarBackgroundColor:'#ce0b24',
        // navBarButtonColor:'white'
        navBarHidden: true
    };

    state = {
        email: ''
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        // const condition = {
        //     badge: true
        // };
        // this.interval = setInterval(() => this.props.goToHome(condition), 3000);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        // clearInterval(this.interval);
    }

    handleBackButton() {
        ToastAndroid.show('Back button is pressed', ToastAndroid.SHORT);
        return true;
    }

    slides = [
        {
            key: 'somethun',
            title: 'Selamat Datang',
            text: 'Nikmati berbagai kemudahan berwisata islami dengan cheria.',
            // icon: 'Illustration-1',
            image: require('../../assets/illustration-1.png'),
            imageStyle: styles.image,
            // colors: ['#63E2FF', '#B066FE'],
        },
        {
            key: 'somethun1',
            title: 'Pilihan Tour Umat',
            text: 'Pilih paket tour dengan harga bersaing, atau request sesuai kebutuhan.',
            // icon: 'Illustration-2',
            image: require('../../assets/illustration-2.png'),
            imageStyle: styles.image,
            // colors: ['#A3A1FF', '#3A3897'],
        },
        {
            key: 'somethun2',
            title: 'Muslim Word',
            text: 'dengan cheria app beribadah menjadi nyaman karna fitur muslim world.',
            // icon: 'Illustration-3',
            image: require('../../assets/illustration-3.png'),
            imageStyle: styles.image,
            // colors: ['#29ABE2', '#4F00BC'],
        },
    ];

    _renderDoneButton = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state

        return (
            <TouchableOpacity onPress={this._onDone}>
                <View style={styles.buttonDone}>
                    <TextMedium style={{ color: '#5C8ECC', fontSize: 16 }}>Okay, I’m in!</TextMedium>
                </View>
            </TouchableOpacity>
        );
    }

    _onDone = () => {
        // User finished the introduction. Show real app through
        // navigation or simply by controlling state
        AsyncStorage.setItem("ap:intro", "installed").then(res => {
            this.props.navigator.dismissModal({
                animationType: 'fade' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
            });
        })
    }

    _renderItem = props => (
        <View
            style={[styles.mainContent, {
                paddingTop: props.topSpacer,
                paddingBottom: props.bottomSpacer,
                // width: props.width,
                // height: props.height,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height,
            }]}
            colors={'#ffffff'}
        // start={{ x: 0, y: .1 }} end={{ x: .1, y: 1 }}
        >
            {/* <Ico color='red' name={props.icon} size={200} /> */}
            <Image resizeMode='contain' style={props.imageStyle} source={props.image} />
            <View>
                <TextSemiBold style={styles.title}>{props.title}</TextSemiBold>
                <TextMedium style={styles.text}>{props.text}</TextMedium>
            </View>
        </View>
    );

    render() {

        return (
            <AppIntroSlider
                slides={this.slides}
                renderItem={this._renderItem}
                renderDoneButton={this._renderDoneButton}
                renderNextButton={this._renderNextButton}
                // onDone={() => this._onDone}
                buttonTextStyle={{ color: '#3EBA49' }}
                activeDotStyle={{ backgroundColor: '#F396C2' }}
            // showSkipButton={true}
            // onSkip={}
            />
        );

    }
}

const styles = StyleSheet.create({
    mainContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
    },
    image: {
        width: 320,
        height: 320,
    },
    text: {
        color: '#3EBA49',
        backgroundColor: 'transparent',
        textAlign: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 22,
        color: '#3EBA49',
        backgroundColor: 'transparent',
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonDone: {
        width: 115,
        height: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#5C8ECC'
    }
})

export default connect(null, null)(Intro);