import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Switch, useTheme } from 'react-native-paper';
import { Picker } from '@react-native-community/picker';
import AsyncStorange from '@react-native-community/async-storage';

import { getAppTheme, setAppTheme } from '../../Functions/Settings';

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
    const [selectedTheme, setSelectedTheme] = useState();

    const theme = useTheme();

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

    useEffect(() => {
        async function getTheme() {
            const appTheme = await getAppTheme();

            setSelectedTheme(appTheme);
        }

        getTheme();
    }, []);

    return (
        <Container style={{ backgroundColor: theme.colors.background }}>
            <PageTitle style={{ color: theme.colors.text }}>
                Configurações
            </PageTitle>

            <Category
                style={{ backgroundColor: theme.colors.productBackground }}
            >
                <CategoryTitle style={{ color: theme.colors.text }}>
                    Geral
                </CategoryTitle>

                <CategoryOptions>
                    <SettingDescription style={{ color: theme.colors.text }}>
                        Quantos dias para produto ser considerado próximo
                    </SettingDescription>
                    <InputSetting
                        style={{
                            color: theme.colors.text,
                            borderColor: theme.colors.text,
                        }}
                        keyboardType="numeric"
                        placeholder="Quantos dias para produto ser considerado próximo"
                        value={daysToBeNext}
                        onChangeText={(value) => {
                            setDaysToBeNext(value);
                        }}
                    />
                </CategoryOptions>

                <CategoryOptions>
                    <CategoryTitle style={{ color: theme.colors.text }}>
                        Aparência
                    </CategoryTitle>

                    <View
                        style={{
                            marginTop: 10,
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{ color: theme.colors.text }}>
                            Tema do aplicativo
                        </Text>

                        <Picker
                            style={{
                                color: theme.colors.text,
                            }}
                            mode="dropdown"
                            selectedValue={selectedTheme}
                            onValueChange={async (t) => {
                                setSelectedTheme(t);
                                await setAppTheme(t);
                            }}
                        >
                            <Picker.Item
                                label="Baseado no sistema (Padrão)"
                                value="system"
                            />
                            <Picker.Item label="Claro" value="light" />
                            <Picker.Item label="Escuro" value="dark" />
                        </Picker>
                    </View>
                </CategoryOptions>
            </Category>
        </Container>
    );
};

export default Settings;
