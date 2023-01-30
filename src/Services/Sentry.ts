import * as Sentry from '@sentry/react-native';
import EnvConfig from 'react-native-config';

if (!__DEV__)
	Sentry.init({
		dsn: EnvConfig.SENTRY_DSN,
		// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
		// We recommend adjusting this value in production.
		tracesSampleRate: 0.5,
		enabled: !__DEV__,
		attachScreenshot: true,
	});

export default Sentry;
