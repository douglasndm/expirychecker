import { createContext } from 'react';
import { DefaultTheme } from 'styled-components';
import Themes from '../Themes';

interface IUserPreferences {
    howManyDaysToBeNextToExpire: number;
    isUserPremium: boolean;
    appTheme: DefaultTheme;
    multiplesStores: boolean;
}

const PreferencesContext = createContext({
    userPreferences: {
        howManyDaysToBeNextToExpire: 30,
        isUserPremium: false,
        appTheme: Themes.Light,
        multiplesStores: false,
    },
    setUserPreferences: ({
        howManyDaysToBeNextToExpire,
        isUserPremium,
        appTheme,
        multiplesStores,
    }: IUserPreferences) => {},
});

export default PreferencesContext;
