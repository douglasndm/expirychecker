import { getThemeByName } from '@shared/Themes';
import { IUserPreferences } from '../@types/userPreference';

import {
	getEnableMultipleStoresMode,
	getEnableNotifications,
	getEnableProVersion,
	getHowManyDaysToBeNextExp,
	getDisableAds,
	getStoreFirstPage,
	getAutoComplete,
} from './Settings';
import { getAppTheme } from './Themes';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
	const settingDay = await getHowManyDaysToBeNextExp();
	const settingAutoComplete = await getAutoComplete();
	const settingTheme = await getAppTheme();
	const settingNotification = await getEnableNotifications();
	const settingMultipleStores = await getEnableMultipleStoresMode();
	const settingStoresFirstPage = await getStoreFirstPage();
	const settingProMode = await getEnableProVersion();
	const disableAds = await getDisableAds();

	const settings: IUserPreferences = {
		howManyDaysToBeNextToExpire: settingDay,
		autoComplete: settingAutoComplete,
		appTheme: getThemeByName(settingTheme),
		enableNotifications: settingNotification,
		isPRO: settingProMode,
		multiplesStores: settingMultipleStores,
		storesFirstPage: settingStoresFirstPage,
		disableAds: disableAds || settingProMode,
	};

	return settings;
}
