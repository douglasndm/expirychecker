import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

if (!__DEV__) {
    Sentry.init({
        dsn: Config.SENTRY_DSN,
    });
}

export default Sentry;
