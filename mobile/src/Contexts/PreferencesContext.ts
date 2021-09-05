import { createContext } from 'react';

import { NotificationCadency } from '../Functions/Settings';
import Themes from '../Themes';

const PreferencesContext = createContext({
    userPreferences: {
        howManyDaysToBeNextToExpire: 30,
        isUserPremium: false,
        appTheme: Themes.Light,
        multiplesStores: false,
        enableNotifications: true,
        notificationCadency: NotificationCadency.Day,
    },
    setUserPreferences: ({
        howManyDaysToBeNextToExpire,
        isUserPremium,
        appTheme,
        multiplesStores,
        enableNotifications,
        notificationCadency,
    }: IUserPreferences) => {},
});

export default PreferencesContext;
