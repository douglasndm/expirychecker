import Share from 'react-native-share';

import strings from '@expirychecker/Locales';

import { generateBackup } from '@expirychecker/Utils/Backup/Generate';

async function exportToTeams() {
	try {
		const path = await generateBackup();
		const filePath = `${path}/${strings.Function_Export_FileName}.cvbf`;

		await Share.open({
			title: strings.Function_Share_SaveFileTitle,
			url: `file://${filePath}`,
		});
	} catch (error) {
		if (error instanceof Error) {
			if (!error.message.includes('User did not share')) {
				throw error;
			}
		}
	}
}
export { exportToTeams };
