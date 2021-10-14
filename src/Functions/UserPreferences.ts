import { IUserPreferences } from '../@types/userPreference';
import { getThemeByName } from '../Themes';

import {
    getEnableMultipleStoresMode,
    getEnableNotifications,
    getNotificationCadency,
    getEnableProVersion,
    getHowManyDaysToBeNextExp,
    getDisableAds,
} from './Settings';
import { getAppTheme } from './Themes';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
    const settingDay = await getHowManyDaysToBeNextExp();
    const settingTheme = await getAppTheme();
    const settingNotification = await getEnableNotifications();
    const settingMultipleStores = await getEnableMultipleStoresMode();
    const settingNotificationCadency = await getNotificationCadency();
    const settingProMode = await getEnableProVersion();
    const disableAds = await getDisableAds();

    const settings: IUserPreferences = {
        howManyDaysToBeNextToExpire: settingDay,
        appTheme: getThemeByName(settingTheme),
        enableNotifications: settingNotification,
        notificationCadency: settingNotificationCadency,
        isUserPremium: settingProMode,
        multiplesStores: settingMultipleStores,
        disableAds: disableAds || settingProMode,
    };

    return settings;
}
