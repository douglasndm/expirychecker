import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';

import { captureException } from '@services/ExceptionsHandler';

interface Props {
	notificationTitle: string;
	notificationString: string;
}

async function saveNotificationStatus(props: Props): Promise<void> {
	try {
		const { notificationTitle, notificationString } = props;

		const { isConnected, isInternetReachable } = await NetInfo.fetch();
		if (isConnected === false || isInternetReachable === false) {
			console.log('No internet... Not saving notification status');
			return;
		}

		const user = auth().currentUser;

		if (!user) {
			await auth()
				.signInAnonymously()
				.catch(err => {
					throw new Error('Failed to sign in anonymously ' + err);
				});
		}

		const fcmToken = await messaging().getToken();

		const collection = firestore().collection('users');

		if (user && user.uid) {
			await collection.doc(user.uid).set({
				notificationTitle,
				notificationString,
				messagingToken: fcmToken,
				checked_at: firestore.FieldValue.serverTimestamp(),
			});
		}

		console.log('Notification status saved');
	} catch (error) {
		if (error instanceof Error) {
			captureException({
				error,
				customData: {
					currentUser: auth().currentUser,
				},
				showAlert: false,
			});
		}
	}
}

export { saveNotificationStatus };
