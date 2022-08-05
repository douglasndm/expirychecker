import OneSignal from 'react-native-onesignal';
import Purchases from 'react-native-purchases';
import dotenv from 'react-native-config';

import Sentry from './Sentry';

OneSignal.setLogLevel(6, 0);
OneSignal.setAppId(dotenv.ONESIGNAL_APP_ID);

async function OneSignalInit() {
    try {
        OneSignal.addSubscriptionObserver(async event => {
            if (event.to.isSubscribed) {
                const deviceState = await OneSignal.getDeviceState();

                if (deviceState === null) return;

                Purchases.setOnesignalID(deviceState.userId);
            }
        });
    } catch (err) {
        Sentry.captureException(err);
    }
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
