import Bugsnag from '@bugsnag/react-native';

function captureException(error: Error) {
	console.error(error);

	Bugsnag.notify(error);
}

export { captureException };
