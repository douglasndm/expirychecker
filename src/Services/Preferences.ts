import Themes from '@shared/Themes';

import { IUserPreferences } from '../@types/userPreference';

const defaultPreferences: IUserPreferences = {
	howManyDaysToBeNextToExpire: 30,
	autoComplete: false,
	isPRO: false,
	appTheme: Themes.Light,
	disableAds: false,
	allowRemoteImages: true,
};

export { defaultPreferences };
