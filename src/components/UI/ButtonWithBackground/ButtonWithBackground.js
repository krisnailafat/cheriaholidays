import React from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  View,
  StyleSheet,
  Platform
} from "react-native";
import { TextNormal, TextBold, TextMedium, TextSemiBold } from '../TextCustom/TextCustom'

const buttonWithBackground = props => {
  const content = (
    <View
      style={[
        styles.button,
        { backgroundColor: props.color },
        props.disabled ? styles.disabled : null
      ]}
    >
      <TextMedium style={props.disabled ? styles.disabledText : { color: '#ffffff' }}>
        {props.children}
      </TextMedium>
    </View>
  );
  if (props.disabled) {
    return content;
  }
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback onPress={props.onPress}>
        {content}
      </TouchableNativeFeedback>
    );
  }
  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  button: {
    // padding: 10,
    // margin: 5,
    height: 40,
    width: '100%',
    borderRadius: 5,
    alignItems: "center",
    justifyContent: 'center'
  },
  disabled: {
    backgroundColor: "#eee",
    borderColor: "#aaa"
  },
  disabledText: {
    color: "#757575"
  }
});

export default buttonWithBackground;
