import { exists, unlink, DocumentDirectoryPath } from 'react-native-fs';

import realm from '@expirychecker/Services/Realm';

async function deleteAllProducts(): Promise<void> {
	realm.write(() => {
		realm.deleteAll();
	});

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
