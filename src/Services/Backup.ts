import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnixTime, fromUnixTime, addHours, addMinutes } from 'date-fns';

import strings from '@expirychecker/Locales';

import { uploadBackupFile } from '@services/Firebase/Storage';
import { captureException } from '@services/ExceptionsHandler';

import { generateBackup } from '@expirychecker/Utils/Backup/Generate';

async function handleBackup(): Promise<void> {
	const user = auth().currentUser;

	if (!user || !user.email) {
		console.log('User is not logged, not making backup');
		return;
	}

	const timestamp = await AsyncStorage.getItem('timeForBackup');

	if (timestamp) {
		console.log(`Time for next backup => ${timestamp}`);
		const date = fromUnixTime(Number(timestamp));

		if (new Date() < date) {
			console.log('It is not time to backup');
			// It's not time to backup
			return;
		}
	}

	try {
		const backup = await generateBackup();
		const path = `${backup}/${strings.Function_Export_FileName}.cvbf`;

		console.log('Making backup at Cloud');
		await uploadBackupFile(path);

		const nextBackupDate = __DEV__
			? addMinutes(new Date(), 15)
			: addHours(new Date(), 12);

		const nextTimestamp = getUnixTime(nextBackupDate);

		await AsyncStorage.setItem('timeForBackup', String(nextTimestamp));
	} catch (error) {
		if (error instanceof Error) {
			captureException({ error });
		}
	}
}

handleBackup();
