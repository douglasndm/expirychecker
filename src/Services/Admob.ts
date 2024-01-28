import admob, {
	MaxAdContentRating,
	AdsConsent,
} from 'react-native-google-mobile-ads';

import { getEnableProVersion } from '../Functions/Settings';

async function startGoogleMobileAdsSDK() {
	const disableAds = await getEnableProVersion();

	if (!disableAds) {
		admob().setRequestConfiguration({
			// Update all future requests suitable for parental guidance
			maxAdContentRating: MaxAdContentRating.PG,

			// Indicates that you want your content treated as child-directed for purposes of COPPA.
			tagForChildDirectedTreatment: false,

			// Indicates that you want the ad request to be handled in a
			// manner suitable for users under the age of consent.
			tagForUnderAgeOfConsent: true,

			// An array of test device IDs to allow.
			testDeviceIdentifiers: ['EMULATOR'],
		});

		// Check if you can initialize the Google Mobile Ads SDK in parallel
		// while checking for new consent information. Consent obtained in
		// the previous session can be used to request ads.
		// So you can start loading ads as soon as possible after your app launches.
		const { canRequestAds } = await AdsConsent.getConsentInfo();

		if (canRequestAds) {
			admob()
				.initialize()
				.then(async _ => {
					console.log('[AdMob] was initiated');
				});
		}
	}
}

startGoogleMobileAdsSDK();

export { startGoogleMobileAdsSDK };
