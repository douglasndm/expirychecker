import { createContext } from 'react';
import Themes from '@shared/Themes';

import { IUserPreferences } from '@expirychecker/@types/userPreference';

const PreferencesContext = createContext({
	userPreferences: {
		howManyDaysToBeNextToExpire: 30,
		autoComplete: false,
		isPRO: false,
		appTheme: Themes.Light,
		multiplesStores: false,
		storesFirstPage: false,
		enableNotifications: true,
		disableAds: false,
	},
	setUserPreferences: ({
		howManyDaysToBeNextToExpire,
		autoComplete,
		isPRO,
		appTheme,
		multiplesStores,
		storesFirstPage,
		enableNotifications,
		disableAds,
	}: IUserPreferences) => {},
});

export default PreferencesContext;
