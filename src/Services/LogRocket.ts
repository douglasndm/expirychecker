import LogRocket from '@logrocket/react-native';
import * as Sentry from '@sentry/react-native';

LogRocket.init('abivwn/expiry-checker');

LogRocket.getSessionURL(sessionURL => {
    Sentry.configureScope(scope => {
        scope.setExtra('sessionURL', sessionURL);
    });
});
