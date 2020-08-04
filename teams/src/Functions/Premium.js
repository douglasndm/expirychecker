import IAP from 'react-native-iap';
import Realm from '../Services/Realm';

async function setPremium(active) {
    try {
        const realm = await Realm();

        realm.write(() => {
            realm.create(
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

export async function GetPremium() {
    try {
        const realm = await Realm();

        const isPremium = await realm
            .objects('Setting')
            .filtered('name = "isPremium"')[0];

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

export async function CheckIfSubscriptionIsActive() {
    try {
        const purchases = await IAP.getAvailablePurchases();

        if (purchases.length > 0) {
            await setPremium(true);
            return true;
        }

        await setPremium(false);
        return false;
    } catch (err) {
        console.warn(err);
    }
    return null;
}

export async function GetSubscriptionInfo() {
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

export async function MakeASubscription() {
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

    return false;
}
