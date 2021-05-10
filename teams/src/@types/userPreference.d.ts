import { DefaultTheme } from 'styled-components';

interface IUserPreferences {
    howManyDaysToBeNextToExpire: number;
    appTheme: DefaultTheme;
    enableNotifications: boolean;
    notificationCadency: NotificationCadency;
    user: IUser;
    selectedTeam: IUserRoles;
}
