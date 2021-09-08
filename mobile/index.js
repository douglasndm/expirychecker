/**
 * @format
 */

import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';

import Sentry from './src/Services/Sentry';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';
import { handleSetNotification } from '~/Services/BackgroundJobs';
import '~/Services/Notifications';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    handleSetNotification();
    console.log('Message handled in the background!', remoteMessage);
});

const SentryWrap = Sentry.wrap(App);

AppRegistry.registerComponent(appName, () => SentryWrap);
