import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { addDays } from 'date-fns';
import BackgroundJob from 'react-native-background-job';

import { useTheme } from 'react-native-paper';

import Realm from '../../Services/Realm';

import Button from '../../Components/Button';

import { getAdsEnabled } from '../../Functions/Settings';

import * as Premium from '../../Functions/Premium';
import { ExportBackupFile, ImportBackupFile } from '../../Functions/Backup';
import { getAllProductsNextToExp } from '../../Functions/ProductsNotifications';
import { Category } from '../Settings/styles';

const Test = () => {
    const [adsEnable, setAdsEnable] = useState(false);

    useEffect(() => {
        async function getAppData() {
            if (await getAdsEnabled()) {
                setAdsEnable(true);
            } else {
                setAdsEnable(false);
            }
        }

        getAppData();
    }, []);

    function setBackgroundJob() {
        const backgroundSchedule = {
            jobKey: 'backgroundNotification',
        };

        BackgroundJob.schedule(backgroundSchedule)
            .then(() => console.log('Success'))
            .catch((err) => {
                if (__DEV__) {
                    console.warn(err);
                }
            });
    }

    function note() {
        getAllProductsNextToExp();
    }

    async function sampleData() {
        const realm = await Realm();

        try {
            realm.write(() => {
                for (let i = 0; i < 50; i++) {
                    const lastProduct = realm
                        .objects('Product')
                        .sorted('id', true)[0];
                    const nextProductId =
                        lastProduct == null ? 1 : lastProduct.id + 1;

                    const lastLote = realm
                        .objects('Lote')
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
        try {
            const realm = await Realm();

            realm.write(() => {
                const results = realm.objects('Product');

                realm.delete(results);
            });
        } catch (err) {
            console.warn(err);
        }
    }

    async function saveFile() {
        ExportBackupFile();
    }

    const theme = useTheme();

    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            <ScrollView>
                <Category
                    style={{ backgroundColor: theme.colors.productBackground }}
                >
                    <Text>Is ads enabled: {String(adsEnable)}</Text>

                    <Button
                        text="Check play store"
                        onPress={async () => {
                            console.log(await Premium.IsPlayStoreIsAvailable());
                        }}
                    />

                    <Button
                        text="Logar detalhes da inscrição"
                        onPress={async () => {
                            console.log(await Premium.GetSubscriptionInfo());
                        }}
                    />

                    <Button
                        text="Logar se usuário tem inscrição ativa"
                        onPress={async () => {
                            console.log(
                                await Premium.CheckIfSubscriptionIsActive()
                            );
                        }}
                    />

                    <Button
                        text="Solicitar compra"
                        onPress={async () => {
                            console.log(await Premium.MakeASubscription());
                        }}
                    />

                    <Button
                        text="Clica"
                        onPress={async () => {
                            console.log(await Premium.GetPremium());
                        }}
                    />

                    <Button
                        text="Disparar notificação"
                        onPress={() => note()}
                    />

                    <Button
                        text="Load with sample data"
                        onPress={() => sampleData()}
                    />

                    <Button
                        text="Delete all products"
                        onPress={() => {
                            deleteProducts();
                        }}
                    />

                    <Button
                        text="Background job"
                        onPress={() => setBackgroundJob()}
                    />

                    <Button
                        text="Import file"
                        onPress={() => {
                            ImportBackupFile();
                        }}
                    />

                    <Button
                        text="Export file"
                        onPress={() => {
                            saveFile();
                        }}
                    />
                </Category>
            </ScrollView>
        </View>
    );
};

export default Test;
