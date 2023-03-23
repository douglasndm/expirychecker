import AsyncStorage from '@react-native-async-storage/async-storage';

interface ISetSettingProps {
	type:
		| 'HowManyDaysToBeNextExp'
		| 'AutoComplete'
		| 'EnableNotifications'
		| 'EnableMultipleStores'
		| 'EnableStoresFirstPage'
		| 'EnableProVersion'
		| 'NotificationCadency'
		| 'HowManyTimesAppWasOpen'
		| 'DisableAds';
	value: string;
}

export async function setSetting({
	type,
	value,
}: ISetSettingProps): Promise<void> {
	await AsyncStorage.setItem(type, value);
}

export async function setHowManyDaysToBeNextExp(
	howManyDays: number
): Promise<void> {
	await setSetting({
		type: 'HowManyDaysToBeNextExp',
		value: String(howManyDays),
	});
}

export async function setAutoComplete(value: boolean): Promise<void> {
	await setSetting({
		type: 'AutoComplete',
		value: String(value),
	});
}

export async function setEnableMultipleStoresMode(
	enable: boolean
): Promise<void> {
	await setSetting({
		type: 'EnableMultipleStores',
		value: String(enable),
	});
}

export async function setEnableProVersion(enable: boolean): Promise<void> {
	await setSetting({
		type: 'EnableProVersion',
		value: String(enable),
	});
}

async function getSetting({
	type,
}: Omit<ISetSettingProps, 'value'>): Promise<string | undefined> {
	const setting = await AsyncStorage.getItem(type);

	if (!setting) {
		return undefined;
	}

	return setting;
}

export async function getHowManyDaysToBeNextExp(): Promise<number> {
	const setting = await getSetting({ type: 'HowManyDaysToBeNextExp' });

	if (!setting) {
		return 30;
	}

	return Number(setting);
}

export async function getAutoComplete(): Promise<boolean> {
	const setting = await getSetting({ type: 'AutoComplete' });

	if (setting === 'true') {
		return true;
	}
	return false;
}

export async function getEnableNotifications(): Promise<boolean> {
	const setting = await getSetting({ type: 'EnableNotifications' });

	if (setting === 'false') return false;
	return true;
}

export async function getEnableProVersion(): Promise<boolean> {
	if (__DEV__) {
		return true;
	}

	const setting = await getSetting({ type: 'EnableProVersion' });

	if (setting === 'true') {
		return true;
	}
	return false;
}

export async function getEnableMultipleStoresMode(): Promise<boolean> {
	const setting = await getSetting({ type: 'EnableMultipleStores' });

	if (await getEnableProVersion()) {
		if (setting === 'true') return true;
		return false;
	}

	return false;
}

export async function getHowManyTimesAppWasOpen(): Promise<number | null> {
	const setting = await getSetting({ type: 'HowManyTimesAppWasOpen' });

	if (setting) {
		return Number(setting);
	}

	return null;
}

export async function setDisableAds(disable: boolean): Promise<void> {
	await setSetting({
		type: 'DisableAds',
		value: String(disable),
	});
}

export async function getDisableAds(): Promise<boolean> {
	const openTimes = await getHowManyTimesAppWasOpen();

	if (openTimes && openTimes < 20) {
		return true;
	}

	const setting = await getSetting({
		type: 'DisableAds',
	});

	if (setting === 'true') return true;
	return false;
}

export async function setStoreFirstPage(enable: boolean): Promise<void> {
	await setSetting({
		type: 'EnableStoresFirstPage',
		value: String(enable),
	});
}

export async function getStoreFirstPage(): Promise<boolean> {
	const setting = await getSetting({
		type: 'EnableStoresFirstPage',
	});

	if (setting === 'true') return true;
	return false;
}
