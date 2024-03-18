import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { handleSetNotification } from '@expirychecker/Services/BackgroundJobs';

messaging().setBackgroundMessageHandler(async remoteMessage => {
	handleSetNotification();
	console.log('Message handled in the background!', remoteMessage);

	const { paywall } = remoteMessage.data;

	if (paywall) {
		await AsyncStorage.setItem('requestedPaywall', paywall);
	}
});
