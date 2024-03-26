import { exists, unlink, DocumentDirectoryPath } from 'react-native-fs';
import Auth from '@react-native-firebase/auth';
import Firestore from '@react-native-firebase/firestore';

import realm from '@expirychecker/Services/Realm';
import api from '@shared/Services/API';

async function deleteAllProducts(): Promise<void> {
	realm.write(() => {
		realm.deleteAll();
	});

	const user = Auth().currentUser;

	if (user && user.email) {
		const usersCollection = Firestore().collection('users');
		const userDoc = usersCollection.doc(user.email);

		userDoc.delete();

		await api.delete(`/baseApp/allData`);
	}

	const backupDir = `${DocumentDirectoryPath}/backup`;
	const imagesDir = `${DocumentDirectoryPath}/images`;

	const backupDirExists = await exists(backupDir);
	const imagesDirExists = await exists(imagesDir);

	if (backupDirExists) {
		await unlink(backupDir);
	}
	if (imagesDirExists) {
		await unlink(imagesDir);
	}
}

export { deleteAllProducts };
