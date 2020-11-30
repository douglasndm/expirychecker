import AsyncStorange from '@react-native-community/async-storage';
import {
    setAppTheme,
    setHowManyDaysToBeNextExp,
    setNotificationsEnabled,
    setEnableMultipleStoresMode,
    setEnableProVersion,
} from './Settings';

import Realm from '../Services/Realm';

interface ISetting {
    name: string;
    value: string;
}

export async function migrateSettings(): Promise<void> {
    // #region
    const settingsFromRealm = Realm.objects<ISetting>('Setting').slice();

    console.log('Settings from realm now:');
    console.log(settingsFromRealm);

    const daysNextSetting = settingsFromRealm.find(
        (setting) => setting.name === 'daysToBeNext'
    );
    const appThemeSetting = settingsFromRealm.find(
        (setting) => setting.name === 'appTheme'
    );
    const userPremium = settingsFromRealm.find(
        (setting) => setting.name === 'isPremium'
    );

    const isNotificationsEnabled = await AsyncStorange.getItem(
        '@ControleDeValidade/NotificationsEnabled'
    );

    const isMultiplesStoresEnabled = await AsyncStorange.getItem(
        '@ControleDeValidade/MultipleStores'
    );

    console.log('settings from async storange');
    console.log(
        `notifications= ${isNotificationsEnabled} & multiples stores= ${isMultiplesStoresEnabled}`
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

    if (!userPremium) {
        await setEnableProVersion(false);
    } else if (userPremium.value === 'true') {
        await setEnableProVersion(true);
    } else {
        await setEnableProVersion(false);
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
