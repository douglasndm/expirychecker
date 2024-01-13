import * as Sentry from '@sentry/react-native';
import EnvConfig from 'react-native-config';

if (!__DEV__) {
	Sentry.init({
		dsn: EnvConfig.SENTRY_DSN,
		attachScreenshot: true,
	});
}
