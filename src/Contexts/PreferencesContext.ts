import { createContext } from 'react';

const PreferencesContext = createContext({
    howManyDaysToBeNextToExpire: 30,
    isUserPremium: false,
    appTheme: 'system',
});

export default PreferencesContext;
