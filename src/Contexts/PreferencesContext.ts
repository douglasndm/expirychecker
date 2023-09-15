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
		enableNotifications: true,
		disableAds: false,
		allowRemoteImages: true,
	},
	setUserPreferences: ({
		howManyDaysToBeNextToExpire,
		autoComplete,
		isPRO,
		appTheme,
		multiplesStores,
		enableNotifications,
		disableAds,
		allowRemoteImages,
	}: IUserPreferences) => {},
});

export default PreferencesContext;
