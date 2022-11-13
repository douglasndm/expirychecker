import React, { useCallback, useEffect, useMemo } from 'react';
import { View, Platform } from 'react-native';
import EnvConfig from 'react-native-config';
import remoteConfig from '@react-native-firebase/remote-config';
import {
    AppOpenAd,
    TestIds,
    AdEventType,
} from 'react-native-google-mobile-ads';

import { getAllUserPreferences } from '~/Functions/UserPreferences';

const AppOpen: React.FC = () => {
    const adUnitId = useMemo(() => {
        if (__DEV__) {
            return TestIds.APP_OPEN;
        }
        if (Platform.OS === 'android') {
            return EnvConfig.ANDROID_ADMOB_ADUNITID_APP_START;
        }
        if (Platform.OS === 'ios') {
            return EnvConfig.IOS_ADMOB_ADUNITID_APP_START;
        }

        return '';
    }, []);

    const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
        keywords: ['store', 'stores', 'business', 'productivity', 'tools'],
    });

    appOpenAd.onAdEvent(event => {
        if (event === AdEventType.LOADED) {
            appOpenAd.show();
        }
    });

    const loadData = useCallback(async () => {
        const userPreferences = await getAllUserPreferences();

        const enable_ad_on_app_start = remoteConfig().getValue(
            'enable_ad_on_app_start'
        );

        if (!userPreferences.isPRO) {
            if (enable_ad_on_app_start.asBoolean() === true) {
                appOpenAd.load();
            }
        }
    }, [appOpenAd]);

    useEffect(() => {
        loadData();
    }, []);

    return <View />;
};

export default AppOpen;
