import { PurchasesPackage } from 'react-native-purchases';
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
