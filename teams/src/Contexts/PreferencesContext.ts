import { createContext } from 'react';

import { NotificationCadency } from '../Functions/Settings';
import Themes from '../Themes';

const PreferencesContext = createContext({
    userPreferences: {
        howManyDaysToBeNextToExpire: 30,
        appTheme: Themes.Light,
        enableNotifications: true,
        notificationCadency: NotificationCadency.Day,
        isUserSignedIn: false,
        selectedTeam: {
            role: '',
            team: {
                id: '',
                name: '',
            },
        },
    },
    setUserPreferences: ({
        howManyDaysToBeNextToExpire,
        appTheme,
        enableNotifications,
        notificationCadency,
        isUserSignedIn,
        selectedTeam,
    }: IUserPreferences) => {},
});

export default PreferencesContext;
