import { AppRegistry } from 'react-native';
import * as Sentry from '@sentry/react-native';

import '@services/Sentry';

import '@expirychecker/Services/BackgroundNotifications';
import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

if (__DEV__) {
	require('@services/Reactotron');
}

const SentryProfiler = Sentry.withProfiler(App);

// Check if app was launched in the background and conditionally render null if so
// This is to prevent the app from rendering anything when launched in the background
// The app is launched in the background when the user receive a notification
function HeadlessCheck({ isHeadless }) {
	if (isHeadless) {
		console.log('App launched in the background');
		// App has been launched in the background by iOS, ignore
		return null;
	}

	console.log('App launched in the foreground');
	return <SentryProfiler />;
}

AppRegistry.registerComponent(appName, () => HeadlessCheck);
