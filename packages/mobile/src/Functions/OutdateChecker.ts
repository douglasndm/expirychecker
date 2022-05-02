import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBuildNumber } from 'react-native-device-info';
import { parseISO, addDays } from 'date-fns';

import api from '~/Services/API';

async function CheckCurrentVersion(): Promise<number> {
    interface responseProps {
        appPackage: string;
        latestAndroidVersion: number;
        latestIOSVersion: number;
    }

    const response = await api.get<responseProps[]>('/version');

    await AsyncStorage.setItem(
        'LastTimeUpdateCheck',
        JSON.stringify(new Date())
    );

    const data = response.data.find(
        version => version.appPackage === 'com.controledevalidade'
    );

    if (!data) {
        throw new Error('App package was not found in server version');
    }

    if (Platform.OS === 'ios') {
        await AsyncStorage.setItem(
            'LastServerVersion',
            JSON.stringify(data.latestIOSVersion)
        );

        return data.latestIOSVersion;
    }
    await AsyncStorage.setItem(
        'LastServerVersion',
        JSON.stringify(data.latestAndroidVersion)
    );
    return data.latestAndroidVersion;
}

async function isTimeToCheckUpdates(): Promise<boolean> {
    const lastTimeChecked = await AsyncStorage.getItem('LastTimeUpdateCheck');

    if (!lastTimeChecked) {
        return true;
    }

    const date = parseISO(JSON.parse(lastTimeChecked));

    if (addDays(date, 5) < new Date()) {
        return true;
    }

    return false;
}

async function isAppOutdated(): Promise<boolean> {
    const serverBuildVersion = await CheckCurrentVersion();
    const deviceBuild = Number(getBuildNumber());

    if (serverBuildVersion > 0) {
        if (serverBuildVersion > deviceBuild) {
            return true;
        }
    }

    return false;
}

async function lastServerVersion(): Promise<number> {
    const response = await AsyncStorage.getItem('LastServerVersion');

    if (response) {
        const build = Number(JSON.parse(response));

        return build;
    }

    return 0;
}

export { isTimeToCheckUpdates, isAppOutdated, lastServerVersion };
