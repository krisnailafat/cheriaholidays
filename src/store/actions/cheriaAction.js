import {
    SET_LOGIN,
    SET_LOGGED,
    SET_PROFILE,
    SET_PEMBELIAN,
    RESET_POINT
} from "./actionTypes";
import {
    AsyncStorage,
} from "react-native";

import { uiStartLoading, uiStopLoading, authGetToken } from "./index";

export const profile = () => {
    return dispatch => {
        dispatch(uiStartLoading())
        const promise = new Promise((resolve, reject) => {
            let dataProfile
            AsyncStorage.multiGet(['ap:auth:profile'])
                .then((res) => {
                    dataProfile = JSON.parse(res[0][1])
                    console.log('auth users: ', dataProfile);
                    dispatch(setProfile(dataProfile))
                    dispatch(uiStopLoading());
                    resolve();
                }); //note this works asynchronously so, this may not be a good approach


            // let url2 = "https://travelfair.co/auth/users/me/";
            // let token;
            // AsyncStorage.getItem("ap:auth:token").then((value) => {
            //     token = value
            // })
            //     .then(res => {
            //         //console.log('this.state.tour_departure 2', this.state.tour_departure)
            //         //console.log('this.state.tour_departure 2', this.state.reservation_number)
            //         fetch(
            //             url2,
            //             {
            //                 method: "GET",
            //                 headers: {
            //                     "Content-Type": "application/json",
            //                     "Authorization": "Token " + token
            //                 },
            //                 //TODO masukin total_tagihan, phone,
            //             }
            //         ).catch(err => {
            //             console.log(err);
            //             // alert("Error accessing Halal Traveler");
            //             dispatch(uiStopLoading());
            //             reject()
            //         })
            //             .then(res => res.json())
            //             .catch(err => {
            //                 console.log(err);
            //                 // alert("JSON error");
            //                 dispatch(uiStopLoading())
            //                 reject()
            //             })
            //             .then(parsedRes => {
            //                 console.log('auth users: ', parsedRes);
            //                 dispatch(setProfile(parsedRes))
            //                 dispatch(uiStopLoading());
            //                 resolve();
            //                 // this.setState({ dataUser: parsedRes, isLoading: false })
            //             });
            //     })
            //     .catch(err => {
            //         console.log(err);
            //         alert(err);
            //         dispatch(uiStartLoading())
            //         reject()
            //     })

        });
        return promise
    };
};

export const setProfile = profile => {
    return {
        type: SET_PROFILE,
        profile: profile
    };
};

export const setLogin = () => {
    return {
        type: SET_LOGIN
    };
};

export const setLogged = () => {
    return {
        type: SET_LOGGED
    };
};

export const pembelian = () => {
    return dispatch => {
        dispatch(uiStartLoading())
        const promise = new Promise((resolve, reject) => {
            let dataPembelian
            AsyncStorage.multiGet(['ap:auth:pembelian'])
                .then((res) => {
                    dataPembelian = JSON.parse(res[0][1])
                    var point = 0;
                    for (i = 0; i < dataPembelian.length; i++) {
                        point = point + dataPembelian[i].tour_departure.tour.poin
                    }
                    console.log('dataPembelian= ', dataPembelian + ' point = ' + point);
                    dispatch(setPembelian(dataPembelian, point))
                    dispatch(uiStopLoading());
                    resolve(dataPembelian);
                });

            // let url2 = "https://travelfair.co/api/orderbyemail/";
            // let token;
            // let email;
            // AsyncStorage.getItem("ap:auth:email").then((value) => {
            //     email = value
            // })
            //     .then(res => {
            //         console.log('email ', email)
            //         fetch(
            //             url2 + email,
            //             {
            //                 method: "GET",
            //                 headers: {
            //                     "Content-Type": "application/json",
            //                     // "Authorization": "Token " + token
            //                 },
            //                 //TODO masukin total_tagihan, phone,
            //             }
            //         ).catch(err => {
            //             console.log(err);
            //             alert("Error accessing Halal Traveler");
            //             dispatch(uiStopLoading());
            //             reject();
            //         })
            //             .then(res => res.json())
            //             .catch(err => {
            //                 console.log(err);
            //                 alert("JSON error");
            //                 dispatch(uiStartLoading())
            //                 reject();
            //             })
            //             .then(parsedRes => {
            //                 console.log('pembelian', parsedRes);
            //                 var point = 0;
            //                 for (i = 0; i < parsedRes.length; i++) {
            //                     point = point + parsedRes[i].tour_departure.tour.poin
            //                 }
            //                 dispatch(setPembelian(parsedRes, point))
            //                 dispatch(uiStopLoading());
            //                 resolve(parsedRes);
            //                 // this.setState({ dataUser: parsedRes, isLoading: false })
            //             });
            //     })
            //     .catch(err => {
            //         console.log(err);
            //         alert(err);
            //         dispatch(uiStartLoading())
            //         reject();
            //     })
        });
        return promise


    };
};

