import AsyncStorage from '@react-native-async-storage/async-storage';

import { getMultiplesStoresForLegacyUsers } from './MultiplesStoresLegacyUsers';

interface ISetSettingProps {
    type:
        | 'HowManyDaysToBeNextExp'
        | 'EnableNotifications'
        | 'EnableMultipleStores'
        | 'EnableProVersion'
        | 'NotificationCadency'
        | 'HowManyTimesAppWasOpen';
    value: string;
}

export enum NotificationCadency {
    Hour = 'Hour',
    Day = 'Day',
    Week = 'Week',
    Month = 'Month',
    Never = 'Never',
}

export async function setSetting({
    type,
    value,
}: ISetSettingProps): Promise<void> {
    try {
        await AsyncStorage.setItem(type, value);
    } catch (err) {
        throw new Error(err);
    }
}

export async function setHowManyDaysToBeNextExp(
    howManyDays: number
): Promise<void> {
    await setSetting({
        type: 'HowManyDaysToBeNextExp',
        value: String(howManyDays),
    });
}

export async function setEnableNotifications(enable: boolean): Promise<void> {
    await setSetting({
        type: 'EnableNotifications',
        value: String(enable),
    });
}

export async function setNotificationCadency(
    cadency: NotificationCadency
): Promise<void> {
    await setSetting({
        type: 'NotificationCadency',
        value: cadency,
    });
}

export async function setEnableMultipleStoresMode(
    enable: boolean
): Promise<void> {
    await setSetting({
        type: 'EnableMultipleStores',
        value: String(enable),
    });
}

export async function setEnableProVersion(enable: boolean): Promise<void> {
    await setSetting({
        type: 'EnableProVersion',
        value: String(enable),
    });
}

async function getSetting({
    type,
}: Omit<ISetSettingProps, 'value'>): Promise<string | undefined> {
    try {
        const setting = await AsyncStorage.getItem(type);

        if (!setting) {
            return undefined;
        }

        return setting;
    } catch (err) {
        throw new Error(err);
    }
}

export async function getHowManyDaysToBeNextExp(): Promise<number> {
    const setting = await getSetting({ type: 'HowManyDaysToBeNextExp' });

    if (!setting) {
        return 30;
    }

    return Number(setting);
}

export async function getEnableNotifications(): Promise<boolean> {
    const setting = await getSetting({ type: 'EnableNotifications' });

    if (setting === 'false') return false;
    return true;
}

export async function getNotificationCadency(): Promise<NotificationCadency> {
    const setting = await getSetting({ type: 'NotificationCadency' });

    if (setting) {
        switch (setting) {
            case 'Month':
                return NotificationCadency.Month;
            case 'Week':
                return NotificationCadency.Week;
            case 'Day':
                return NotificationCadency.Day;
            case 'Hour':
                return NotificationCadency.Hour;
            case 'Never':
                return NotificationCadency.Never;
            default:
                return NotificationCadency.Day;
        }
    }
    return NotificationCadency.Day;
}

export async function getEnableProVersion(): Promise<boolean> {
    // if (__DEV__) {
    //     return true;
    // }
    const setting = await getSetting({ type: 'EnableProVersion' });

    if (setting === 'true') {
        return true;
    }
    return false;
}

export async function getEnableMultipleStoresMode(): Promise<boolean> {
    const setting = await getSetting({ type: 'EnableMultipleStores' });

    const legacyUser = await getMultiplesStoresForLegacyUsers();

    if (legacyUser) {
        if (setting === 'true') return true;
        return false;
    }

    if (await getEnableProVersion()) {
        if (setting === 'true') return true;
        return false;
    }

    return false;
}

export async function getHowManyTimesAppWasOpen(): Promise<number | null> {
    const setting = await getSetting({ type: 'HowManyTimesAppWasOpen' });

    if (setting) {
        return Number(setting);
    }

    return null;
}
