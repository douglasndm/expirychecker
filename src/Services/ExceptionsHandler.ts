import * as Sentry from '@sentry/react-native';

function captureException(error: Error) {
	console.error(error);

	if (!__DEV__) {
		Sentry.captureException(error);
	}
}

export { captureException };
