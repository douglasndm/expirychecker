import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { saveNotification } from '@services/Notifications/SaveNotification';

import { handleSetNotification } from '@expirychecker/Services/BackgroundJobs';

messaging().setBackgroundMessageHandler(async remoteMessage => {
	handleSetNotification();
	console.log('Message handled in the background!', remoteMessage);

	if (remoteMessage.notification) {
		const { title, body } = remoteMessage.notification;

		await saveNotification({
			notificationId: remoteMessage.messageId,
			title: title || '',
			message: body || '',
			data: remoteMessage.data,
		});
	}

	if (remoteMessage.data) {
		const { paywall } = remoteMessage.data;

		if (paywall) {
			await AsyncStorage.setItem('requestedPaywall', String(paywall));
		}
	}
});
