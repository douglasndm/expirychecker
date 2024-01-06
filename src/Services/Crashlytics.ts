import Crashlytics from '@react-native-firebase/crashlytics';
import Messaging from '@react-native-firebase/messaging';
import Installations from '@react-native-firebase/installations';
import Purchases from 'react-native-purchases';

import { getAllUserPreferences } from '@expirychecker/Functions/UserPreferences';

async function init(): Promise<void> {
	const purchaseId = await Purchases.getAppUserID();
	const firebaseInstallationId = await Installations().getId();
	const firebaseMessagingToken = await Messaging().getToken();
	const preferences = await getAllUserPreferences();

	await Crashlytics().setAttributes({
		purchaseId,
		firebaseInstallationId,
		firebaseMessagingToken,

		preferences: JSON.stringify(preferences),
	});
}

init();
