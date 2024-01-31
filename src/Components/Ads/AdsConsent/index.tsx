import React, { useEffect } from 'react';
import { AdsConsent } from 'react-native-google-mobile-ads';

import { startGoogleMobileAdsSDK } from '@expirychecker/Services/Admob';

const AdsConsentComponent: React.FC = () => {
	useEffect(() => {
		// Request an update for the consent information.
		AdsConsent.requestInfoUpdate().then(() => {
			AdsConsent.loadAndShowConsentFormIfRequired().then(
				adsConsentInfo => {
					// Consent has been gathered.
					if (adsConsentInfo.canRequestAds) {
						startGoogleMobileAdsSDK();
					}
				}
			);
		});
	}, []);

	return <></>;
};

export default AdsConsentComponent;
