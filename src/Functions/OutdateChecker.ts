import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBuildNumber } from 'react-native-device-info';
import { parseISO, addDays } from 'date-fns';

import api from '~/Services/API';

async function CheckCurrentVersion(): Promise<number> {
    interface responseProps {
        android_build_number: number;
        ios_build_number: number;
    }

    const response = await api.get<responseProps>('/latest_version');

    await AsyncStorage.setItem(
        'LastTimeUpdateCheck',
        JSON.stringify(new Date())
    );

    if (Platform.OS === 'ios') {
        await AsyncStorage.setItem(
            'LastServerVersion',
            JSON.stringify(response.data.ios_build_number)
        );

        return response.data.ios_build_number;
    }
    await AsyncStorage.setItem(
        'LastServerVersion',
        JSON.stringify(response.data.android_build_number)
    );
    return response.data.android_build_number;
}

async function isTimeToCheckUpdates(): Promise<boolean> {
    const lastTimeChecked = await AsyncStorage.getItem('LastTimeUpdateCheck');

    if (!lastTimeChecked) {
        return true;
    }

    const date = parseISO(JSON.parse(lastTimeChecked));

    if (addDays(date, 15) < new Date()) {
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
