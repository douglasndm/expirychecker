import { DefaultTheme } from 'styled-components';

export interface IUserPreferences {
	howManyDaysToBeNextToExpire: number;
	autoComplete: boolean;
	isPRO: boolean;
	appTheme: DefaultTheme;
	multiplesStores: boolean;
	enableNotifications: boolean;
	disableAds: boolean;
	allowRemoteImages: boolean;
}
