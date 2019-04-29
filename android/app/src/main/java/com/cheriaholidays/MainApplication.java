package com.cheriaholidays;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.reactnativenavigation.NavigationApplication;

// import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.imagepicker.ImagePickerPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;

import com.reactlibrary.RNSimpleCompassPackage; // kompas
import com.showlocationservicesdialogbox.LocationServicesDialogBoxPackage; //aktifin gps

import cl.json.RNSharePackage; // share
import cl.json.ShareApplication; // share

import com.zmxv.RNSound.RNSoundPackage; //sound



import com.pilloxa.backgroundjob.BackgroundJobPackage; // react-native-background-job

public class MainApplication extends NavigationApplication implements ShareApplication {

    @Override //share
    public String getFileProviderAuthority() {
        // return BuildConfig.APPLICATION_ID + ".provider";
        return "com.cheriaholidays.provider";
    }

//     @Override //a
//   public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
//       CalendarEventsPackage.onRequestPermissionsResult(requestCode, permissions, grantResults);
//       super.onRequestPermissionsResult(requestCode, permissions, grantResults);
//   }

    @Override
    public boolean isDebug() {
        // Make sure you are using BuildConfig from your own application
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                // eg. new VectorIconsPackage()
                new VectorIconsPackage(), new ImagePickerPackage(),
                // new ReactNativePushNotificationPackage(),
                new RNFirebasePackage(), new RNFirebaseNotificationsPackage(), new RNFirebaseMessagingPackage(),
                new RNSimpleCompassPackage(), // kompas
                new LocationServicesDialogBoxPackage(), // aktifin gps
                new RNSharePackage(), // share
                new RNSoundPackage(), //sound
                new BackgroundJobPackage() //background task
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }

    @Override
    public String getJSMainModuleName() {
        return "index";
    }

}

// import android.app.Application;

// import com.facebook.react.ReactApplication;
// import com.facebook.react.ReactNativeHost;
// import com.facebook.react.ReactPackage;
// import com.facebook.react.shell.MainReactPackage;
// import com.facebook.soloader.SoLoader;

// import java.util.Arrays;
// import java.util.List;

// public class MainApplication extends Application implements ReactApplication
// {

// private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
// @Override
// public boolean getUseDeveloperSupport() {
// return BuildConfig.DEBUG;
// }

// @Override
// protected List<ReactPackage> getPackages() {
// return Arrays.<ReactPackage>asList(
// new MainReactPackage()
// );
// }

// @Override
// protected String getJSMainModuleName() {
// return "index";
// }
// };

// @Override
// public ReactNativeHost getReactNativeHost() {
// return mReactNativeHost;
// }

// @Override
// public void onCreate() {
// super.onCreate();
// SoLoader.init(this, /* native exopackage */ false);
// }
// }
