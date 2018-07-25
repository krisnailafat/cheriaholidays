import React, { Component } from "react";

import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import { addPlace } from "../../store/actions/index";
import PlaceInput from "../../components/PlaceInput/PlaceInput";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import MainText from "../../components/UI/MainText/MainText";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import PickImage from "../../components/PickImage/PickImage";
import PickLocation from "../../components/PickLocation/PickLocation";
import validate from "../../utility/validation";
import { startAddPlace } from "../../store/actions/index";

class SharePlaceScreen extends Component {
  static navigatorStyle = {
    navBarButtonColor: "orange"
  };

  constructor(props) {
    super(props);
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  componentWillMount() {
    this.reset();
  }

  reset = () => {
    this.setState({
      controls: {
        placeName: {
          value: "",
          valid: false,
          touched: false,
          validationRules: {
            notEmpty: true
          }
        },

        image: {
          value: null,
          valid: false
        }
      }
    });
  };

  componentDidUpdate() {
    if (this.props.placeAdded) {
      this.props.navigator.switchToTab({ tabIndex: 0 });
      // this.props.onStartAddPlace();
    }
  }

  onNavigatorEvent = event => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
        this.props.onStartAddPlace();
      }
    }
    if (event.type === "NavBarButtonPress") {
      if (event.id === "sideDrawerToggle") {
        this.props.navigator.toggleDrawer({
          side: "left"
        });
      }
    }
  };

  placeNameChangedHandler = val => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          placeName: {
            ...prevState.controls.placeName,
            value: val,
            valid: validate(val, prevState.controls.placeName.validationRules),
            touched: true
          }
        }
      };
    });
  };

  locationPickedHandler = location => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          location: {
            value: location,
            valid: true
          }
        }
      };
    });
  };

  imagePickedHandler = image => {
    this.setState(prevState => {
      return {
        controls: {
          ...prevState.controls,
          image: {
            value: image,
            valid: true
          }
        }
      };
    });
  };

  placeAddedHandler = () => {
    fetch(
        "https://us-central1-cheria-halal-travel.cloudfunctions.net/storeImage",
        {
            method: "POST",
            body: JSON.stringify({
                image: image.base64
            }),
            headers: {
                Authorization: "Bearer " + authToken
            }
        }
    )
    .catch(err => {
      console.log(err);
      alert("Konfirmasi gagal, Silahkan ulangi lagi!");
    })
        .then(res => {
    if (res.ok) {
        return res.json();
    } else {
        throw new Error();
    }
        })
    /*
    this.props.onAddPlace(
      this.state.controls.placeName.value,
      this.state.controls.location.value,
      this.state.controls.image.value
    );
    this.reset();
    this.imagePicker.reset();
    this.locationPicker.reset();
    // this.props.navigator.switchToTab({tabIndex: 0});
    */
  };

  render() {
    let submitButton = (
      <Button
        title="Konfirmasi Pembayaran"
        onPress={this.placeAddedHandler}
        disabled={
          !this.state.controls.placeName.valid ||
          !this.state.controls.image.valid
        }
      />
    );

    if (this.props.isLoading) {
      submitButton = <ActivityIndicator />;
    }

    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{paddingVertical:10, flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
          <Text style={styles.confirmText}>Silahkan isi field di bawah ini untuk informasi konfirmasi pembayaran yang telah dilakukan </Text>
          </View>
          <View style={styles.inputContainer}>
            <PlaceInput
                placeData={this.state.controls.placeName}
                onChangeText={this.placeNameChangedHandler}
            />
            <DefaultInput
                placeholder="Tulis Nomor Hape Anda"
                onChangeText={()=>{}}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
            />
            <DefaultInput
                placeholder="Judul Paket Tour"
                onChangeText={()=>{}}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
            />
            <DefaultInput
                placeholder="Destinasi Tujuan"
                onChangeText={()=>{}}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
            />


          </View>

          <PickImage
            onImagePicked={this.imagePickedHandler}
            ref={ref => (this.imagePicker = ref)}
          />


          <View style={styles.button}>{submitButton}</View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding:10,
    flex: 1,
    alignItems: "center",
  },
    confirmText:{
        justifyContent:'center',
      fontSize:16,
        fontWeight:'bold',
    },
  placeholder: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#eee",
    width: "80%",
    height: 150
  },
  button: {
    margin: 8,
      paddingTop:10
  },
  previewImage: {
    width: "100%",
    height: "100%"
  },
    inputContainer: {
        width: "80%",
        paddingBottom:10
    },
});

const mapStateToProps = state => {
  return {
    isLoading: state.ui.isLoading,
    placeAdded: state.places.placeAdded
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onAddPlace: (placeName, location, image) =>
      dispatch(addPlace(placeName, location, image)),
    onStartAddPlace: () => dispatch(startAddPlace())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SharePlaceScreen);
