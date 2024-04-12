import { exists, unlink, DocumentDirectoryPath } from 'react-native-fs';

import realm from '@expirychecker/Services/Realm';

interface deleteAllDataProps {
	keepRealmData?: boolean;
	keepImages?: boolean;
}

async function deleteAllData({
	keepRealmData = false,
	keepImages = false,
}: deleteAllDataProps): Promise<void> {
	if (!keepRealmData) {
		realm.write(() => {
			realm.deleteAll();
		});
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
