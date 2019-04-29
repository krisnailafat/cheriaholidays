import React, { Component } from 'react';
import {
    View, Text, StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    TouchableHighlight
} from 'react-native';
import { TextNormal, TextBold, TextMedium, TextSemiBold } from "../UI/TextCustom/TextCustom"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

class Card extends Component {
    anime = {
        height: new Animated.Value(),
        expanded: false,
        contentHeight: 0,
    }

    constructor(props) {
        super(props);

        this._initContentHeight = this._initContentHeight.bind(this);
        this.toggle = this.toggle.bind(this);

        this.anime.expanded = props.expanded;
    }

    _initContentHeight(evt) {
        if (this.anime.contentHeight > 0) return;
        this.anime.contentHeight = evt.nativeEvent.layout.height;
        this.anime.height.setValue(this.anime.expanded ? this._getMaxValue() : this._getMinValue());
    }

    _getMaxValue() { return this.anime.contentHeight };
    _getMinValue() { return 0 };

    toggle() {
        Animated.timing(this.anime.height, {
            toValue: this.anime.expanded ? this._getMinValue() : this._getMaxValue(),
            duration: 300,
        }).start();
        this.anime.expanded = !this.anime.expanded;
    }

    render() {
        return (
            <View {...this.props} style={styles.titleContainer}>
                <TouchableOpacity underlayColor="transparent" onPress={this.toggle}>
                    <View  {...this.props} style={styles.title}>
                        <TextMedium {...this.props} >{this.props.title}</TextMedium>
                        <MaterialIcons name='keyboard-arrow-down' size={30} color='#404040' />
                    </View>
                </TouchableOpacity>

                <Animated.View style={[styles.container, { height: this.anime.height }]} onLayout={this._initContentHeight}>
                    {this.props.children}
                </Animated.View>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        // margin: 10,
        overflow: 'hidden',
        // borderWidth: 1
    },
    title: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 40,
        // borderWidth: 1,
        // borderColor: 'green'
    },
    titleContainer: {
        // borderWidth: 1,
        // borderColor: 'red'
        // flexDirection: 'row'
        // borderWidth: 1
    },
    card: {
        padding: 10
    }
});

export default Card;