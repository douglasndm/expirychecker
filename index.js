import { AppRegistry } from 'react-native';
import EnvConfig from 'react-native-config';
import * as Sentry from "@sentry/react-native";

import '@expirychecker/Services/BackgroundNotifications';
import '@services/PushNotificationHandler';

import { name as appName } from './app.json';
import App from './src';
import './src/Functions/OpenAppTimes';

if (!__DEV__) {
    Sentry.init({
        dsn: EnvConfig.SENTRY_DSN,

        // uncomment the line below to enable Spotlight (https://spotlightjs.com)
        enableSpotlight: __DEV__,
        // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
        // We recommend adjusting this value in production.
        tracesSampleRate: 1.0,
        _experiments: {
            // profilesSampleRate is relative to tracesSampleRate.
            // Here, we'll capture profiles for 100% of transactions.
            profilesSampleRate: 1.0,

            replaysSessionSampleRate: 1.0,
            replaysOnErrorSampleRate: 1.0,
        },
        integrations: [
            Sentry.mobileReplayIntegration(),
        ],
    });
}

AppRegistry.registerComponent(appName, () => App);
