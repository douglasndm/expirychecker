import { getThemeByName } from '@shared/Themes';
import { getAppTheme } from '@utils/Themes';

import { getAllowRemoteImages } from '@utils/Settings/ProductImage';
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

export async function getAllUserPreferences(): Promise<IUserPreferences> {
	const settingDay = await getHowManyDaysToBeNextExp();
	const settingAutoComplete = await getAutoComplete();
	const settingNotification = await getEnableNotifications();
	const settingMultipleStores = await getEnableMultipleStoresMode();
	const settingStoresFirstPage = await getStoreFirstPage();
	const settingProMode = await getEnableProVersion();
	const disableAds = await getDisableAds();
	const settingTheme = await getAppTheme(false, settingProMode);
	const settingImages = await getAllowRemoteImages();

	const settings: IUserPreferences = {
		howManyDaysToBeNextToExpire: settingDay,
		autoComplete: settingAutoComplete,
		appTheme: getThemeByName(settingTheme),
		enableNotifications: settingNotification,
		isPRO: settingProMode,
		multiplesStores: settingMultipleStores,
		storesFirstPage: settingStoresFirstPage,
		disableAds: disableAds || settingProMode,
		allowRemoteImages: settingImages,
	};

	return settings;
}
