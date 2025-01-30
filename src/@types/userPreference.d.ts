import { DefaultTheme } from 'styled-components';

export interface IUserPreferences {
	howManyDaysToBeNextToExpire: number;
	isPRO: boolean;
	appTheme: DefaultTheme;
	disableAds: boolean;
	allowRemoteImages: boolean;
}
