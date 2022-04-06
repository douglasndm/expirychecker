import { createContext } from 'react';

import { NotificationCadency } from '../Functions/Settings';
import Themes from '../Themes';

const PreferencesContext = createContext({
    userPreferences: {
        howManyDaysToBeNextToExpire: 30,
        isUserPremium: false,
        appTheme: Themes.Light,
        multiplesStores: false,
        storesFirstPage: false,
        enableNotifications: true,
        notificationCadency: NotificationCadency.Day,
        disableAds: false,
    },
    setUserPreferences: ({
        howManyDaysToBeNextToExpire,
        isUserPremium,
        appTheme,
        multiplesStores,
        storesFirstPage,
        enableNotifications,
        notificationCadency,
        disableAds,
    }: IUserPreferences) => {},
});

export default PreferencesContext;
