import AsyncStorange from '@react-native-community/async-storage';
import Realm from '../Services/Realm';

import { GetPremium } from './Premium';

export async function getDaysToBeNextToExp() {
    try {
        const days = await AsyncStorange.getItem('settings/daysToBeNext');

        if (days != null) return days;
    } catch (err) {
        console.tron(err);
    }

    return 30;
}

export async function getAppTheme() {
    try {
        const realm = await Realm();

        const appTheme = await realm
            .objects('Setting')
            .filtered("name = 'appTheme'")[0];

        if (!appTheme) {
            return 'system';
        }

        return appTheme.value;
    } catch (err) {
        console.log(err.message);
    }

    return 'system';
}

export async function setAppTheme(theme) {
    try {
        const realm = await Realm();

        realm.write(() => {
            realm.create(
                'Setting',
                {
                    name: 'appTheme',
                    value: theme.trim(),
                },
                true
            );
        });
    } catch (err) {
        console.log(err);
    }
}

export async function getAdsEnabled() {
    try {
        if (await GetPremium()) {
            return false;
        }

        const realm = await Realm();

        const adsEnabled = await realm
            .objects('Setting')
            .filtered("name = 'isAdsEnabled'")[0];

        if (!adsEnabled) {
            return false;
        }

        return adsEnabled.value === 'true';
    } catch (err) {
        console.log(err.message);
    }

    return false;
}

export async function setAdsEnabled(isEnabled) {
    try {
        const realm = await Realm();

        realm.write(() => {
            realm.create(
                'Setting',
                {
                    name: 'isAdsEnabled',
                    value: isEnabled ? 'true' : 'false',
                },
                true
            );
        });
    } catch (err) {
        console.warn(err);
    }
}
