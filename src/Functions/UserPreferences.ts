import { IUserPreferences } from '../@types/userPreference';
import { getThemeByName } from '../Themes';
import { getAllSettings } from './Settings';

export async function getUserPreferences(): Promise<IUserPreferences> {
    const settings = await getAllSettings();

    const daysSetting = settings.find(
        (setting) => setting.name === 'HowManyDaysToBeNextExp'
    );

    const themeSetting = settings.find(
        (setting) => setting.name === 'AppTheme'
    );

    const proModeSetting = settings.find(
        (setting) => setting.name === 'EnableProVersion'
    );

    const multipleStoresSetting = settings.find(
        (setting) => setting.name === 'EnableMultipleStores'
    );

    const enableNotificationsSetting = settings.find(
        (setting) => setting.name === 'EnableNotifications'
    );

    const daysToBeNext = daysSetting ? Number(daysSetting.value) : 30;
    const appTheme = themeSetting ? themeSetting.value : 'system';
    const isProMode = proModeSetting?.value === 'true';
    const multiplesStores = multipleStoresSetting?.value === 'true';
    const enableNotifications = enableNotificationsSetting?.value === 'true';

    const preferences: IUserPreferences = {
        howManyDaysToBeNextToExpire: daysToBeNext,
        appTheme: getThemeByName(appTheme),
        isUserPremium: isProMode,
        multiplesStores,
        enableNotifications,
    };

    return preferences;
}
