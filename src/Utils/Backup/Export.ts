import { exists, unlink } from 'react-native-fs';
import { zip } from 'react-native-zip-archive';
import Share from 'react-native-share';

import strings from '@shared/Locales';

import { generateBackup } from './Generate';

async function exportBackup(): Promise<void> {
	const backupFolderPath = await generateBackup();
	const zipPath = `${backupFolderPath}/${strings.Function_Export_FileName}.zip`;

	const zipAlreadyExists = await exists(zipPath);

	if (zipAlreadyExists) {
		await unlink(zipPath);
	}

	const backupZipPath = await zip(backupFolderPath, zipPath);

	try {
		await Share.open({
			title: strings.Function_Share_SaveFileTitle,
			url: `file://${backupZipPath}`,
		});
	} finally {
		await unlink(`${backupFolderPath}`);
	}
}

export { exportBackup };
