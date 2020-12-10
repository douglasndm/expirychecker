import Purchases, { PurchasesOffering } from 'react-native-purchases';
import EnvConfig from 'react-native-config';

import { setEnableProVersion } from './Settings';

Purchases.setDebugLogsEnabled(true);
Purchases.setup(EnvConfig.REVENUECAT_PUBLIC_APP_ID);

export async function isSubscriptionActive(): Promise<boolean> {
    await Purchases.reset();
    try {
        const purchaserInfo = await Purchases.getPurchaserInfo();
        // access latest purchaserInfo

        console.log(purchaserInfo.activeSubscriptions);

        if (purchaserInfo.activeSubscriptions.length > 0) {
            await setEnableProVersion(true);
            return true;
        }
        await setEnableProVersion(false);
        return false;
    } catch (e) {
        throw new Error(e);
    }
}

export async function getSubscriptionDetails(): Promise<PurchasesOffering> {
    try {
        const offerings = await Purchases.getOfferings();

        if (
            offerings.current !== null &&
            offerings.current.availablePackages.length !== 0
        ) {
            return offerings.current;
        }
        throw new Error('We didt find any offers');
    } catch (err) {
        throw new Error(err);
    }
}

export async function makeSubscription(): Promise<void> {
    try {
        const offerings = await getSubscriptionDetails();
        const packageSub = offerings.availablePackages[0];

        const {
            purchaserInfo,
            productIdentifier,
        } = await Purchases.purchasePackage(packageSub);

        console.log(productIdentifier);
        console.log(purchaserInfo);
        if (
            typeof purchaserInfo.entitlements.active
                .my_entitlement_identifier !== 'undefined'
        ) {
            await setEnableProVersion(true);
        }
    } catch (e) {
        if (!e.userCancelled) {
            throw new Error(e);
        }
    }
}

// Chama a função para veirificar se usuário tem inscrição ativa (como o arquivo é importado
// na home ele verifica e já marca nas configurações a resposta)
isSubscriptionActive();
