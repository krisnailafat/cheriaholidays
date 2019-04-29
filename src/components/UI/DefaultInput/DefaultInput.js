import React from "react";
import { TextInput, StyleSheet } from "react-native";

const defaultInput = props => (
  <TextInput
    underlineColorAndroid="transparent"
    // underlineColorAndroid="#3EBA49"
    {...props}
    style={[styles.input, props.style, !props.valid && props.touched ? styles.invalid : null]}
  />
);

const styles = StyleSheet.create({
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderColor: "#3EBA49",
    // padding: 5,
    // marginTop: 8,
    // marginBottom: 8
  },
  invalid: {
    // backgroundColor: '#f9c0c0',
    color:'#F7A286',
    borderBottomWidth:1,
    borderBottomColor:'#F7A286'
  }
});

export default defaultInput;
