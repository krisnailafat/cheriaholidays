import {

} from "./actionTypes";
import { uiStartLoading, uiStopLoading, authGetToken } from "./index";
import firebase from 'react-native-firebase';
import type { RemoteMessage, Notification, NotificationOpen } from 'react-native-firebase';

export const startAddPlace = () => {
    return {

    };
};

export const notificationPermission = () => {
    return dispatch => {
        console.log('ya')
    }
    // return async dispatch => {
    //     console.log('notificationPermission')
    //     const enabled = await firebase.messaging().hasPermission();
    //     console.log(enabled)
    //     if (enabled) {
    //         // user has permissions
    //         console.log(enabled, "ya")
    //     } else {
    //         // user doesn't have permission
    //         try {
    //             await firebase.messaging().requestPermission();
    //             // User has authorised
    //             console.log(enabled, "ya")
    //         } catch (error) {
    //             // User has rejected permissions
    //             alert('No permission for notification');
    //         }
    //     }

    // }
}

export const startNotification = () => {
    return async dispatch => {

        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // user has permissions
            console.log(enabled, "ya")
        } else {
            // user doesn't have permission
            try {
                await firebase.messaging().requestPermission();
                // User has authorised
                console.log(enabled, "ya")
            } catch (error) {
                // User has rejected permissions
                alert('No permission for notification');
            }
        }

        const notificationOpen: NotificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            // App was opened by a notification
            // Get the action triggered by the notification being opened
            const action = notificationOpen.action;
            // Get information about the notification that was opened
            const notification: Notification = notificationOpen.notification;
            if (notification.body !== undefined) {
                alert(notification.body);
            } else {
                var seen = [];
                alert(JSON.stringify(notification.data, function (key, val) {
                    if (val != null && typeof val == "object") {
                        if (seen.indexOf(val) >= 0) {
                            return;
                        }
                        seen.push(val);
                    }
                    return val;
                }));
            }
            firebase.notifications().removeDeliveredNotification(notification.notificationId);
        }

        const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
            .setDescription('My apps test channel');
        console.log(channel)
        // Create the channel
        firebase.notifications().android.createChannel(channel);

        const localNotification = new firebase.notifications.Notification({
            sound: 'default',
            // show_in_foreground: true,
            // show_in_background: true,
        })
            .setNotificationId('hh2')
            .setTitle('bb')
            .setSubtitle('cc')
            .setBody('dssd')
            .setData({
                type: 'start',
            })
            .android.setChannelId('test-channel') // e.g. the id you chose above
            .android.setSmallIcon('ic_launcher') // create this icon in Android Studio
            // .android.setColor(COLORS.RED) // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

        firebase.notifications()
            .displayNotification(localNotification);

        // Schedule the notification for 1 minute in the future
        // const date = new Date();
        // date.setSeconds(date.getSeconds() + 5);
        // console.log(date)

        // firebase.notifications()
        //     .scheduleNotification(localNotification, {
        //         fireDate: date.getTime(),
        //     })
        //     .catch(err => console.error(err));


        firebase.messaging().getToken().then(token => {
            console.log("TOKEN cheria", token);
            // this.setState({ token: token || "" })
        })
            .catch(err => console.error(err));
        ;

    };
};


// export const fetchMessages = () => {
//     return function (dispatch) {
//         dispatch(startFetchingMessages());

//         firebase.database()
//             .ref('messages')
//             .orderByKey()
//             .limitToLast(20)
//             .on('value', (snapshot) => {
//                 // gets around Redux panicking about actions in reducers
//                 setTimeout(() => {
//                     const messages = snapshot.val() || [];

//                     dispatch(receiveMessages(messages))
//                 }, 0);
//             });
//     }
// }