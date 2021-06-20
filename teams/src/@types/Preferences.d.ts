interface IPreferences {
    howManyDaysToBeNextToExpire: number;
    appTheme: DefaultTheme;
    enableNotifications: boolean;
    notificationCadency: NotificationCadency;
    selectedTeam: IUserRoles | null;
}
