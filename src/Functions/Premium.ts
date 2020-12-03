import IAP, { Subscription, SubscriptionPurchase } from 'react-native-iap';

import { getAppTheme, setAppTheme, setEnableProVersion } from './Settings';

export async function IsPlayStoreIsAvailable(): Promise<boolean> {
    try {
        await IAP.initConnection();

        return true;
    } catch (err) {
        throw new Error(err);
    }
}

export async function CheckIfSubscriptionIsActive(): Promise<boolean> {
    try {
        const purchases = await IAP.getAvailablePurchases();

        if (purchases.length > 0) {
            await setEnableProVersion(true);
            return true;
        }

        // Se chegou aqui o usuário não é premium
        // aqui faz a verificação se ele está usando algum tema premium(se já foi premium) e remove ele
        const userTheme = await getAppTheme();
        if (
            userTheme !== 'system' &&
            userTheme !== 'dark' &&
            userTheme !== 'light'
        ) {
            await setAppTheme('system');
        }

        await setEnableProVersion(false);
        return false;
    } catch (err) {
        throw new Error(err);
    }
}

export async function GetSubscriptionInfo(): Promise<Array<Subscription>> {
    try {
        const subscriptions = await IAP.getSubscriptions([
            'controledevalidade_premium',
        ]);

        return subscriptions;
    } catch (err) {
        throw new Error(err);
    }
}

export async function MakeASubscription(): Promise<SubscriptionPurchase> {
    await GetSubscriptionInfo();

    try {
        const result = await IAP.requestSubscription(
            'controledevalidade_premium'
        );

        await setEnableProVersion(true);

        return result;
    } catch (err) {
        throw new Error(err);
    }
}
