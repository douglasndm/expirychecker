import { createContext } from 'react';
import { IUserPreferences } from '~/@types/userPreference';

import { NotificationCadency } from '../Functions/Settings';
import Themes from '../Themes';

const PreferencesContext = createContext({
    userPreferences: {
        howManyDaysToBeNextToExpire: 30,
        autoComplete: false,
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
        autoComplete,
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
