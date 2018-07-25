/**
 * Created by mata on 6/1/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import TourList from "../../components/TourList/TourList";

import {
    View,
    Image,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions
} from "react-native";

class TourPackage extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);

    }

    state = {
        tours:{}
    }

    componentWillMount(){
        console.log('tour content: ',this.props.tourcontent)
        if(this.props.tourcontent != undefined){
            this.setState({tours: this.props.tourcontent})
        }else{
            let url = "https://travelfair.co/api/tour/";
            fetch(url)
                .catch(err => {
                    console.log(err);
                    alert("Error accessing travelfair.co");
                    //dispatch(uiStopLoading());
                })
                .then(res => res.json())
                .then(parsedRes => {
                    //dispatch(uiStopLoading());
                    console.log('data from travelfair: ',parsedRes);
                    this.setState({tours: parsedRes})
                });
        }
    }


    onNavigatorEvent = event => {
        //TODO buat onloads event

        //ini buat toogle side drawer
        if (event.type === "NavBarButtonPress") {
            if (event.id === "sideDrawerToggle") {
                this.props.navigator.toggleDrawer({
                    side: "left"
                });
            }
        }
    };

    itemSelectedHandler = key => {
        console.log('selected',key);
        console.log('this.props', this.props)


        this.props.navigator.push({
            screen: "cheria-holidays.TourDetail",
            title: "Detail Tour",
            passProps: {
                tourcontent: key
            }
        });


    };

    render() {
//        console.log('this props state:', this.state.tours)


        return (
            <View>
                <TourList
                    tours={this.state.tours}
                    onItemSelected={this.itemSelectedHandler}
                />
            </View>
        );
    }
}

export default connect(null, null)(TourPackage);


