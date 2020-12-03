import AsyncStorange from '@react-native-community/async-storage';
import {
    setAppTheme,
    setHowManyDaysToBeNextExp,
    setEnableNotifications,
    setEnableMultipleStoresMode,
    setEnableProVersion,
} from './Settings';

import Realm from '../Services/Realm';
import { createProduct } from './Product';

interface ISetting {
    name: string;
    value: string;
}

export async function migrateSettings(): Promise<void> {
    // #region
    const settingsFromRealm = Realm.objects<ISetting>('Setting').slice();

    const daysNextSetting = settingsFromRealm.find(
        (setting) => setting.name === 'daysToBeNext'
    );
    const appThemeSetting = settingsFromRealm.find(
        (setting) => setting.name === 'appTheme'
    );
    const userPremium = settingsFromRealm.find(
        (setting) => setting.name === 'isPremium'
    );

    const isNotificationsEnabled = await AsyncStorange.getItem(
        '@ControleDeValidade/NotificationsEnabled'
    );

    const isMultiplesStoresEnabled = await AsyncStorange.getItem(
        '@ControleDeValidade/MultipleStores'
    );

    console.log('Settings from realm now:');
    console.log(settingsFromRealm);
    console.log('settings from async storange');
    console.log(
        `notifications= ${isNotificationsEnabled} & multiples stores= ${isMultiplesStoresEnabled}`
    );

    if (!daysNextSetting) {
        await setHowManyDaysToBeNextExp(30);
    } else {
        await setHowManyDaysToBeNextExp(Number(daysNextSetting.value));
    }

    if (!appThemeSetting) {
        await setAppTheme('system');
    } else {
        await setAppTheme(appThemeSetting.value);
    }

    if (!userPremium) {
        await setEnableProVersion(false);
    } else if (userPremium.value === 'true') {
        await setEnableProVersion(true);
    } else {
        await setEnableProVersion(false);
    }

    if (!isNotificationsEnabled) {
        await setEnableNotifications(true);
    } else {
        await setEnableNotifications(Boolean(isNotificationsEnabled));
    }

    if (!isMultiplesStoresEnabled) {
        await setEnableMultipleStoresMode(false);
    } else {
        await setEnableMultipleStoresMode(Boolean(isMultiplesStoresEnabled));
    }
    // #endregion
}

export async function migrateProducts(): Promise<void> {
    const productsFromRealm = Realm.objects<IProductRealm>('Product').slice();

    for (const product of productsFromRealm) { // eslint-disable-line


        const newProductFormat: IProduct = {
            name: product.name,
            code: product.code,
            store: product.store,

            batches: product.lotes.map((lote) => {
                const newBatchFormat: IBatch = {
                    name: lote.lote,
                    exp_date: lote.exp_date,
                    amount: lote.amount,
                    price: lote.price,
                    status:
                        lote.status === 'Tratado' ? 'Tratado' : 'Não tratado',
                };

                return newBatchFormat;
            }),
        };

        await createProduct(newProductFormat); // eslint-disable-line
    }
}
