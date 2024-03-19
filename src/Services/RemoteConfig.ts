import remoteConfig from '@react-native-firebase/remote-config';
import NetInfo from '@react-native-community/netinfo';

import { captureException } from '@shared/Services/ExceptionsHandler';

async function init() {
	try {
		await remoteConfig().setDefaults({
			enable_app_bar: false,
			enable_app_bar_blur: false,

			enable_excel_import: false,
			enable_excel_export: true,

			enable_backup_import: true,
			enable_backup_export: true,

			enable_xml_export: true,

			enable_ad_on_app_start: false,

			enable_teams: false,
		});

		// if (__DEV__) {
		//     await remoteConfig().setConfigSettings({
		//         minimumFetchIntervalMillis: 5000,
		//     });
		// }

		const netInfo = await NetInfo.fetch();
		if (!netInfo.isInternetReachable) return;

		await remoteConfig().fetchAndActivate();
	} catch (err) {
		if (err instanceof Error) {
			captureException(err);
		}
	}
}

init();
