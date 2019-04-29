import React from 'react';
import { AppRegistry, PushNotificationIOS } from 'react-native';
import { Provider } from 'react-redux';
import App from './App';
import configureStore from './src/store/configureStore';
// import { startNotification } from "./src/store/actions/index"

const store = configureStore();

const RNRedux = () => (
    <Provider store={store}>
        <App />
    </Provider>
);

AppRegistry.registerComponent('cheria', () => RNRedux);


// import { AppRegistry } from 'react-native';
// import App from './App';
// AppRegistry.registerComponent('cheriaholidays', () => App);
