import { AppRegistry } from 'react-native';
import * as Sentry from "@sentry/react-native";

import '@services/Sentry';

import '@expirychecker/Services/BackgroundNotifications';
import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

if (__DEV__) {
    require("@services/Reactotron");
}

AppRegistry.registerComponent(appName, () => Sentry.wrap(App));
