import React, { Component } from "react";
import { View, Image, Button, StyleSheet, TouchableOpacity } from "react-native";
import ImagePicker from "react-native-image-picker";
import { TextMedium } from "../UI/TextCustom/TextCustom";

class PickImage extends Component {
  state = {
    pickedImage: null
  }

  reset = () => {
    this.setState({
      pickedImage: null
    });
  }

  pickImageHandler = () => {
    ImagePicker.showImagePicker({ title: "Pick an Image", maxWidth: 800, maxHeight: 600 }, res => {
      if (res.didCancel) {
        console.log("User cancelled!");
      } else if (res.error) {
        console.log("Error", res.error);
      } else {
        this.setState({
          pickedImage: { uri: res.uri }
        });
        this.props.onImagePicked({ uri: res.uri, base64: res.data });
      }
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.placeholder}>
          <Image source={this.state.pickedImage} style={styles.previewImage} />
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={this.pickImageHandler}>
            {/* <View style={styles.button}> */}
            <TextMedium style={{ color: '#2BB04C', fontSize: 14, width: '100%', textAlign: 'center' }}>Upload foto bukti pembayaran</TextMedium>
            {/* </View> */}
          </TouchableOpacity>
        </View>


        {/* <View style={styles.button}>
          <Button title="Upload bukti bayar" onPress={this.pickImageHandler} />
        </View> */}


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center"
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "black",
    // backgroundColor: "#eee",
    width: "80%",
    height: 150,
    borderRadius: 5
  },
  button: {
    marginTop: -45,
    width: 135,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 1,
    borderColor: '#757575',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'

  },
  previewImage: {
    width: "100%",
    height: "100%"
  }
});

export default PickImage;
