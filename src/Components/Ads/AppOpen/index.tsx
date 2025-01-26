import React, { useCallback, useEffect, useMemo } from 'react';
import { Platform } from 'react-native';
import EnvConfig from 'react-native-config';
import {
	AppOpenAd,
	TestIds,
	AdEventType,
} from 'react-native-google-mobile-ads';

import { getAllUserPreferences } from '@expirychecker/Functions/UserPreferences';

const AppOpen: React.FC = () => {
	const adUnitId = useMemo(() => {
		if (__DEV__) {
			return TestIds.APP_OPEN;
		}
		if (Platform.OS === 'android') {
			return EnvConfig.ANDROID_ADMOB_ADUNITID_APP_START || '';
		}
		if (Platform.OS === 'ios') {
			return EnvConfig.IOS_ADMOB_ADUNITID_APP_START || '';
		}

		return '';
	}, []);

	const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
		keywords: ['store', 'stores', 'business', 'productivity', 'tools'],
	});

	const loadData = useCallback(async () => {
		const userPreferences = await getAllUserPreferences();

		if (!userPreferences.isPRO && !userPreferences.disableAds) {
			appOpenAd.load();
		}
	}, [appOpenAd]);

	useEffect(() => {
		appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
			appOpenAd.show();
		});

		return appOpenAd.removeAllListeners();
	}, [appOpenAd]);

	useEffect(() => {
		loadData();
	}, []);

	return <></>;
};

export default AppOpen;
