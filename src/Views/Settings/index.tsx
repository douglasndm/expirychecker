import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ScrollView } from 'react-native';
import { Switch } from 'react-native-paper';
import { showMessage } from 'react-native-flash-message';

import strings from '~/Locales';

import Loading from '~/Components/Loading';
import StatusBar from '~/Components/StatusBar';
import Header from '~/Components/Header';

import Appearance from './Components/Appearance';
import Notifications from './Components/Notifications';
import Pro from './Components/Pro';

import {
    setHowManyDaysToBeNextExp,
    setEnableMultipleStoresMode,
} from '~/Functions/Settings';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    SettingsContent,
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingContainer,
    SettingDescription,
    InputSetting,
} from './styles';

const Settings: React.FC = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [daysToBeNext, setDaysToBeNext] = useState<string>('');
    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();

    const { userPreferences, setUserPreferences } =
        useContext(PreferencesContext);

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

    const handleMultiStoresEnableSwitch = useCallback(async () => {
        await setEnableMultipleStoresMode(!multipleStoresState);

        setUserPreferences({
            ...userPreferences,
            multiplesStores: !userPreferences.multiplesStores,
        });
    }, [multipleStoresState, setUserPreferences, userPreferences]);

    useEffect(() => {
        setDaysToBeNext(String(userPreferences.howManyDaysToBeNextToExpire));
        setMultipleStoresState(userPreferences.multiplesStores);
    }, [userPreferences]);

    const loadData = useCallback(async () => {
        try {
            setIsLoading(true);

            const previousDaysToBeNext = String(
                userPreferences.howManyDaysToBeNextToExpire
            );

            if (!daysToBeNext || daysToBeNext === '') {
                return;
            }

            if (!!daysToBeNext && previousDaysToBeNext !== daysToBeNext) {
                await setSettingDaysToBeNext(Number(daysToBeNext));
            }
        } catch (err) {
            if (err instanceof Error)
                showMessage({
                    message: err.message,
                    type: 'danger',
                });
        } finally {
            setIsLoading(false);
        }
    }, [
        daysToBeNext,
        setSettingDaysToBeNext,
        userPreferences.howManyDaysToBeNextToExpire,
    ]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    return isLoading ? (
        <Loading />
    ) : (
        <Container>
            <StatusBar />
            <ScrollView>
                <Header title={strings.View_Settings_PageTitle} noDrawer />

                <SettingsContent>
                    <Category>
                        <CategoryTitle>
                            {strings.View_Settings_CategoryName_General}
                        </CategoryTitle>

                        <CategoryOptions>
                            <SettingDescription>
                                {
                                    strings.View_Settings_SettingName_HowManyDaysToBeNextToExp
                                }
                            </SettingDescription>
                            <InputSetting
                                keyboardType="numeric"
                                placeholder={
                                    strings.View_Settings_SettingName_DaysToExpPlaceholder
                                }
                                value={daysToBeNext}
                                onChangeText={v => {
                                    const regex = /^[0-9\b]+$/;

                                    if (v === '' || regex.test(v)) {
                                        setDaysToBeNext(v);
                                    }
                                }}
                            />
                            {/* <Notifications /> */}

                            {userPreferences.isUserPremium && (
                                <SettingContainer>
                                    <SettingDescription>
                                        {
                                            strings.View_Settings_SettingName_EnableMultiplesStores
                                        }
                                    </SettingDescription>
                                    <Switch
                                        value={userPreferences.multiplesStores}
                                        onValueChange={
                                            handleMultiStoresEnableSwitch
                                        }
                                    />
                                </SettingContainer>
                            )}
                        </CategoryOptions>
                    </Category>

                    <Appearance />

                    <Pro />
                </SettingsContent>
            </ScrollView>
        </Container>
    );
};

export default Settings;
