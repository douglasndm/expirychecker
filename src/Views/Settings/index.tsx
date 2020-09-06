import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Linking } from 'react-native';
import { Button as ButtonPaper, Switch } from 'react-native-paper';
import { useTheme } from 'styled-components/native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';

import GenericButton from '../../Components/Button';

import {
    getAppTheme,
    setAppTheme,
    getDaysToBeNextToExp,
    setDaysToBeNextToExp,
    getNotificationsEnabled,
    setNotificationsEnabled,
} from '../../Functions/Settings';
import { ImportBackupFile, ExportBackupFile } from '../../Functions/Backup';
import * as Premium from '../../Functions/Premium';

import {
    Container,
    PageTitle,
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingDescription,
    InputSetting,
    PremiumButtonsContainer,
    ButtonPremium,
    ButtonPremiumText,
    ButtonCancel,
    ButtonCancelText,
    Icons,
} from './styles';

const Settings: React.FC = () => {
    const [daysToBeNext, setDaysToBeNext] = useState<number>();
    const [selectedTheme, setSelectedTheme] = useState();
    const [userIsPremium, setUserIsPremium] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

    const navigation = useNavigation();

    const theme = useTheme();

    const setSettingDaysToBeNext = useCallback(async (days: number) => {
        await setDaysToBeNextToExp(days);
    }, []);

    const handleCancel = useCallback(async () => {
        await Linking.openURL(
            'https://play.google.com/store/account/subscriptions?sku=controledevalidade_premium&package=com.controledevalidade'
        );

        if (!(await Premium.CheckIfSubscriptionIsActive())) {
            navigation.navigate(StackActions.popToTop());
        }
    }, [navigation]);

    const handleNotificationEnabledSwitch = useCallback(async () => {
        await setNotificationsEnabled(!isNotificationsEnabled);

        setIsNotificationsEnabled(!isNotificationsEnabled);
    }, [isNotificationsEnabled]);

    useEffect(() => {
        async function getSettingsAlreadySetted() {
            const settingDays = await getDaysToBeNextToExp();
            setDaysToBeNext(String(settingDays));

            const pre = await Premium.GetPremium();
            setUserIsPremium(pre);

            const notificationEnabled = await getNotificationsEnabled();
            setIsNotificationsEnabled(notificationEnabled);
        }

        getSettingsAlreadySetted();
    }, []);

    useEffect(() => {
        async function SetNewDays() {
            const previousDaysToBeNext = await getDaysToBeNextToExp();

            if (previousDaysToBeNext !== daysToBeNext) {
                await setSettingDaysToBeNext(daysToBeNext);
            }
        }

        SetNewDays();
    }, [daysToBeNext, setSettingDaysToBeNext]);

    useEffect(() => {
        async function getTheme() {
            const appTheme = await getAppTheme();

            setSelectedTheme(appTheme);
        }

        getTheme();
    }, []);

    return (
        <Container>
            <ScrollView>
                <View
                    style={{
                        flexDirection: 'row',
                        marginLeft: -15,
                    }}
                >
                    <ButtonPaper
                        style={{
                            alignSelf: 'flex-end',
                        }}
                        icon={() => (
                            <Icons name="arrow-back-outline" size={28} />
                        )}
                        color={theme.colors.accent}
                        compact
                        onPress={() => {
                            navigation.goBack();
                        }}
                    />
                    <PageTitle>Configurações</PageTitle>
                </View>

                <Category>
                    <CategoryTitle>Geral</CategoryTitle>

                    <CategoryOptions>
                        <SettingDescription>
                            Quantos dias para produto ser considerado próximo
                        </SettingDescription>
                        <InputSetting
                            keyboardType="numeric"
                            placeholder="Quantidade de dias"
                            placeholderTextColor={theme.colors.text}
                            value={daysToBeNext}
                            onChangeText={(v) => {
                                const regex = /^[0-9\b]+$/;

                                if (v === '' || regex.test(v)) {
                                    setDaysToBeNext(v);
                                }
                            }}
                        />

                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: 15,
                            }}
                        >
                            <SettingDescription>
                                Notificações habilitadas?
                            </SettingDescription>
                            <Switch
                                value={isNotificationsEnabled}
                                onValueChange={handleNotificationEnabledSwitch}
                            />
                        </View>
                    </CategoryOptions>

                    <CategoryOptions>
                        <CategoryTitle>Aparência</CategoryTitle>

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
                                {userIsPremium || __DEV__ ? (
                                    <Picker.Item
                                        label="Ultra violeta (Premium)"
                                        value="ultraviolet"
                                    />
                                ) : null}

                                {
                                    // I CANT USE FRAGMENT SO I NEED TO DO EACH PICKER WITH IT OWN 'IF' WHY RN???
                                    userIsPremium || __DEV__ ? (
                                        <Picker.Item
                                            label="Dark Green (Premium)"
                                            value="darkgreen"
                                        />
                                    ) : null
                                }

                                {userIsPremium || __DEV__ ? (
                                    <Picker.Item
                                        label="Happy Pink (Premium)"
                                        value="happypink"
                                    />
                                ) : null}

                                {userIsPremium || __DEV__ ? (
                                    <Picker.Item
                                        label="Ocean Blue (Premium)"
                                        value="oceanblue"
                                    />
                                ) : null}
                            </Picker>
                        </View>
                    </CategoryOptions>
                </Category>

                <Category>
                    <CategoryTitle>Premium</CategoryTitle>

                    {!userIsPremium && (
                        <GenericButton
                            text="SEJA PREMIUM E DESBLOQUEIE MAIS FUNÇÕES"
                            onPress={() => {
                                navigation.push('PremiumSubscription');
                            }}
                        />
                    )}

                    <CategoryOptions notPremium={!userIsPremium}>
                        <View>
                            <SettingDescription>
                                Com a função de importar e exportar você
                                consegue salvar todos os seus produtos
                                externamente em um cartão de memória por exemplo
                                e depois importar em outro telefone ou depois de
                                formatar este.
                            </SettingDescription>

                            <PremiumButtonsContainer>
                                <ButtonPremium
                                    disabled={!userIsPremium}
                                    onPress={async () => {
                                        await ImportBackupFile();
                                    }}
                                >
                                    <ButtonPremiumText>
                                        Importar
                                    </ButtonPremiumText>
                                </ButtonPremium>
                                <ButtonPremium
                                    disabled={!userIsPremium}
                                    onPress={async () => {
                                        await ExportBackupFile();
                                    }}
                                >
                                    <ButtonPremiumText>
                                        Exportar
                                    </ButtonPremiumText>
                                </ButtonPremium>
                            </PremiumButtonsContainer>
                        </View>
                    </CategoryOptions>

                    {userIsPremium && (
                        <ButtonCancel onPress={handleCancel}>
                            <ButtonCancelText>
                                Cancelar assinatura
                            </ButtonCancelText>
                        </ButtonCancel>
                    )}
                </Category>
            </ScrollView>
        </Container>
    );
};

export default Settings;
