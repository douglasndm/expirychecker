import Crashlytics from '@react-native-firebase/crashlytics';

function captureException(error: Error) {
	console.error(error);

	if (!__DEV__) {
		Crashlytics().recordError(error);
	}
}

export { captureException };
