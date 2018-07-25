/**
 * Created by mata on 6/1/18.
 */

import React, { Component } from "react";
import { connect } from "react-redux";
import TourListCategory from "../../components/TourList/TourListCategory";
import Icon from "react-native-vector-icons/Ionicons";

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

class CategoryTourPackage extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
    }

    state = {
        tours:{}
    }

    componentWillMount(){
        let url = "https://travelfair.co/api/category/";
        fetch(url)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair.co");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
                alert("JSON error");
            })
            .then(parsedRes => {
                //dispatch(uiStopLoading());
                console.log('data category: ',parsedRes);
                this.setState({tours: parsedRes})
            });
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
        //console.log('this.props', this.props)

        if(key.cat_tours != undefined){
            this.props.navigator.push({
                screen: "cheria-holidays.TourPackage",
                title: key.name,
                passProps: {
                    tourcontent: key.cat_tours
                }
            });
        }else{
            this.props.navigator.push({
                screen: "cheria-holidays.TourPackage",
                title: key.name,
                passProps: {
                    tourcontent: key.reg_tours
                }
            });
        }




    };

    onKategoriPressed = () => {
        console.log('kategori')
        let url = "https://travelfair.co/api/category/";
        fetch(url)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair.co");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
                alert("JSON error");
            })
            .then(parsedRes => {
                //dispatch(uiStopLoading());
                console.log('data category: ',parsedRes);
                this.setState({tours: parsedRes})
            });
    }

    onRegionPressed = () => {
        console.log('region')
        let url = "https://travelfair.co/api/region/";
        fetch(url)
            .catch(err => {
                console.log(err);
                alert("Error accessing travelfair.co");
                //dispatch(uiStopLoading());
            })
            .then(res => res.json())
            .catch(err => {
                console.log(err);
                alert("JSON error");
            })
            .then(parsedRes => {
                //dispatch(uiStopLoading());
                console.log('data category: ',parsedRes);
                this.setState({tours: parsedRes})
            });
    }

    render() {
        return (
            <View>
                <View style={{flexDirection:'row', alignItems:'stretch', justifyContent:'center', padding:10}}>
                    <TouchableOpacity onPress={this.onKategoriPressed}>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            <Icon
                                name={Platform.OS === "android" ? "ios-checkmark-circle-outline" : "ios-checkmark-circle-outline"}
                                size={20}
                                color="black"
                            />
                            <Text style={{paddingLeft:10}}>Kategori</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.onRegionPressed}>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                            <Icon
                                name={Platform.OS === "android" ? "ios-checkmark-circle-outline" : "ios-checkmark-circle-outline"}
                                size={20}
                                color="black"
                                style = {{paddingLeft:40}}
                            />
                            <Text style={{paddingLeft:10}}>Region Area</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <TourListCategory
                    tours={this.state.tours}
                    onItemSelected={this.itemSelectedHandler}
                />
            </View>
        );
    }
}

export default connect(null, null)(CategoryTourPackage);


