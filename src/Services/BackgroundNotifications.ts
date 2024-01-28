import messaging from '@react-native-firebase/messaging';
import { handleSetNotification } from '@expirychecker/Services/BackgroundJobs';

messaging().setBackgroundMessageHandler(async remoteMessage => {
	handleSetNotification();
	console.log('Message handled in the background!', remoteMessage);
});
