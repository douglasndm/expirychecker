import { AppRegistry } from 'react-native';
import firestore from '@react-native-firebase/firestore';

import '@services/Bugsnag';
import '@expirychecker/Services/BackgroundNotifications';
import '@services/Notifications';
import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

firestore().disableNetwork();

AppRegistry.registerComponent(appName, () => App);
