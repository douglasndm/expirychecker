import Bugsnag from '@bugsnag/react-native';
import { AppRegistry } from 'react-native';

import '@expirychecker/Services/BackgroundNotifications';
import { requestNotificationPermission } from '@services/Notifications/Permission';
import '@services/Notifications';
import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

Bugsnag.start();

requestNotificationPermission();

AppRegistry.registerComponent(appName, () => App);
