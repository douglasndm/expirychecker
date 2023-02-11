import * as Sentry from '@sentry/react-native';
import codePush from 'react-native-code-push';
import EnvConfig from 'react-native-config';
import {
	getVersion,
	getSystemName,
	getBuildNumber,
} from 'react-native-device-info';

if (!__DEV__) {
	const configs: Sentry.ReactNativeOptions = {
		dsn: EnvConfig.SENTRY_DSN,
		// Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
		// We recommend adjusting this value in production.
		tracesSampleRate: 0.5,
		enabled: !__DEV__,
		attachScreenshot: true,
		beforeSend(event) {
			const message = event.message?.trim().toLowerCase();

			if (message?.includes('error performing request')) {
				return null;
			}

			return event;
		},
	};
	codePush.getUpdateMetadata().then(update => {
		if (update) {
			Sentry.init({
				...configs,
				release: `${getSystemName()}:${getVersion()} (${getBuildNumber()})+codepush:${
					update.label
				}`,
				dist: update.label,
			});
		} else {
			Sentry.init({
				...configs,
				release: `${getSystemName()}:${getVersion()} (${getBuildNumber()})}`,
			});
		}
	});
}

export default Sentry;
