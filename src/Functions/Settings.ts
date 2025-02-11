import AsyncStorage from '@react-native-async-storage/async-storage';

interface ISetSettingProps {
	type:
		| 'HowManyDaysToBeNextExp'
		| 'EnableProVersion'
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

export async function getEnableProVersion(): Promise<boolean> {
	if (__DEV__) {
		return false;
	}

	const setting = await getSetting({ type: 'EnableProVersion' });

	if (setting === 'true') {
		return true;
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
