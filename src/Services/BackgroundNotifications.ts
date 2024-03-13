import messaging from '@react-native-firebase/messaging';

import { handleSetNotification } from '@expirychecker/Services/BackgroundJobs';

import { handlePurchase } from '@utils/Purchases/HandlePurchase';

messaging().setBackgroundMessageHandler(async remoteMessage => {
	handleSetNotification();
	console.log('Message handled in the background!', remoteMessage);

	const { paywall } = remoteMessage.data;

	await handlePurchase(String(paywall));
});
