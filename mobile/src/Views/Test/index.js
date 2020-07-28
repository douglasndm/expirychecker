import React from 'react';
import { View, Alert } from 'react-native';
import { addDays } from 'date-fns';
import BackgroundJob from 'react-native-background-job';
import RNShare from 'react-native-share';

import { useTheme } from 'react-native-paper';

import Realm from '../../Services/Realm';

import Button from '../../Components/Button';

import { getAllProductsNextToExp } from '../../Functions/ProductsNotifications';
import { Category } from '../Settings/styles';

const Test = () => {
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
            console.tron(err);
        }
    }

    async function saveFile() {
        RNShare.open({
            title: 'Esse é o titulo',
            message: 'Esta é a mensagem obrigatoria',
            filename: 'salvamento',
            saveToFiles: true,
        })
            .then(() => {
                console.log('Abriu');
            })
            .catch(() => {
                console.log('fechou');
            });
    }

    const theme = useTheme();

    return (
        <View style={{ backgroundColor: theme.colors.background, flex: 1 }}>
            <Category
                style={{ backgroundColor: theme.colors.productBackground }}
            >
                <Button text="Disparar notificação" onPress={() => note()} />

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

                <Button text="Import file" onPress={() => {}} />

                <Button
                    text="Export file"
                    onPress={() => {
                        saveFile();
                    }}
                />
            </Category>
        </View>
    );
};

export default Test;
