import { DefaultTheme } from 'styled-components';

export interface IUserPreferences {
	howManyDaysToBeNextToExpire: number;
	autoComplete: boolean;
	isPRO: boolean;
	appTheme: DefaultTheme;
	disableAds: boolean;
	allowRemoteImages: boolean;
}
