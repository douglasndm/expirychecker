import * as Sentry from '@sentry/react-native';
import codePush from 'react-native-code-push';
import EnvConfig from 'react-native-config';

if (!__DEV__) {
	const configs: Sentry.ReactNativeOptions = {
		dsn: EnvConfig.SENTRY_DSN,
		// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
		// We recommend adjusting this value in production.
		tracesSampleRate: 0.5,
		enabled: !__DEV__,
		attachScreenshot: true,
	};
	codePush.getUpdateMetadata().then(update => {
		if (update) {
			Sentry.init({
				...configs,
				release: `${update.appVersion}+codepush:${update.label}`,
				dist: update.label,
			});
		} else {
			Sentry.init(configs);
		}
	});
}

export default Sentry;
