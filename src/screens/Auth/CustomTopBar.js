import React, { Component } from 'react';
import { connect } from "react-redux";
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Alert,
    Platform,
    Image
} from 'react-native';

class CustomTopBar extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={styles.container}>
                <Image style={{ height: 20, width: 130 }} source={require('../../assets/logohalalraveler.png')} resizeMode='contain' />
                {/* <TouchableOpacity stye={styles.button} onPress={() => Alert.alert(this.props.title, 'Thanks for that :)')}>
                    <Text style={styles.text}>Press Me</Text>
                </TouchableOpacity> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        alignSelf: 'center',
        backgroundColor: 'green'
    },
    text: {
        alignSelf: 'center',
        color: Platform.OS === 'ios' ? 'black' : 'white'
    }
});


export default connect(null, null)(CustomTopBar);