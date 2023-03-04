import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUnixTime, fromUnixTime, addHours, addMinutes } from 'date-fns';

async function setTimeForNextNotification(): Promise<void> {
	const date = __DEV__
		? addMinutes(new Date(), 15)
		: addHours(new Date(), 12);

	const timestamp = getUnixTime(date);

	await AsyncStorage.setItem('timeForNextNotification', String(timestamp));
}

async function isTimeForANotification(): Promise<boolean> {
	const timestamp = await AsyncStorage.getItem('timeForNextNotification');

	if (timestamp) {
		console.log(`Time for next update => ${timestamp}`);
		const date = fromUnixTime(Number(timestamp));

		if (new Date() > date) {
			return true;
		}

		return false;
	}

	await setTimeForNextNotification();
	return false;
}

export { isTimeForANotification, setTimeForNextNotification };
