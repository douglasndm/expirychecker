import { IUserPreferences } from '../@types/userPreference';
import { getThemeByName } from '../Themes';
import {
    getAppTheme,
    getEnableMultipleStoresMode,
    getEnableNotifications,
    getEnableProVersion,
    getHowManyDaysToBeNextExp,
} from './Settings';

export async function getAllUserPreferences(): Promise<IUserPreferences> {
    try {
        const settingDay = await getHowManyDaysToBeNextExp();
        const settingTheme = await getAppTheme();
        const settingNotification = await getEnableNotifications();
        const settingMultipleStores = await getEnableMultipleStoresMode();
        const settingProMode = await getEnableProVersion();

        const settings: IUserPreferences = {
            howManyDaysToBeNextToExpire: settingDay,
            appTheme: getThemeByName(settingTheme),
            enableNotifications: settingNotification,
            isUserPremium: settingProMode,
            multiplesStores: settingMultipleStores,
        };

        return settings;
    } catch (err) {
        throw new Error(err);
    }
}
