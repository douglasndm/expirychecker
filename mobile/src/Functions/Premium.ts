import IAP, { Subscription, SubscriptionPurchase } from 'react-native-iap';

import Realm from '../Services/Realm';
import { getAppTheme, setAppTheme } from './Settings';

export async function IsPlayStoreIsAvailable(): Promise<boolean> {
    try {
        await IAP.initConnection();

        return true;
    } catch (err) {
        console.warn(err);
        return false;
    }
}

async function setPremium(active: boolean): Promise<void> {
    try {
        Realm.write(() => {
            Realm.create(
                'Setting',
                {
                    name: 'isPremium',
                    value: String(active),
                },
                true
            );
        });
    } catch (err) {
        console.warn(err);
    }
}

export async function GetPremium(): Promise<boolean> {
    try {
        const isPremium = Realm.objects('Setting').filtered(
            'name = "isPremium"'
        )[0];

        if (!isPremium) {
            return false;
        }

        if (isPremium.value === 'true') {
            return true;
        }

        return false;
    } catch (err) {
        console.warn(err);
    }

    return false;
}

export async function CheckIfSubscriptionIsActive(): Promise<boolean | null> {
    try {
        const purchases = await IAP.getAvailablePurchases();

        if (purchases.length > 0) {
            await setPremium(true);
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

        await setPremium(false);
        return false;
    } catch (err) {
        console.warn(err);
    }
    return null;
}

export async function GetSubscriptionInfo(): Promise<Array<
    Subscription
> | null> {
    try {
        const subscriptions = await IAP.getSubscriptions([
            'controledevalidade_premium',
        ]);

        return subscriptions;
    } catch (err) {
        console.warn(err);
    }

    return null;
}

export async function MakeASubscription(): Promise<SubscriptionPurchase | null> {
    await GetSubscriptionInfo();

    try {
        const result = await IAP.requestSubscription(
            'controledevalidade_premium'
        );

        await setPremium(true);

        return result;
    } catch (err) {
        console.warn(err);
    }

    return null;
}
