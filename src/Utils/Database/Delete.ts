import { exists, unlink, DocumentDirectoryPath } from 'react-native-fs';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';

import realm from '@expirychecker/Services/Realm';
import api from '@shared/Services/API';

interface deleteAllDataProps {
	keepRealmData?: boolean;
	keepFirestoreData?: boolean;
	keepImages?: boolean;
}

async function deleteAllData({
	keepRealmData = false,
	keepFirestoreData = false,
	keepImages = false,
}: deleteAllDataProps): Promise<void> {
	if (!keepRealmData) {
		realm.write(() => {
			realm.deleteAll();
		});
	}

	if (!keepFirestoreData) {
		const user = Auth().currentUser;

		if (user && user.email) {
			const usersCollection = Firestore().collection('users');
			const userDoc = usersCollection.doc(user.email);

			userDoc.delete();

			await api.delete(`/baseApp/allData`);
		}
	}

	if (!keepImages) {
		const imagesDir = `${DocumentDirectoryPath}/images`;

		const imagesDirExists = await exists(imagesDir);

		if (imagesDirExists) {
			await unlink(imagesDir);
		}
	}

	const backupDir = `${DocumentDirectoryPath}/backup`;
	const backupDirExists = await exists(backupDir);

	if (backupDirExists) {
		await unlink(backupDir);
	}
}

export { deleteAllData };
