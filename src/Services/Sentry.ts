import * as Sentry from '@sentry/react-native';
import Config from 'react-native-config';

Sentry.init({
    dsn: Config.SENTRY_DSN,
    debug: __DEV__,
    enabled: !__DEV__,
});

export default Sentry;
