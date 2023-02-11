/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import Sentry from '@services/Sentry';
import '@services/Notifications';
import '@services/PushNotificationHandler';
import { handleSetNotification } from '@expirychecker/Services/BackgroundJobs';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

messaging().setBackgroundMessageHandler(async remoteMessage => {
	handleSetNotification();
	console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
