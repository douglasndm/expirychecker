import React, { useState, useEffect } from 'react';
import AsyncStorange from '@react-native-community/async-storage';

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
            console.tron(err);
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
            console.tron(err);
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
            </Category>
        </Container>
    );
};

export default Settings;