export const setPembelian = (pembelian, point) => {
    return {
        type: SET_PEMBELIAN,
        pembelian: pembelian,
        point: point
    };
};

export const resetPoint = () => {
    return {
        type: RESET_POINT
    };
};

export const storageProfile = (token) => {
    return dispatch => {
        // dispatch(uiStartLoading())
        const promise = new Promise((resolve, reject) => {
            // console.log('storageProfile() called')
            let url = "https://travelfair.co/auth/users/me/";
            fetch(
                url,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + token
                    },
                    //TODO masukin total_tagihan, phone,
                }
            ).catch(err => {
                console.log(err);
                // alert("Error accessing Halal Traveler");
                // dispatch(uiStopLoading());
                reject("Error accessing profile")
            })
                .then(res => res.json())
                .catch(err => {
                    console.log(err);
                    // alert("JSON error");
                    // dispatch(uiStopLoading())
                    reject("Error accessing profile json")
                })
                .then(parsedRes => {
                    if (typeof (parsedRes) !== 'undefined') {
                        resolve('sukses profile')
                        AsyncStorage.setItem('ap:auth:profile', JSON.stringify(parsedRes))
                        // dispatch(uiStopLoading())
                        console.log('storageProfile() sukses')
                    }
                    else {
                        reject("profile undefined")
                        // dispatch(uiStopLoading())
                        console.log('storageProfile() gagal')
                    }
                })
                .catch(err => {
                    console.log(err);
                    // alert("JSON error");
                    // dispatch(uiStopLoading())
                    reject("Error accessing profile")
                })
        });
        return promise
    };
};

export const storagePembelian = (token, email) => {
    return dispatch => {
        // dispatch(uiStartLoading())
        const promise = new Promise((resolve, reject) => {
            // console.log('storageProfile() called')
            let url = "https://travelfair.co/api/orderbyemail/";
            fetch(
                url + email,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Token " + token
                    },
                    //TODO masukin total_tagihan, phone,
                }
            ).catch(err => {
                console.log(err);
                // alert("Error accessing Halal Traveler");
                // dispatch(uiStopLoading());
                reject("Error accessing pembelian")
            })
                .then(res => res.json())
                .catch(err => {
                    console.log(err);
                    // alert("JSON error");
                    // dispatch(uiStopLoading())
                    reject("Error accessing pembelian json")
                })
                .then(parsedRes => {
                    console.log('parsedRed pembelian = ', parsedRes)
                    if (typeof (parsedRes) !== 'undefined') {
                        resolve('sukses pembelian')
                        AsyncStorage.setItem('ap:auth:pembelian', JSON.stringify(parsedRes))
                        // dispatch(uiStopLoading())
                        console.log('storagePembelian() sukses')
                    }
                    else {
                        reject("pembelian undefined")
                        // dispatch(uiStopLoading())
                        console.log('storagePembelian() gagal')
                    }
                })
                .catch(err => {
                    console.log(err);
                    // alert("JSON error");
                    // dispatch(uiStopLoading())
                    reject("Error accessing pembelian")
                })
        });
        return promise
    };
};