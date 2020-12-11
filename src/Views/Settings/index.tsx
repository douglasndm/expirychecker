import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, ScrollView, Linking } from 'react-native';
import { Switch } from 'react-native-paper';
import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-community/picker';

import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';

import {
    setHowManyDaysToBeNextExp,
    setAppTheme,
    setEnableNotifications,
    setEnableMultipleStoresMode,
} from '../../Functions/Settings';
import { ImportBackupFile, ExportBackupFile } from '../../Functions/Backup';
import { isSubscriptionActive } from '../../Functions/ProMode';
import { getActualAppTheme } from '../../Themes';

import PreferencesContext from '../../Contexts/PreferencesContext';

import { migrateAllDataFromSQLiteToRealm } from '../../typeorm/MigrateTypeormData';

import {
    Container,
    PageHeader,
    PageTitle,
    SettingsContent,
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingContainer,
    SettingDescription,
    InputSetting,
    PremiumButtonsContainer,
    ButtonPremium,
    ButtonPremiumText,
    ButtonCancel,
    ButtonCancelText,
    Text,
} from './styles';

const Settings: React.FC = () => {
    const [daysToBeNext, setDaysToBeNext] = useState<string>('');
    const [selectedTheme, setSelectedTheme] = useState<string>('system');
    const [userIsPremium, setUserIsPremium] = useState(false);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );

    const { navigate, goBack, reset } = useNavigation();

    const theme = useTheme();

    const setSettingDaysToBeNext = useCallback(
        async (days: number) => {
            await setHowManyDaysToBeNextExp(days);

            setUserPreferences({
                ...userPreferences,
                howManyDaysToBeNextToExpire: days,
            });
        },
        [setUserPreferences, userPreferences]
    );

    const handleCancel = useCallback(async () => {
        await Linking.openURL(
            'https://play.google.com/store/account/subscriptions?sku=controledevalidade_premium&package=com.controledevalidade'
        );

        if (!(await isSubscriptionActive())) {
            reset({
                routes: [{ name: 'Home' }],
            });
        }
    }, [reset]);

    const handleNotificationEnabledSwitch = useCallback(async () => {
        await setEnableNotifications(!isNotificationsEnabled);

        setIsNotificationsEnabled(!isNotificationsEnabled);
    }, [isNotificationsEnabled]);

    const handleMultiStoresEnableSwitch = useCallback(async () => {
        await setEnableMultipleStoresMode(!multipleStoresState);

        setUserPreferences({
            ...userPreferences,
            multiplesStores: !userPreferences.multiplesStores,
        });
    }, [multipleStoresState, setUserPreferences, userPreferences]);

    const handleThemeChange = useCallback(
        async (themeName: string) => {
            setSelectedTheme(themeName);
            await setAppTheme(themeName);

            const changeToTheme = await getActualAppTheme();

            setUserPreferences({
                ...userPreferences,
                appTheme: changeToTheme,
            });
        },
        [setUserPreferences, userPreferences]
    );

    useEffect(() => {
        setDaysToBeNext(String(userPreferences.howManyDaysToBeNextToExpire));
        setUserIsPremium(userPreferences.isUserPremium);
        setMultipleStoresState(userPreferences.multiplesStores);
        setIsNotificationsEnabled(userPreferences.enableNotifications);
    }, [userPreferences]);

    useEffect(() => {
        async function SetNewDays() {
            const previousDaysToBeNext = String(
                userPreferences.howManyDaysToBeNextToExpire
            );

            if (!daysToBeNext || daysToBeNext === '') {
                return;
            }

            if (!!daysToBeNext && previousDaysToBeNext !== daysToBeNext) {
                await setSettingDaysToBeNext(Number(daysToBeNext));
            }
        }

        SetNewDays();
    }, [
        daysToBeNext,
        setSettingDaysToBeNext,
        userPreferences.howManyDaysToBeNextToExpire,
    ]);

    const navigateToPremiumView = useCallback(() => {
        navigate('PremiumSubscription');
    }, [navigate]);

    const migrateData = useCallback(async () => {
        await migrateAllDataFromSQLiteToRealm();
    }, []);

    return (
        <Container>
            <ScrollView>
                <PageHeader>
                    <BackButton handleOnPress={goBack} />

                    <PageTitle>Configurações</PageTitle>
                </PageHeader>

                <SettingsContent>
                    <Category>
                        <CategoryTitle>Geral</CategoryTitle>

                        <CategoryOptions>
                            <SettingDescription>
                                Quantos dias para produto ser considerado
                                próximo
                            </SettingDescription>
                            <InputSetting
                                keyboardType="numeric"
                                placeholder="Quantidade de dias"
                                value={daysToBeNext}
                                onChangeText={(v) => {
                                    const regex = /^[0-9\b]+$/;

                                    if (v === '' || regex.test(v)) {
                                        setDaysToBeNext(v);
                                    }
                                }}
                            />

                            <SettingContainer>
                                <SettingDescription>
                                    Notificações habilitadas?
                                </SettingDescription>
                                <Switch
                                    value={isNotificationsEnabled}
                                    onValueChange={
                                        handleNotificationEnabledSwitch
                                    }
                                />
                            </SettingContainer>

                            <SettingContainer>
                                <SettingDescription>
                                    Habilitar modo de múltiplas lojas
                                </SettingDescription>
                                <Switch
                                    value={userPreferences.multiplesStores}
                                    onValueChange={
                                        handleMultiStoresEnableSwitch
                                    }
                                />
                            </SettingContainer>
                        </CategoryOptions>

                        <CategoryOptions>
                            <CategoryTitle>Aparência</CategoryTitle>

                            <View
                                style={{
                                    marginTop: 10,
                                    justifyContent: 'space-between',
                                }}
                            >
                                <Text>Tema do aplicativo</Text>

                                <Picker
                                    style={{
                                        color: theme.colors.text,
                                    }}
                                    mode="dropdown"
                                    selectedValue={selectedTheme}
                                    onValueChange={handleThemeChange}
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

                                    {userIsPremium ||
                                        (__DEV__ && (
                                            <Picker.Item
                                                label="Relax (Premium)"
                                                value="relax"
                                            />
                                        ))}
                                </Picker>
                            </View>
                        </CategoryOptions>
                    </Category>

                    <Category>
                        <CategoryTitle>Premium</CategoryTitle>

                        {!userIsPremium && (
                            <GenericButton
                                text="SEJA PREMIUM E DESBLOQUEIE MAIS FUNÇÕES"
                                onPress={navigateToPremiumView}
                            />
                        )}

                        <CategoryOptions notPremium={!userIsPremium}>
                            <View>
                                <SettingDescription>
                                    Com a função de importar e exportar você
                                    consegue salvar todos os seus produtos
                                    externamente em um cartão de memória por
                                    exemplo e depois importar em outro telefone
                                    ou depois de formatar este.
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

                    <Category>
                        <CategoryTitle>Banco de dados de testes</CategoryTitle>

                        <SettingDescription>
                            Se você atualizou o aplicativo recentemente e não
                            consegue ver seus dados utilize este botão para
                            copiar todos os dados antigos para a nova
                            atualização
                        </SettingDescription>

                        <GenericButton
                            text="Migrar dados"
                            onPress={migrateData}
                        />
                    </Category>
                </SettingsContent>
            </ScrollView>
        </Container>
    );
};

export default Settings;
