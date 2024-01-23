import admob, {
	MaxAdContentRating,
	AdsConsent,
	AdsConsentStatus,
	AdsConsentDebugGeography,
} from 'react-native-google-mobile-ads';

import { getEnableProVersion } from '../Functions/Settings';

async function prepareAds() {
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

		admob()
			.initialize()
			.then(async _ => {
				console.log('[AdMob] was initiated');

				const consentInfo = await AdsConsent.requestInfoUpdate({
					// debugGeography: AdsConsentDebugGeography.EEA,
				});

				if (
					consentInfo.isConsentFormAvailable &&
					consentInfo.status === AdsConsentStatus.REQUIRED
				) {
					await AdsConsent.showForm();
				}
			});
	}
}

prepareAds();
