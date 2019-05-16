import {
    SET_LOKASI, SET_LOKASIGOOGLE
} from "./actionTypes";
import {
    AsyncStorage, Alert
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

export const requestLokasiGoogle = (lat, lon) => {
    return dispatch => {
        dispatch(uiStartLoading())
        const promise = new Promise((resolve, reject) => {
            let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyD20cuaN2i3qXq_vq7EwD8mhrayjCAA_-w"
            fetch(
                url,
            ).catch(err => {
                console.log(err);
                dispatch(uiStopLoading());
                reject(`Tidak ada koneksi internet`);
                // throw err;
            })
                .then(res => res.json())
                .catch(err => {
                    console.log(err);
                    dispatch(uiStopLoading());
                    // reject()
                    reject(new Error(`Ooops`));
                })
                .then(parsedRes => {
                    console.log('requestLokasiGoogle: ', parsedRes);
                    dispatch(setLokasiGoogle(parsedRes))
                    dispatch(uiStopLoading());
                    resolve(parsedRes);
                    if (typeof (parsedRes) === "undefined") {
                        console.log('response undefined, ', parsedRes)
                    }
                    else {
                        const results = parsedRes.results;
                        for (var i = 0; i < results.length; i++) {
                            if (results[i].types[0] === "locality") {
                                AsyncStorage.setItem('ap:kota', results[i].address_components[0].short_name)
                                // console.log("ini ", (results[i].address_components[0].short_name).toLowerCase())
                            }
                            else if (results[i].types[0] === "administrative_area_level_2") {
                                AsyncStorage.setItem('ap:kota', results[i].address_components[0].short_name)
                            }
                        }
                    }
                    // this.setState({ dataUser: parsedRes, isLoading: false })
                })
                .catch(err => {
                    console.log(err);
                    dispatch(uiStopLoading());
                    reject(new Error(`Ooops`));
                    // reject(new Error(`Unable to retrieve events.\nInvalid response received - (${err}).`));
                });
        });
        return promise
        // .catch(error => {
        //     reject()
        // })
    };
};

export const setLokasiGoogle = lokasiGoogle => {
    return {
        type: SET_LOKASIGOOGLE,
        lokasiGoogle: lokasiGoogle
    };
};


export const fetchRequest = () => {
    return dispatch => {
        return new Promise(
            function (resolve, reject) {
                let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&key=AIzaSyD20cuaN2i3qXq_vq7EwD8mhrayjCAA_-w"
                fetch(url)
                    .then(
                        function (response) {
                            if (response.ok) {
                                let responseText = JSON.stringify(response.text());
                                console.log(responseText);
                            }
                            else {
                                reject(new Error(`Unable to retrieve events.\nInvalid response received - (${response.status}).`));
                            }
                        }
                    )
                    .catch(
                        function (error) {
                            reject(new Error(`Unable to retrieve events.\n${error.message}`));
                        }
                    );
            }
        );
    }
}