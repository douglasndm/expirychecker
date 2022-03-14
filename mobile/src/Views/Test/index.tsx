import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDays } from 'date-fns';
import messaging from '@react-native-firebase/messaging';
import OneSignal from 'react-native-onesignal';
import PushNotifications from 'react-native-push-notification';

import Realm from '../../Services/Realm';

import Button from '../../Components/Button';

import { Container, Category } from '../Settings/styles';
import {
    isTimeForANotification,
    setTimeForNextNotification,
} from '~/Functions/Notifications';

import { getNotificationForAllProductsCloseToExp } from '~/Functions/ProductsNotifications';
import { sendNotification } from '~/Services/Notifications';

const Test: React.FC = () => {
    async function sampleData() {
        const realm = await Realm();

        try {
            realm.write(() => {
                for (let i = 0; i < 50; i++) {
                    const lastProduct = realm
                        .objects<IProduct>('Product')
                        .sorted('id', true)[0];
                    const nextProductId =
                        lastProduct == null ? 1 : lastProduct.id + 1;

                    const lastLote = realm
                        .objects<ILote>('Lote')
                        .sorted('id', true)[0];
                    const nextLoteId = lastLote == null ? 1 : lastLote.id + 1;

                    realm.create('Product', {
                        id: nextProductId,
                        name: `Product ${i}`,
                        code: `${i}7841686${i}`,
                        lotes: [
                            {
                                id: nextLoteId,
                                lote: `ABC${i}xyz`,
                                exp_date: addDays(new Date(), 1 * i),
                                amount: i,
                                status: 'Não tratado',
                            },
                        ],
                    });
                }
            });
        } catch (err) {
            console.log(err);
        }
    }

    async function deleteProducts() {
        const realm = await Realm();
        try {
            realm.write(() => {
                realm.deleteAll();
            });
        } catch (err) {
            console.warn(err);
        }
    }

    const handleNotification = useCallback(async () => {
        await setTimeForNextNotification();

        const notification = await getNotificationForAllProductsCloseToExp();

        if (notification) {
            sendNotification(notification);
        }
    }, []);

    const tokens = useCallback(async () => {
        const messaing = await messaging().getToken();
        const oneSignal = await OneSignal.getDeviceState();

        console.log(`Firebase -> ${messaing}`);
        console.log(`One Signal -> ${oneSignal.userId}`);
    }, []);

    const handleDeletePrivacySetting = useCallback(async () => {
        await AsyncStorage.removeItem('Privacy/canUseIDFA');
    }, []);

    const handleRevokeNotifications = useCallback(async () => {}, []);

    return (
        <Container>
            <ScrollView>
                <Category>
                    <Button text="Load with sample data" onPress={sampleData} />

                    <Button
                        text="Delete all realm data"
                        onPress={deleteProducts}
                    />

                    <Button
                        text="Log is time to notificaiton"
                        onPress={() =>
                            isTimeForANotification().then(response =>
                                console.log(response)
                            )
                        }
                    />

                    <Button
                        text="Throw notification"
                        onPress={handleNotification}
                    />

                    <Button
                        text="Delete privacy setting"
                        onPress={handleDeletePrivacySetting}
                    />

                    <Button text="Log messaging id" onPress={tokens} />

                    <Button
                        text="Revoke notifications"
                        onPress={handleRevokeNotifications}
                    />
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Test;
