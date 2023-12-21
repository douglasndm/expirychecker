import {
	PurchasesPackage,
	UpgradeInfo,
	PurchasesError,
} from 'react-native-purchases';
import Analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';

import Purchases from '@services/RevenueCat';

import { getUserId } from './User';
import { setDisableAds, setEnableProVersion } from './Settings';

export async function isSubscriptionActive(): Promise<boolean> {
	const localUserId = await getUserId();

	const firebase = await messaging().getToken();

	if (!!localUserId) {
		Purchases.logIn(localUserId);
	}

	if (firebase) {
		Purchases.setAttributes({
			FirebaseMessasingToken: firebase,
		});
	}

	try {
		const purchaserInfo = await Purchases.getCustomerInfo();

		if (typeof purchaserInfo.entitlements.active.pro !== 'undefined') {
			await setEnableProVersion(true);
			return true;
		}
		if (typeof purchaserInfo.entitlements.active.noads !== 'undefined') {
			await setDisableAds(true);
		} else {
			await setDisableAds(false);
		}
		await setEnableProVersion(false);
		return false;
	} catch (err) {
		return false;
	}
}

export async function getSubscriptionDetails(): Promise<
	Array<PurchasesPackage>
> {
	const offerings = await Purchases.getOfferings();

	const packages: Array<PurchasesPackage> = [];

	if (offerings.current && offerings.current.monthly !== null) {
		packages.push(offerings.current.monthly);
	}

	if (offerings.current && offerings.current.threeMonth !== null) {
		packages.push(offerings.current.threeMonth);
	}

	if (offerings.current && offerings.current.annual !== null) {
		packages.push(offerings.current.annual);
	}

	return packages;
}

export async function getOnlyNoAdsSubscriptions(): Promise<
	Array<PurchasesPackage>
> {
	const offerings = await Purchases.getOfferings();

	if (offerings.all.no_ads.availablePackages.length !== 0) {
		return offerings.all.no_ads.availablePackages;
	}

	return [];
}

export async function makeSubscription(
	purchasePackage: PurchasesPackage
): Promise<boolean> {
	if (!__DEV__) {
		Analytics().logEvent('started_susbscription_process');
	}

	try {
		const prevPurchases = await Purchases.getCustomerInfo();

		const upgrade: UpgradeInfo | null =
			prevPurchases.activeSubscriptions.length > 0
				? {
						oldSKU: prevPurchases.activeSubscriptions[0],
				  }
				: null;

		const { customerInfo } = await Purchases.purchasePackage(
			purchasePackage,
			upgrade
		);

		if (typeof customerInfo.entitlements.active.noads !== 'undefined') {
			await setDisableAds(true);
		}
		if (typeof customerInfo.entitlements.active.pro !== 'undefined') {
			if (!__DEV__) {
				Analytics().logEvent('user_subscribed_successfully');
			}

			await setEnableProVersion(true);

			return true;
		}
	} catch (err) {
		if ((err as PurchasesError).userCancelled) {
			Analytics().logEvent('user_cancel_subscribe_process');
		} else if (err instanceof Error) {
			throw new Error(err.message);
		}
	}
	return false;
}

export async function RestorePurchasers(): Promise<void> {
	const restore = await Purchases.restorePurchases();
	// ... check restored purchaserInfo to see if entitlement is now active

	if (restore.activeSubscriptions.length > 0) {
		await setEnableProVersion(true);
	}
}

// Chama a função para verificar se usuário tem inscrição ativa (como o arquivo é importado
// na home ele verifica e já marca nas configurações a resposta)
isSubscriptionActive().then(() => console.log('Subscription checked'));
