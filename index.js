/**
 * @format
 */

import { AppRegistry, Linking } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { showMessage } from 'react-native-flash-message';
import Sentry from '@expirychecker/Services/Sentry';

import '@shared/Services/Notifications';
import { handleSetNotification } from '@expirychecker/Services/BackgroundJobs';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
	handleSetNotification();
	console.log('Message handled in the background!', remoteMessage);
});

messaging().onNotificationOpenedApp(async remoteMessage => {
	if (remoteMessage.data.deeplinking) {
		await Linking.openURL(remoteMessage.data.deeplinking);
	} else if (remoteMessage.data.url) {
		await Linking.openURL(remoteMessage.data.url);
	}
});

messaging().onMessage(async remoteMessage => {
	async function onOpen() {
		if (remoteMessage.data.deeplinking) {
			await Linking.openURL(remoteMessage.data.deeplinking);
		} else if (remoteMessage.data.url) {
			await Linking.openURL(remoteMessage.data.url);
		}
	}

	showMessage({
		message: remoteMessage.notification.title,
		description: remoteMessage.notification.body,
		onPress: onOpen,
	});
});

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
