import React, { useEffect, useState } from 'react';
import { View, Button } from 'react-native';
import { addDays } from 'date-fns';
import Realm from '../../Services/Realm';

import { Modal } from 'react-native-paper';
import Camera from '../../Components/Camera';

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

    const [cameraEnabled, setCameraEnabled] = useState(false);

    useEffect(() => {

    }, [])

    return (
        <>
            <Modal
                visible={cameraEnabled}
                onDismiss={() => setCameraEnabled(false)}>
                <Camera />
            </Modal>

            <View>
                <Category>
                    <Button title="Disparar notificação" onPress={() => note()} />
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
                        title="Open camera"
                        onPress={() => {
                            setCameraEnabled(true);
                        }}
                    />
                </Category>
            </View>
        </>
    );
};

export default Test;
