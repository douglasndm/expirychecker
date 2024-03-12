import { getThemeByName } from '@shared/Themes';
import { getAppTheme } from '@utils/Themes';

import { getAllowRemoteImages } from '@utils/Settings/ProductImage';
import { IUserPreferences } from '../@types/userPreference';

import {
	getEnableProVersion,
	getHowManyDaysToBeNextExp,
	getDisableAds,
	getAutoComplete,
} from './Settings';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
	const settingDay = await getHowManyDaysToBeNextExp();
	const settingAutoComplete = await getAutoComplete();
	const settingProMode = await getEnableProVersion();
	const disableAds = await getDisableAds();
	const settingTheme = await getAppTheme(false, settingProMode);
	const settingImages = await getAllowRemoteImages();

	const settings: IUserPreferences = {
		howManyDaysToBeNextToExpire: settingDay,
		autoComplete: settingAutoComplete,
		appTheme: getThemeByName(settingTheme),
		isPRO: settingProMode,
		disableAds: disableAds || settingProMode,
		allowRemoteImages: settingImages,
	};

	return settings;
}
