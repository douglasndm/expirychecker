import React, { useEffect, useCallback } from 'react';
import { AdsConsent } from 'react-native-google-mobile-ads';

import { startGoogleMobileAdsSDK } from '@expirychecker/Services/Admob';

const AdsConsentComponent: React.FC = () => {
	const loadData = useCallback(async () => {
		try {
			const adsConsentUpdateInfo = await AdsConsent.requestInfoUpdate();

			if (adsConsentUpdateInfo.isConsentFormAvailable) {
				const adsConsentInfo =
					await AdsConsent.loadAndShowConsentFormIfRequired();

				if (adsConsentInfo.canRequestAds) {
					startGoogleMobileAdsSDK();
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				console.log(error);
			}
		}
	}, []);

	useEffect(() => {
		loadData();
	}, [loadData]);

	return <></>;
};

export default AdsConsentComponent;
