import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

import { captureException } from '@services/ExceptionsHandler';

interface Props {
	notificationTitle: string;
	notificationString: string;
}

async function saveNotificationStatus(props: Props): Promise<void> {
	try {
		const { notificationTitle, notificationString } = props;

		const user = auth().currentUser;

		if (!user) {
			await auth()
				.signInAnonymously()
				.catch(err => {
					throw new Error('Failed to sign in anonymously ' + err);
				});
		}

		const fcmToken = await messaging().getToken();

		await firestore().collection('users').doc(user?.uid).set({
			notificationTitle,
			notificationString,
			messagingToken: fcmToken,
		});

		console.log('Notification status saved');
	} catch (error) {
		if (error instanceof Error) {
			captureException({ error, showAlert: false });
		}
	}
}

export { saveNotificationStatus };
