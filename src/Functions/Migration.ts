import AsyncStorange from '@react-native-community/async-storage';
import {
    setAppTheme,
    setHowManyDaysToBeNextExp,
    setNotificationsEnabled,
    setEnableMultipleStoresMode,
} from './Settings';

import Realm from '../Services/Realm';

interface ISetting {
    name: string;
    value: string;
}

export async function migrateSettings(): Promise<void> {
    // #region
    const settingsFromRealm = Realm.objects<ISetting>('Setting').slice();

    const daysNextSetting = settingsFromRealm.find(
        (setting) => setting.name === 'daysToBeNext'
    );
    const appThemeSetting = settingsFromRealm.find(
        (setting) => setting.name === 'appTheme'
    );

    const isNotificationsEnabled = await AsyncStorange.getItem(
        '@ControleDeValidade/NotificationsEnabled'
    );

    const isMultiplesStoresEnabled = await AsyncStorange.getItem(
        '@ControleDeValidade/MultipleStores'
    );

    if (!daysNextSetting) {
        await setHowManyDaysToBeNextExp(30);
    } else {
        await setHowManyDaysToBeNextExp(Number(daysNextSetting.value));
    }

    if (!appThemeSetting) {
        await setAppTheme('system');
    } else {
        await setAppTheme(appThemeSetting.value);
    }

    if (!isNotificationsEnabled) {
        await setNotificationsEnabled(true);
    } else {
        await setNotificationsEnabled(Boolean(isNotificationsEnabled));
    }

    if (!isMultiplesStoresEnabled) {
        await setEnableMultipleStoresMode(false);
    } else {
        await setEnableMultipleStoresMode(Boolean(isMultiplesStoresEnabled));
    }
    // #endregion
}
