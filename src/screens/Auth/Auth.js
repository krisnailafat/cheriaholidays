import React, { Component } from "react";
import {
  Platform,
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
  AsyncStorage,
  ScrollView,
  Alert
} from "react-native";
import { connect } from "react-redux";

import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import MainText from "../../components/UI/MainText/MainText";
import ButtonWithBackground from "../../components/UI/ButtonWithBackground/ButtonWithBackground";
import validate from "../../utility/validation";
import { tryAuth, authAutoSignIn, setLogin } from "../../store/actions/index";
import startMainTabs from "../../screens/MainTabs/startMainTabs";
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../../components/UI/TextCustom/TextCustom"
import Icon from "react-native-vector-icons/Ionicons"
//custom icon
import { createIconSetFromFontello, createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from '../../assets/selection.json'
const Ico = createIconSetFromIcoMoon(icoMoonConfig);
//custom icon
import firebase from 'react-native-firebase';
// import type { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';

class AuthScreen extends Component {

  static navigatorStyle = {
    navBarBackgroundColor: '#ffffff',
    navBarButtonColor: '#3EBA49',
    navBarCustomView: 'cheria-holidays.CustomTopBar',
    navBarComponentAlignment: 'center',
    tabBarHidden: true,
    drawUnderTabBar: false,
    // navBarCustomViewInitialProps: { title: 'Hi Custom' }
    topBarElevationShadowEnabled: false,
    orientation: 'portrait'
  };

  state = {
    viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape",
    // authMode: "login",
    authMode: this.props.valueAuth,
    referral_code: '',
    phone: '',
    login_email: '',
    login_password: '',
    controls: {
      email: {
        value: "",
        valid: false,
        validationRules: {
          isEmail: true
        },
        touched: false
      },
      password: {
        value: "",
        valid: false,
        validationRules: {
          minLength: 6
        },
        touched: false
      },
      confirmPassword: {
        value: "",
        valid: false,
        validationRules: {
          equalTo: "password"
        },
        touched: false
      }
    }
  };

  constructor(props) {
    super(props);
    Dimensions.addEventListener("change", this.updateStyles);
  }

  componentWillMount() {
    var varIntro = true;
    //TODO if user n pass available
    AsyncStorage.getItem("ap:auth:email").then((value1) => {
      this.setState({ login_email: value1 });
      if (value1 != null) {
        AsyncStorage.getItem("ap:auth:password").then((value2) => {
          this.setState({ login_password: value2 });
          console.log('login value passwd', value2)
          if (value2 != null) {
            url = 'https://travelfair.co/auth/token/login/';
            // console.log('data', authData)
            fetch(url, {
              method: "POST",
              body: JSON.stringify({
                email: value1,
                password: value2,
              }),
              headers: {
                "Content-Type": "application/json"
              }
            }).then(res => res.json())
              .then(parsedRes => {
                console.log('login result:', parsedRes);

                if (parsedRes.auth_token != undefined) {
                  AsyncStorage.setItem("ap:auth:token", parsedRes.auth_token)
                  AsyncStorage.setItem("ap:logged", 'true')
                  // startMainTabs();
                  Promise.all([
                    Ico.getImageSource(Platform.OS === 'android' ? "home" : "ios-cart", 30), //0
                    Ico.getImageSource(Platform.OS === 'android' ? "story" : "ios-add-circle", 24, '#FFF'), //1
                    Icon.getImageSource(Platform.OS === 'android' ? "md-menu" : "ios-menu", 30), //2
                    Ico.getImageSource(Platform.OS === 'android' ? "small-mosque" : "ios-star", 30), //3
                    Ico.getImageSource("notifications", 24, '#FFFFFF'), //4
                    Ico.getImageSource("invoice", 24, '#FFFFFF'), //5
                    Icon.getImageSource("md-notifications", 24, '#FFFFFF'), //6
                    Ico.getImageSource("user-shape", 22, '#FFFFFF'), //7rr
                  ]).then(sources => {

                    Navigation.startTabBasedApp({
                      tabs: [
                        {
                          screen: "cheria-holidays.CategoryTourPackage",
                          label: "Home",
                          title: "Tujuan Wisata",
                          icon: sources[0],
                          navigatorButtons: {
                            leftButtons: [
                              {
                                icon: require('../../assets/logoHeader/icon_header.png'),
                                title: "Menu",
                                id: "sideDrawerToggle"
                              }
                            ],
                            rightButtons: [
                              {
                                id: 'profile',
                                icon: sources[7],

                              },
                              {
                                id: 'notificationToggle',
                                icon: sources[6],
                                badgeStyle: 'red',
                                badgeCount: 0
                              },
                            ]

                          }
                        },
                        {
                          // screen: "cheria-holidays.RequestTour",
                          // title: "Request Tour",
                          // label: "Request Tour",
                          screen: "cheria-holidays.PaymentRecord",
                          title: "Pembelian / Pembayaran",
                          label: "Order",
                          // icon: sources[1],
                          icon: sources[5],
                          navigatorStyle: {
                            // drawUnderTabBar: false,
                          },
                          navigatorButtons: {
                            leftButtons: [
                              {
                                // icon: sources[2],
                                icon: require('../../assets/logoHeader/permintaan.png'),
                                title: "Menu",
                                id: "sideDrawerToggle"
                              }
                            ]
                          }
                        },
                      ],
                      appStyle: {
                        forceTitlesDisplay: true,
                        navBarTextColor: "#ffffff",
                        navBarBackgroundColor: '#2BB04C',
                        navBarTextFontFamily: 'EncodeSans-Medium',
                        tabBarSelectedButtonColor: "#34A941",
                        tabBarButtonColor: "#BBBBBB",
                        tabFontFamily: 'EncodeSans-Regular',
                        tabFontSize: 12,
                        selectedTabFontSize: 12,
                        orientation: 'portrait'
                      },
                    });
                  })
                } else {
                  Alert.alert("Username & Password yang Anda masukan salah")
                }


              });
            // startMainTabs();
          }
        })
      }
      // else { //intro aplikasi

      //   AsyncStorage.getItem("ap:intro").then((value) => {
      //     console.log("isinya, ", value)
      //     if (value == null) {
      //       this.props.navigator.showModal({
      //         screen: "cheria-holidays.Intro", // unique ID registered with Navigation.registerScreen
      //         // title: "Modal", // title of the screen as appears in the nav bar (optional)
      //         passProps: {}, 
      //         navigatorStyle: {}, 
      //         animationType: 'fade' ,
      //         overrideBackPress: true
      //       });
      //     }
      //   })

      // }
    }).catch(err => console.log(err));

    // const authData = {
    //     email: this.state.login_email,
    //     password: this.state.login_password,
    //     phone:this.state.phone
    // };
    //
    // console.log('login info', this.state.login_email, this.state.login_password)
    //
    // if(this.state.login_password !== '' && this.state.login_email !== ''){
    //     // this.props.onTryAuth(authData, "login");
    //     startMainTabs();
    // }
  }

  componentWillUnmount() {
    Dimensions.removeEventListener("change", this.updateStyles);

    //Notification
  }

  switchAuthModeHandler = () => {
    this.setState(prevState => {
      return {
        authMode: prevState.authMode === "login" ? "signup" : "login"
      };
    });
  };

  updateStyles = dims => {
    this.setState({
      viewMode: dims.window.height > 500 ? "portrait" : "landscape"
    });
  };

  authHandler = () => {
    const authData = {
      email: this.state.controls.email.value,
      password: this.state.controls.password.value,
      phone: this.state.phone,
      referral_code: this.state.referral_code
    };
    //console.log('authData', authData)
    this.props.onTryAuth(authData, this.state.authMode).then(ok => {
      this.props.onSetLogin(); //set true
      this.props.navigator.dismissModal({
        animationType: 'none' // 'none' / 'slide-down' , dismiss animation for the modal (optional, default 'slide-down')
      });
    })
      // .catch(err => {
      //   Alert.alert("Gagal", err,
      //     [
      //       { text: 'OK' }
      //     ]
      //   )
      //   console.log(err)
      //   // this.switchAuthModeHandler()
      // })
  };

  updateInputState = (key, value) => {
    let connectedValue = {};
    if (this.state.controls[key].validationRules.equalTo) {
      const equalControl = this.state.controls[key].validationRules.equalTo;
      const equalValue = this.state.controls[equalControl].value;
      connectedValue = {
        ...connectedValue,
        equalTo: equalValue
      };
    }
    if (key === "password") {
      connectedValue = {
        ...connectedValue,
        equalTo: value
      };
    }
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          confirmPassword: {
            ...prevState.controls.confirmPassword,
            valid:
              key === "password"
                ? validate(
                  prevState.controls.confirmPassword.value,
                  prevState.controls.confirmPassword.validationRules,
                  connectedValue
                )
                : prevState.controls.confirmPassword.valid
          },
          [key]: {
            ...prevState.controls[key],
            value: value,
            valid: validate(
              value,
              prevState.controls[key].validationRules,
              connectedValue
            ),
            touched: true
          }
        }
      };
    });
  };

  lupaPasswdHandler = () => {
    console.log('lupa password')
    this.props.navigator.push({
      screen: "cheria-holidays.LupaPassword",
      title: "Reset Password",
    });
  }

  render() {
    // console.log("ini props, ", this.props)
    let headingText = null;
    let lupaPassword = null;
    let phoneInput = null;
    let referralCode = null;
    let confirmPasswordControl = null;

    let titleEmail = null; // header email
    let titlePassword = null; // header password

    let submitButton = (
      <ButtonWithBackground
        color="#FF9D00"
        onPress={this.authHandler}
        disabled={
          (!this.state.controls.confirmPassword.valid &&
            this.state.authMode === "signup") ||
          !this.state.controls.email.valid ||
          !this.state.controls.password.valid ||
          (this.state.phone === '' && this.state.authMode === "signup")
        }
      >
        Submit
      </ButtonWithBackground>
    );

    if (this.state.authMode === "login") {
      lupaPassword = (
        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 30 }}>
          <View>
            <TouchableOpacity onPress={this.lupaPasswdHandler}>
              <TextNormal style={{ color: '#757575', fontSize: 14 }}>Lupa Password</TextNormal>
            </TouchableOpacity>
          </View>
        </View>
      )
    }


    if (this.state.viewMode === "portrait") {
      headingText = (
        // <MainText>
        //   <HeadingText>Log In With Your Accoun</HeadingText>
        // </MainText>
        <TextNormal style={{ color: '#757575', fontSize: 16 }}>Log In With Your Account</TextNormal>
      );
    }
    if (this.state.authMode === "signup") {
      phoneInput = (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 }}>
          <View style={{ width: '10%' }}>
            <Icon name='md-call' size={25} color='#3EBA49' />
          </View>
          <View style={{ width: '90%', justifyContent: 'space-between' }}>
            <TextNormal style={{ color: '#757575', fontSize: 12 }}>Nomor HP Anda</TextNormal>
            <DefaultInput
              // placeholder="Tulis Nomor HP Anda"
              style={styles.input}
              value={this.state.phone}
              onChangeText={val => this.setState({ phone: val })}
              //valid={this.state.controls.email.valid}
              //touched={this.state.controls.email.touched}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        // <View>
        //   <Text style={{ fontSize: 10, lineHeight: 10, color: 'yellow' }}>*
        // <Text style={{ color: 'yellow' }}>  WAJIB di isi</Text> </Text>
        //   <DefaultInput
        //     placeholder="Tulis Nomor HP Anda"
        //     style={styles.input}
        //     value={this.state.phone}
        //     onChangeText={val => this.setState({ phone: val })}
        //     //valid={this.state.controls.email.valid}
        //     //touched={this.state.controls.email.touched}
        //     autoCapitalize="none"
        //     autoCorrect={false}
        //     keyboardType="email-address"
        //   />
        // </View>
      )
    }

    if (this.state.authMode === "signup") {
      referralCode = (
        <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 }}>
          <View style={{ width: '10%' }}>
            <Icon name='md-link' size={25} color='#3EBA49' />
          </View>
          <View style={{ width: '90%', justifyContent: 'space-between' }}>
            <TextNormal style={{ color: '#757575', fontSize: 12 }}>Referral Code / Email bila ada</TextNormal>
            <DefaultInput
              // placeholder="Tulis Referral Code / Email"
              style={styles.input}
              value={this.state.referral_code}
              onChangeText={val => this.setState({ referral_code: val })}
              //valid={this.state.controls.email.valid}
              //touched={this.state.controls.email.touched}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>
        </View>
        // <View>
        // <DefaultInput
        //   placeholder="Tulis Referral Code / Email"
        //   style={styles.input}
        //   value={this.state.referral_code}
        //   onChangeText={val => this.setState({ referral_code: val })}
        //   //valid={this.state.controls.email.valid}
        //   //touched={this.state.controls.email.touched}
        //   autoCapitalize="none"
        //   autoCorrect={false}
        //   keyboardType="email-address"
        // />
        // </View>
      )
    }

    if (this.state.authMode === "signup") {
      confirmPasswordControl = (
        <View
          style={
            this.state.viewMode === "portrait"
              ? styles.portraitPasswordWrapper
              : styles.landscapePasswordWrapper
          }
        >
          <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 }}>
            <View style={{ width: '10%' }}>
              <Ico name='lock' size={25} color='#3EBA49' />
            </View>
            <View style={{ width: '90%', justifyContent: 'space-between' }}>
              <TextNormal style={{ color: '#757575', fontSize: 12 }}>Konfirmasi Password</TextNormal>
              <DefaultInput
                // placeholder="Konfirmasi Password"
                style={styles.input}
                value={this.state.controls.confirmPassword.value}
                onChangeText={val => this.updateInputState("confirmPassword", val)}
                valid={this.state.controls.confirmPassword.valid}
                touched={this.state.controls.confirmPassword.touched}
                secureTextEntry
              />
            </View>
          </View>
          {/* <Text style={{ fontSize: 10, lineHeight: 10, color: 'yellow' }}>*
        <Text style={{ color: 'yellow' }}> WAJIB di isi</Text> </Text>
          <DefaultInput
            placeholder="Konfirmasi Password"
            style={styles.input}
            value={this.state.controls.confirmPassword.value}
            onChangeText={val => this.updateInputState("confirmPassword", val)}
            valid={this.state.controls.confirmPassword.valid}
            touched={this.state.controls.confirmPassword.touched}
            secureTextEntry
          /> */}
        </View>
      );
    }

    if (this.state.authMode === "signup") {
      titleEmail = (
        <Text style={{ fontSize: 10, lineHeight: 10, color: 'yellow' }}>*
        <Text style={{ color: 'yellow' }}> WAJIB di isi</Text> </Text>
      )
      titlePassword = (
        <Text style={{ fontSize: 10, lineHeight: 10, color: 'yellow' }}>*
        <Text style={{ color: 'yellow' }}> WAJIB di isi</Text> </Text>
      )
    }

    if (this.props.isLoading) {
      submitButton = <ActivityIndicator />;
    }
    return (
      // <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      // <KeyboardAvoidingView style={styles.container} behavior="padding">
      <ScrollView style={styles.container}>
        <View style={{ alignItems: 'center', justifyContent: 'center' }} >
          {/* bagian atas */}
          {headingText}
          <View style={{ alignItems: 'center', width: Dimensions.get('window').width }}>
            {/* <ButtonWithBackground
          color="#e77083"
          onPress={this.switchAuthModeHandler}
        >
          {this.state.authMode === "login" ? "Register" : "Kembali ke Login"}
        </ButtonWithBackground> */}
            {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
            <View style={styles.inputContainer}>
              {/* {titleEmail} */}

              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 16 }}>
                <View style={{ width: '10%' }}>
                  <Ico name='email' size={25} color='#3EBA49' />
                </View>
                <View style={{ width: '90%', justifyContent: 'space-between' }}>
                  <TextNormal style={{ color: '#757575', fontSize: 12 }}>E-mail</TextNormal>
                  <DefaultInput
                    // placeholder="Tulis Email Anda"
                    style={styles.input}
                    value={this.state.controls.email.value}
                    onChangeText={val => this.updateInputState("email", val)}
                    valid={this.state.controls.email.valid}
                    touched={this.state.controls.email.touched}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'flex-end', marginBottom: 20 }}>
                <View style={{ width: '10%' }}>
                  <Ico name='lock' size={25} color='#3EBA49' />
                </View>
                <View style={{ width: '90%', justifyContent: 'space-between' }}>
                  <TextNormal style={{ color: '#757575', fontSize: 12 }}>Password</TextNormal>
                  <DefaultInput
                    // placeholder="Password"
                    style={styles.input}
                    value={this.state.controls.password.value}
                    onChangeText={val => this.updateInputState("password", val)}
                    valid={this.state.controls.password.valid}
                    touched={this.state.controls.password.touched}
                    secureTextEntry
                  />
                </View>
              </View>
              {confirmPasswordControl}
              {lupaPassword}
              {/* <DefaultInput
                placeholder="Tulis Email Anda"
                style={styles.input}
                value={this.state.controls.email.value}
                onChangeText={val => this.updateInputState("email", val)}
                valid={this.state.controls.email.valid}
                touched={this.state.controls.email.touched}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              /> */}
              {phoneInput}
              {referralCode}
              <View
                style={
                  this.state.viewMode === "portrait" ||
                    this.state.authMode === "login"
                    ? styles.portraitPasswordContainer
                    : styles.landscapePasswordContainer
                }
              >
                <View
                  style={
                    this.state.viewMode === "portrait" ||
                      this.state.authMode === "login"
                      ? styles.portraitPasswordWrapper
                      : styles.landscapePasswordWrapper
                  }
                >
                  {/* {titlePassword} */}
                  {/* <DefaultInput
                    placeholder="Password"
                    style={styles.input}
                    value={this.state.controls.password.value}
                    onChangeText={val => this.updateInputState("password", val)}
                    valid={this.state.controls.password.valid}
                    touched={this.state.controls.password.touched}
                    secureTextEntry
                  /> */}
                </View>
              </View>
            </View>
            {/* </TouchableWithoutFeedback> */}
          </View >
          <View style={{ alignItems: 'center', width: Dimensions.get('window').width, justifyContent: 'space-between' }}>
            <View style={{ width: '90%' }}>
              {submitButton}
            </View>
            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingBottom: 20 }}>
              <TextNormal style={{ color: '#757575', fontSize: 14 }}>{this.state.authMode === "login" ? "Belum punya akun?" : null} </TextNormal>
              <TouchableOpacity onPress={this.switchAuthModeHandler}>
                <TextSemiBold style={{ color: '#FF9D00', fontSize: 14 }}>{this.state.authMode === "login" ? "Daftar" : "Kembali ke Login"}</TextSemiBold>
              </TouchableOpacity>
            </View>
          </View >
          {/* bagian bawah */}
        </View >
      </ScrollView>
      //</KeyboardAvoidingView >
      // </ImageBackground>
    );
  }
}

const deviceWidth = Dimensions.get('window').width
const deviceHeight = Dimensions.get('window').height

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    width: deviceWidth,
    // height: deviceHeight,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: '#ffffff'
  },
  backgroundImage: {
    width: "100%",
    flex: 1
  },
  inputContainer: {
    marginTop: 50,
    width: "90%"
  },
  input: {
    // backgroundColor: "#eee",
    // borderColor: "#bbb"
    color: '#3EBA49',
    height: 40,
    // borderWidth: 1
  },
  landscapePasswordContainer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  portraitPasswordContainer: {
    flexDirection: "column",
    justifyContent: "flex-start"
  },
  landscapePasswordWrapper: {
    width: "45%"
  },
  portraitPasswordWrapper: {
    width: "100%"
  }
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAuth: (authData, authMode) => dispatch(tryAuth(authData, authMode)),
    onAutoSignIn: () => dispatch(authAutoSignIn()),
    onSetLogin: () => dispatch(setLogin())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);
