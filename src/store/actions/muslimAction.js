import {
    SET_LOKASI
} from "./actionTypes";
import {
    AsyncStorage,
} from "react-native";

import { uiStartLoading, uiStopLoading, authGetToken } from "./index";

export const requestLokasi = (lat, lon) => {
    return dispatch => {
        dispatch(uiStartLoading())
        const promise = new Promise((resolve, reject) => {
            fetch(
                'https://geocode.xyz/' + lat + ',' + lon + '?json=1',
                {
                    // method: "GET",
                    // headers: {
                    //     "Content-Type": "application/json",
                    //     "Authorization": "Token " + token
                    // },
                    //TODO masukin total_tagihan, phone,
                }
            ).catch(err => {
                console.log(err);
                alert("Error accessing Halal Traveler");
                dispatch(uiStopLoading());
                reject()
            })
                .then(res => res.json())
                .catch(err => {
                    console.log(err);
                    alert("JSON error");
                    dispatch(uiStopLoading());
                    reject()
                })
                .then(parsedRes => {
                    console.log('auth users: ', parsedRes);
                    dispatch(setLokasi(parsedRes))
                    dispatch(uiStopLoading());
                    resolve(parsedRes);
                    // this.setState({ dataUser: parsedRes, isLoading: false })
                });

        });
        return promise
    };
};

export const setLokasi = lokasi => {
    return {
        type: SET_LOKASI,
        lokasi: lokasi
    };
};

