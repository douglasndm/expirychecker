import Bugsnag from '@bugsnag/react-native';

function captureException(error: Error) {
	console.error(error);

	if (!__DEV__) {
		Bugsnag.notify(error);
	}
}

export { captureException };
