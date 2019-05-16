import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// BASE_FONT = 'YOUR_CUSTOM_FONTS_FAMILY';
export class TextNormal extends Component {
    render() {
        return (
            <Text {...this.props} style={[styles.normal, this.props.style]}>{this.props.children}</Text>
        )
    }
}
export class TextSemiBold extends Component {
    render() {
        return (
            <Text {...this.props} style={[styles.semiBold, this.props.style]}>{this.props.children}</Text>
        )
    }
}
export class TextBold extends Component {
    render() {
        return (
            <Text {...this.props} style={[styles.bold, this.props.style]}>{this.props.children}</Text>
        )
    }
}
export class TextMedium extends Component {
    render() {
        return (
            <Text {...this.props} style={[styles.medium, this.props.style]}>{this.props.children}</Text>
        )
    }
}
export class TextSedgwick extends Component {
    render() {
        return (
            <Text {...this.props} style={[styles.sedgwick, this.props.style]}>{this.props.children}</Text>
        )
    }
}
const styles = StyleSheet.create({
    normal: {
        fontFamily: 'EncodeSans-Regular',
        // fontSize: 16,
    },
    semiBold: {
        fontFamily: 'EncodeSans-SemiBold',
        // fontSize: 16,
    },
    bold: {
        fontFamily: 'EncodeSans-Bold',
        // fontSize: 16,
    },
    medium: {
        fontFamily: 'EncodeSans-Medium',
    },
    sedgwick: {
        fontFamily: 'SedgwickAveDisplay-Regular'
    }
});