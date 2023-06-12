/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import { requestNotificationPermission } from '@services/Notifications/Permission';
import '@services/Notifications';
import '@services/PushNotificationHandler';
import { handleSetNotification } from '@expirychecker/Services/BackgroundJobs';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

requestNotificationPermission();

messaging().setBackgroundMessageHandler(async remoteMessage => {
	handleSetNotification();
	console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
