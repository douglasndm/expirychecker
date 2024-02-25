import { createContext } from 'react';

import { defaultPreferences } from '@expirychecker/Services/Preferences';
import { IUserPreferences } from '@expirychecker/@types/userPreference';

const PreferencesContext = createContext({
	userPreferences: defaultPreferences,
	setUserPreferences: ({
		howManyDaysToBeNextToExpire,
		autoComplete,
		isPRO,
		appTheme,
		enableNotifications,
		disableAds,
		allowRemoteImages,
	}: IUserPreferences) => {},
});

export default PreferencesContext;
