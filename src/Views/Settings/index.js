import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Switch, useTheme } from 'react-native-paper';
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
    const [darkMode, setDarkMode] = useState();

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
            const getDarkModeSetting = await getSetting('settings/darkMode');

            if (settingDays != null) setDaysToBeNext(settingDays);
            else setDaysToBeNext(30);

            if (getDarkModeSetting != null) {
                if (getDarkModeSetting === 'true') {
                    setDarkMode(true);
                } else {
                    setDarkMode(false);
                }
            } else {
                setDarkMode(false);
            }
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
        async function setDarkModeSetting() {
            const previousDarkMode = await getSetting('settings/darkMode');

            if (previousDarkMode !== darkMode) {
                try {
                    await AsyncStorange.setItem(
                        'settings/darkMode',
                        String(darkMode)
                    );
                } catch (err) {
                    console.warn(err);
                }
            }
        }

        setDarkModeSetting();
    }, [darkMode]);

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
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Text style={{ color: theme.colors.text }}>
                            Modo escuro (Necessário reiniciar)
                        </Text>
                        <Switch
                            value={darkMode}
                            onValueChange={(value) => {
                                setDarkMode(value);
                            }}
                        />
                    </View>
                </CategoryOptions>
            </Category>
        </Container>
    );
};

export default Settings;
