import Themes from '@shared/Themes';

import { IUserPreferences } from '../@types/userPreference';

const defaultPreferences: IUserPreferences = {
	howManyDaysToBeNextToExpire: 30,
	isPRO: false,
	appTheme: Themes.Light,
	disableAds: false,
	allowRemoteImages: true,
};

export { defaultPreferences };
