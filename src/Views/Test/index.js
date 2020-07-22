import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import { addDays } from 'date-fns';
import BackgroundFetch from 'react-native-background-fetch';
import Realm from '../../Services/Realm';

import { getAllProductsNextToExp } from '../../Functions/ProductsNotifications';
import { Category } from '../Settings/styles';

const Test = () => {
    function note() {
        getAllProductsNextToExp();
    }

    async function sampleData() {
        const realm = await Realm();

        try {
            realm.write(() => {
                for (let i = 0; i < 100; i++) {
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
            console.tron(err);
        }
    }

    return (
        <>
            <View>
                <Category>
                    <Button
                        title="Disparar notificação"
                        onPress={() => note()}
                    />
                </Category>

                <Category>
                    <Button
                        title="Load with sample data"
                        onPress={() => sampleData()}
                    />
                </Category>

                <Category>
                    <Button
                        title="Delete all products"
                        onPress={() => {
                            deleteProducts();
                        }}
                    />
                </Category>

                <Category>
                    <Button
                        title="Background job"
                        onPress={() => {
                            // Configure it.
                            BackgroundFetch.configure(
                                {
                                    minimumFetchInterval: 15, // <-- minutes (15 is minimum allowed)
                                    // Android options
                                    forceAlarmManager: true, // <-- Set true to bypass JobScheduler.
                                    stopOnTerminate: false,
                                    startOnBoot: true,
                                    requiredNetworkType:
                                        BackgroundFetch.NETWORK_TYPE_NONE, // Default
                                    requiresCharging: false, // Default
                                    requiresDeviceIdle: false, // Default
                                    requiresBatteryNotLow: false, // Default
                                    requiresStorageNotLow: false, // Default
                                },
                                async (taskId) => {
                                    getAllProductsNextToExp();
                                    console.log(
                                        '[js] Received background-fetch event: ',
                                        taskId
                                    );
                                    // Required: Signal completion of your task to native code
                                    // If you fail to do this, the OS can terminate your app
                                    // or assign battery-blame for consuming too much background-time
                                    BackgroundFetch.finish(taskId);
                                },
                                (error) => {
                                    console.log(
                                        '[js] RNBackgroundFetch failed to start'
                                    );
                                }
                            );

                            // Optional: Query the authorization status.
                            BackgroundFetch.status((status) => {
                                switch (status) {
                                    case BackgroundFetch.STATUS_RESTRICTED:
                                        console.log(
                                            'BackgroundFetch restricted'
                                        );
                                        break;
                                    case BackgroundFetch.STATUS_DENIED:
                                        console.log('BackgroundFetch denied');
                                        break;
                                    case BackgroundFetch.STATUS_AVAILABLE:
                                        console.log(
                                            'BackgroundFetch is enabled'
                                        );
                                        break;
                                }
                            });
                        }}
                    />
                </Category>
            </View>
        </>
    );
};

export default Test;
