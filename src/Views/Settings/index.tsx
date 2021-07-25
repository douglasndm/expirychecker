import React, { useState, useEffect, useCallback, useContext } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { showMessage } from 'react-native-flash-message';
import { Switch } from 'react-native-paper';

import strings from '../../Locales';

import StatusBar from '../../Components/StatusBar';
import BackButton from '../../Components/BackButton';
import GenericButton from '../../Components/Button';

import Appearance from './Components/Appearance';
import Notifications from './Components/Notifications';
import Pro from './Components/Pro';

import {
    setHowManyDaysToBeNextExp,
    setEnableMultipleStoresMode,
} from '../../Functions/Settings';
import { isUserSignedIn, signOut } from '~/Functions/Auth';

import PreferencesContext from '../../Contexts/PreferencesContext';

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
} from './styles';

const Settings: React.FC = () => {
    const [daysToBeNext, setDaysToBeNext] = useState<string>('');
    const [multipleStoresState, setMultipleStoresState] = useState<boolean>();

    const { userPreferences, setUserPreferences } = useContext(
        PreferencesContext
    );
    const [userSigned, setUserSigned] = useState<boolean>(false);
    const [isOnLogout, setIsOnLogout] = useState<boolean>(false);

    const { goBack } = useNavigation();

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

    const loadData = useCallback(async () => {
        const isSigned = await isUserSignedIn();
        setUserSigned(isSigned);
    }, []);

    useEffect(() => {
        setDaysToBeNext(String(userPreferences.howManyDaysToBeNextToExpire));
        setMultipleStoresState(userPreferences.multiplesStores);

        loadData();
    }, [userPreferences, loadData]);

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

    const handleLogout = useCallback(async () => {
        try {
            setIsOnLogout(true);
            await signOut();

            setUserPreferences({
                ...userPreferences,
                isUserSignedIn: false,
            });
        } catch (err) {
            showMessage({
                message: err.message,
                type: 'danger',
            });
        } finally {
            setIsOnLogout(false);
        }
    }, [setUserPreferences, userPreferences]);

    return (
        <>
            <Container>
                <StatusBar />
                <ScrollView>
                    <PageHeader>
                        <BackButton handleOnPress={goBack} />

                        <PageTitle>{strings.View_Settings_PageTitle}</PageTitle>
                    </PageHeader>

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
                                    placeholder="Quantidade de dias"
                                    value={daysToBeNext}
                                    onChangeText={v => {
                                        const regex = /^[0-9\b]+$/;

                                        if (v === '' || regex.test(v)) {
                                            setDaysToBeNext(v);
                                        }
                                    }}
                                />
                                <Notifications />

                                {userPreferences.isUserPremium && (
                                    <SettingContainer>
                                        <SettingDescription>
                                            {
                                                strings.View_Settings_SettingName_EnableMultiplesStores
                                            }
                                        </SettingDescription>
                                        <Switch
                                            value={
                                                userPreferences.multiplesStores
                                            }
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

                        {userSigned && (
                            <Category>
                                <CategoryTitle>
                                    {strings.View_Settings_CategoryName_Account}
                                </CategoryTitle>

                                <SettingDescription>
                                    {strings.View_Settings_AccountDescription}
                                </SettingDescription>

                                <GenericButton
                                    text={strings.View_Settings_Button_SignOut}
                                    onPress={handleLogout}
                                    isLoading={isOnLogout}
                                />
                            </Category>
                        )}
                    </SettingsContent>
                </ScrollView>
            </Container>
        </>
    );
};

export default Settings;
