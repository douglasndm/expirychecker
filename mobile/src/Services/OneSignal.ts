import OneSignal from 'react-native-onesignal';
import Purchases from 'react-native-purchases';
import dotenv from 'react-native-config';

OneSignal.setLogLevel(6, 0);
OneSignal.setAppId(dotenv.ONESIGNAL_APP_ID);

async function OneSignalInit() {
    const user_id = (await OneSignal.getDeviceState()).userId;
    Purchases.setOnesignalID(user_id);
}

// Prompt for push on iOS
OneSignal.promptForPushNotificationsWithUserResponse(response => {
    console.log('Prompt response:', response);
});

// Method for handling notifications received while app in foreground
OneSignal.setNotificationWillShowInForegroundHandler(
    notificationReceivedEvent => {
        console.log(
            'OneSignal: notification will show in foreground:',
            notificationReceivedEvent
        );

        const notification = notificationReceivedEvent.getNotification();
        console.log('notification: ', notification);

        const data = notification.additionalData;
        console.log('additionalData: ', data);
        // Complete with null means don't show a notification.
        notificationReceivedEvent.complete(notification);
    }
);

// Method for handling notifications opened
OneSignal.setNotificationOpenedHandler(notification => {
    console.log('OneSignal: notification opened:', notification);
});

OneSignalInit();
