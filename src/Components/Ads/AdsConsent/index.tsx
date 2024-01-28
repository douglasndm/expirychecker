import React from 'react';
import { View } from 'react-native';
import { AdsConsent } from 'react-native-google-mobile-ads';

import { startGoogleMobileAdsSDK } from '@expirychecker/Services/Admob';

// Request an update for the consent information.
AdsConsent.requestInfoUpdate().then(() => {
	AdsConsent.loadAndShowConsentFormIfRequired().then(adsConsentInfo => {
		// Consent has been gathered.
		if (adsConsentInfo.canRequestAds) {
			startGoogleMobileAdsSDK();
		}
	});
});

const AdsConsentComponent: React.FC = () => {
	return <View />;
};

export default AdsConsentComponent;
