import { DefaultTheme } from 'styled-components';

export interface IUserPreferences {
    howManyDaysToBeNextToExpire: number;
    isUserPremium: boolean;
    appTheme: DefaultTheme;
    multiplesStores: boolean;
    storesFirstPage: boolean;
    enableNotifications: boolean;
    notificationCadency: NotificationCadency;
    disableAds: boolean;
}
