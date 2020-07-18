import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { addDays } from 'date-fns';
import Realm from '../../Services/Realm';

import { Category } from '../Settings/styles';

const Test = () => {
    function note() {
        Notifications.postLocalNotification({
            title: 'Esta é uma notificação local',
            body: 'O que será que vamos colocar aqui?',
            extra: 'O que vem em extra?',
        });
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
                                status: 'Tratado',
                            },
                        ],
                    });
                }
            });
        } catch (err) {
            console.tron(err);
        }
    }

    return (
        <View>
            <Category />
            <Button title="Disparar notificação" onPress={() => note()} />
            <Category />

            <Button
                title="Load with sample data"
                onPress={() => sampleData()}
            />
        </View>
    );
};

export default Test;
