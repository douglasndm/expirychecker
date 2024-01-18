import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import Analytics from '@react-native-firebase/analytics';
import { showMessage } from 'react-native-flash-message';

import strings from '@expirychecker/Locales';

import { setEnableProVersion } from '@expirychecker/Functions/Settings';

async function handlePurchase(): Promise<boolean> {
	if (!__DEV__) {
		Analytics().logEvent('started_susbscription_process');
	}

	const paywallResult: PAYWALL_RESULT =
		await RevenueCatUI.presentPaywallIfNeeded({
			requiredEntitlementIdentifier: 'pro',
		});

	if (
		paywallResult === PAYWALL_RESULT.PURCHASED ||
		paywallResult === PAYWALL_RESULT.RESTORED
	) {
		if (paywallResult === PAYWALL_RESULT.PURCHASED) {
			showMessage({
				message: strings.View_Pro_Alert_Welcome,
				type: 'info',
			});

			if (!__DEV__) {
				Analytics().logEvent('user_subscribed_successfully');
			}
		} else if (paywallResult === PAYWALL_RESULT.RESTORED) {
			showMessage({
				message: strings.View_PROView_Subscription_Alert_RestoreSuccess,
				type: 'info',
			});
		}

		await setEnableProVersion(true);
		return true;
	}

	if (paywallResult === PAYWALL_RESULT.CANCELLED) {
		if (!__DEV__) {
			Analytics().logEvent('user_cancel_subscribe_process');
		}
	}

	return false;
}

export { handlePurchase };
