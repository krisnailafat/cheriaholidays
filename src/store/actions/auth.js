import { AsyncStorage, Alert } from "react-native";

import { TRY_AUTH, AUTH_SET_TOKEN, AUTH_REMOVE_TOKEN } from "./actionTypes";
import { uiStartLoading, uiStopLoading, resetPoint } from "./index";
import startMainTabs from "../../screens/MainTabs/startMainTabs";
import { Navigation } from 'react-native-navigation';
import App from "../../../App";
import { storageProfile, storagePembelian } from "./cheriaAction";
import { startMainMenuInstalled } from "./mainMenu";

// const API_KEY = "AIzaSyDtxe0lf6OzfdqxAJyd_SUc1uQ-Y7BB194";
const API_KEY = "AIzaSyBInLZ8SvB_NcF5jHC390qsyB6DNrw4ENc";
export const tryAuth = (authData, authMode) => {
  return dispatch => {
    dispatch(uiStartLoading());
    let url = ''
    if (authMode === "signup") {
      const promise = new Promise((resolve, reject) => {
        //generate automatic random ref_code_user
        let random = Math.floor((Math.random() * 100) + 1)

        url = 'https://travelfair.co/auth/users/'
        fetch(url, {
          method: "POST",
          body: JSON.stringify({
            email: authData.email,
            password: authData.password,
            phone: authData.phone,
            referral_code: authData.referral_code,
            ref_code_user: authData.email.split('@', 1)[0].toUpperCase() + '_' + random,
            returnSecureToken: true
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .catch(err => {
            console.log(err);
            alert("Cek Koneksi Anda! Pastikan sudah tersambung internet");
            dispatch(uiStopLoading());
          })
          .then(res => res.json())
          .then(parsedRes => {
            dispatch(uiStopLoading());
            console.log('daftar result:', parsedRes);

            if (parsedRes.id != undefined) {

              url = 'https://travelfair.co/auth/token/login/';
              console.log('data', authData)
              fetch(url, {
                method: "POST",
                body: JSON.stringify({
                  // email: 'krisnaciheul@gmail.com',
                  // password: 'krisna123456',
                  email: authData.email,
                  password: authData.password,
                }),
                headers: {
                  "Content-Type": "application/json"
                }
              })
                .catch(err => {
                  console.log(err);
                  alert("Cek Koneksi Anda! Pastikan sudah tersambung internet");
                  reject();
                  dispatch(uiStopLoading());
                })
                .then(res => res.json())
                .then(parsedRes => {
                  console.log('login result:', parsedRes);
                  // dispatch(uiStopLoading());
                  dispatch(storageProfile())
                  Alert.alert(
                    'SUKSES',
                    'Terima Kasih telah menggunakan aplikasi Halal Traveler.\nSilahkan menikmati layanan yang ada!',
                    [
                      {
                        text: 'OK', onPress: () => {
                          AsyncStorage.setItem("ap:auth:email", authData.email);
                          AsyncStorage.setItem("ap:auth:password", authData.password);
                          AsyncStorage.setItem("ap:auth:token", parsedRes.auth_token)
                          AsyncStorage.setItem("ap:logged", 'true')
                          // Navigation.startSingleScreenApp({
                          //   screen: {
                          //     screen: "cheria-holidays.AuthScreen",
                          //     title: "Login"
                          //   }
                          // });
                          resolve()

                        }
                      },
                    ],
                    { cancelable: false }
                  )
                  dispatch(uiStopLoading());

                }).catch(err => {
                  console.log(err);
                  alert("Gagal terhubung dengan server, Coba kembali");
                  reject();
                  dispatch(uiStopLoading());
                });


              // Alert.alert(
              //   'SUKSES',
              //   'Terima Kasih telah menggunakan aplikasi Halal Traveler.\nSilahkan menikmati layanan yang ada!',
              //   [
              //     {
              //       text: 'OK', onPress: () => {
              //         AsyncStorage.setItem("ap:auth:email", authData.email);
              //         AsyncStorage.setItem("ap:auth:password", authData.password);
              //         AsyncStorage.setItem("ap:auth:token", parsedRes.auth_token)
              //         AsyncStorage.setItem("ap:logged", 'true')
              //         // Navigation.startSingleScreenApp({
              //         //   screen: {
              //         //     screen: "cheria-holidays.AuthScreen",
              //         //     title: "Login"
              //         //   }
              //         // });
              //         resolve()

              //       }
              //     },
              //   ],
              //   { cancelable: false }
              // )

            } else {
              let message = ''
              if (parsedRes.email != undefined) {
                message = ''
                for (i = 0; i < parsedRes.email.length; i++) {
                  message = message + '\n' + parsedRes.email[i]
                }
              } else {
                message = ''
                for (i = 0; i < parsedRes.password.length; i++) {
                  message = message + '\n' + parsedRes.password[i]
                }
              }
              Alert.alert('REGISTRASI GAGAL', message)
            }


          });
      })
      return promise
    } else {
      const promise = new Promise((resolve, reject) => {
        url = 'https://travelfair.co/auth/token/login/';
        console.log('data', authData)
        fetch(url, {
          method: "POST",
          body: JSON.stringify({
            // email: 'krisnaciheul@gmail.com',
            // password: 'krisna123456',
            email: authData.email,
            password: authData.password,
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .catch(err => {
            console.log(err);
            alert("Cek Koneksi Anda! Pastikan sudah tersambung internet");
            reject();
            dispatch(uiStopLoading());
          })
          .then(res => res.json())
          .then(parsedRes => {
            // dispatch(uiStopLoading());
            console.log('login result:', parsedRes);

            if (parsedRes.auth_token != undefined) {
              dispatch(storageProfile(parsedRes.auth_token))
              dispatch(storagePembelian(parsedRes.auth_token, authData.email))
              AsyncStorage.setItem("ap:auth:email", authData.email);
              AsyncStorage.setItem("ap:auth:password", authData.password);
              AsyncStorage.setItem("ap:auth:token", parsedRes.auth_token)
              AsyncStorage.setItem("ap:logged", 'true')
              // dispatch(a)
              // startMainTabs();
              resolve();
              dispatch(uiStopLoading());
            } else {
              Alert.alert("Username & Password yang Anda masukan salah")
              reject();
              dispatch(uiStopLoading());
            }


          }).catch(err => {
            console.log(err);
            alert("Gagal terhubung dengan server, Coba kembali");
            reject();
            dispatch(uiStopLoading());
          });
      });
      return promise

    }

  };
};

export const authStoreToken = (token, expiresIn, refreshToken) => {
  return dispatch => {
    const now = new Date();
    const expiryDate = now.getTime() + expiresIn * 1000;
    dispatch(authSetToken(token, expiryDate));
    AsyncStorage.setItem("ap:auth:token", token);
    AsyncStorage.setItem("ap:auth:expiryDate", expiryDate.toString());
    AsyncStorage.setItem("ap:auth:refreshToken", refreshToken);
  };
};

export const authSetToken = (token, expiryDate) => {
  return {
    type: AUTH_SET_TOKEN,
    token: token,
    // expiryDate: expiryDate
  };
};

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const token = getState().auth.token;
      const expiryDate = getState().auth.expiryDate;
      if (!token || new Date(expiryDate) <= new Date()) {
        let fetchedToken;
        AsyncStorage.getItem("ap:auth:token")
          .catch(err => reject())
          .then(tokenFromStorage => {
            fetchedToken = tokenFromStorage;
            if (!tokenFromStorage) {
              reject();
              return;
            }
            return AsyncStorage.getItem("ap:auth:expiryDate");
          })
          .then(expiryDate => {
            const parsedExpiryDate = new Date(parseInt(expiryDate));
            const now = new Date();
            if (parsedExpiryDate > now) {
              dispatch(authSetToken(fetchedToken));
              resolve(fetchedToken);
            } else {
              reject();
            }
          })
          .catch(err => reject());
      } else {
        resolve(token);
      }
    });
    return promise
      .catch(err => {
        return AsyncStorage.getItem("ap:auth:refreshToken")
          .then(refreshToken => {
            return fetch(
              "https://securetoken.googleapis.com/v1/token?key=" + API_KEY,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: "grant_type=refresh_token&refresh_token=" + refreshToken
              }
            );
          })
          .then(res => res.json())
          .then(parsedRes => {
            if (parsedRes.id_token) {
              console.log("Refresh token worked!");
              dispatch(
                authStoreToken(
                  parsedRes.id_token,
                  parsedRes.expires_in,
                  parsedRes.refresh_token
                )
              );
              return parsedRes.id_token;
            } else {
              dispatch(authClearStorage());
            }
          });
      })
      .then(token => {
        if (!token) {
          throw new Error();
        } else {
          return token;
        }
      });
  };
};

export const authAutoSignIn = () => {
  return dispatch => {
    dispatch(authGetToken())
      .then(token => {
        startMainTabs();
      })
      .catch(err => console.log("Failed to fetch token!"));
  };
};

export const authClearStorage = () => {
  return dispatch => {
    AsyncStorage.removeItem("ap:auth:email");
    AsyncStorage.removeItem("ap:auth:password");
    AsyncStorage.removeItem("ap:auth:token");
    AsyncStorage.removeItem("ap:auth:expiryDate");
    AsyncStorage.removeItem("ap:logged");
    // AsyncStorage.removeItem("ap:auth:refreshToken");
    return AsyncStorage.removeItem("ap:auth:refreshToken");
  };
};

export const authLogout = () => {
  return dispatch => {
    console.log('1')
    dispatch(resetPoint())
    dispatch(authClearStorage())
      .then(() => {
        // startMainTabs();
        // Navigation.startSingleScreenApp({
        //   screen: {
        //     screen: "cheria-holidays.OnBoarding",
        //     title: "Login"
        //   }
        // });
        dispatch(startMainMenuInstalled())
        //App();
      }).catch(err => console.log(err))
    console.log('2')
    dispatch(authRemoveToken());
  };
};

export const authRemoveToken = () => {
  return {
    type: AUTH_REMOVE_TOKEN
  };
};
