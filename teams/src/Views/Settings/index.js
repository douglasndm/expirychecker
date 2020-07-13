import React, { useState, useEffect } from 'react';
import AsyncStorange from '@react-native-community/async-storage';
import { Button } from 'react-native';
import { addDays } from 'date-fns';
import Realm from '../../Services/Realm';

import {
    Container,
    PageTitle,
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingDescription,
    InputSetting,
} from './styles';

const Settings = () => {
    const [daysToBeNext, setDaysToBeNext] = useState();

    async function setSettingDaysToBeNext(days) {
        try {
            await AsyncStorange.setItem('settings/daysToBeNext', days);
        } catch (err) {
            console.log(err);
        }
    }

    async function getSetting(settingName) {
        try {
            const setting = await AsyncStorange.getItem(settingName);

            if (setting !== null) {
                return setting;
            }

            return null;
        } catch (err) {
            console.log(err);
        }

        return null;
    }

    useEffect(() => {
        async function getSettingsAlreadySetted() {
            const settingDays = await getSetting('settings/daysToBeNext');

            if (settingDays != null) setDaysToBeNext(settingDays);
            else setDaysToBeNext(30);
        }

        getSettingsAlreadySetted();
    }, []);

    useEffect(() => {
        async function SetNewDays() {
            const previousDaysToBeNext = await getSetting(
                'settings/daysToBeNext'
            );

            if (previousDaysToBeNext !== daysToBeNext)
                setSettingDaysToBeNext(String(daysToBeNext));
        }

        SetNewDays();
    }, [daysToBeNext]);

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
            console.log(err);
        }
    }
    return (
        <Container>
            <PageTitle>Configurações</PageTitle>

            <Category>
                <CategoryTitle>Geral</CategoryTitle>

                <CategoryOptions>
                    <SettingDescription>
                        Quantos dias para produto ser considerado próximo
                    </SettingDescription>
                    <InputSetting
                        keyboardType="numeric"
                        placeholder="Quantos dias para produto ser considerado próximo"
                        value={daysToBeNext}
                        onChangeText={(value) => {
                            setDaysToBeNext(value);
                        }}
                    />
                </CategoryOptions>

                <Button
                    title="Load with sample data"
                    onPress={() => sampleData()}
                />
            </Category>
        </Container>
    );
};

export default Settings;
