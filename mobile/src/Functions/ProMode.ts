import Purchases, { PurchasesPackage } from 'react-native-purchases';
import Analytics from '@react-native-firebase/analytics';
import EnvConfig from 'react-native-config';

import { getUserId } from './User';
import { setDisableAds, setEnableProVersion } from './Settings';

Purchases.setDebugLogsEnabled(true);
Purchases.setup(EnvConfig.REVENUECAT_PUBLIC_APP_ID);

export async function isSubscriptionActive(): Promise<boolean> {
    const localUserId = await getUserId();

    if (!!localUserId) {
        Purchases.logIn(localUserId);
    }

    const purchaserInfo = await Purchases.getPurchaserInfo();

    if (typeof purchaserInfo.entitlements.active.pro !== 'undefined') {
        await setEnableProVersion(true);
        return true;
    }
    if (typeof purchaserInfo.entitlements.active.noads !== 'undefined') {
        await setDisableAds(true);
    }
    await setEnableProVersion(false);
    return false;
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
): Promise<void> {
    if (!__DEV__) {
        await Analytics().logEvent('started_susbscription_process');
    }

    try {
        const {
            purchaserInfo,
            // productIdentifier,
        } = await Purchases.purchasePackage(purchasePackage);

        // console.log(productIdentifier);
        // console.log(purchaserInfo);
        if (typeof purchaserInfo.entitlements.active.pro !== 'undefined') {
            await Analytics().logEvent('user_subscribed_successfully');

            await setEnableProVersion(true);
        }

        if (typeof purchaserInfo.entitlements.active.noads !== 'undefined') {
            await setDisableAds(true);
        }
    } catch (e) {
        if (e.userCancelled) {
            await Analytics().logEvent('user_cancel_subscribe_process');
        }
        if (!e.userCancelled) {
            await Analytics().logEvent('error_in_subscribe_process');
            throw new Error(e);
        }
    }
}

export async function RestorePurchasers(): Promise<void> {
    const restore = await Purchases.restoreTransactions();
    // ... check restored purchaserInfo to see if entitlement is now active

    if (restore.activeSubscriptions.length > 0) {
        await setEnableProVersion(true);
    }
}

// Chama a função para verificar se usuário tem inscrição ativa (como o arquivo é importado
// na home ele verifica e já marca nas configurações a resposta)
isSubscriptionActive().then(() => console.log('Subscription checked'));
