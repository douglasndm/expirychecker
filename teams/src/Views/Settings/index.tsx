import React, {
    useState,
    useEffect,
    useCallback,
    useContext,
    useMemo,
} from 'react';
import { ScrollView, Platform, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { translate } from '~/Locales';

import StatusBar from '~/Components/StatusBar';
import BackButton from '~/Components/BackButton';

import Appearance from './Components/Appearance';
import Notifications from './Components/Notifications';
import Account from './Components/Account';

import { setHowManyDaysToBeNextExp } from '~/Functions/Settings';

import PreferencesContext from '~/Contexts/PreferencesContext';

import {
    Container,
    PageHeader,
    PageTitle,
    SettingsContent,
    Category,
    CategoryTitle,
    CategoryOptions,
    SettingDescription,
    InputSetting,
    ButtonCancel,
    ButtonCancelText,
} from './styles';

const Settings: React.FC = () => {
    const [daysToBeNext, setDaysToBeNext] = useState<string>('');

    const { preferences, setPreferences } = useContext(PreferencesContext);

    const { goBack, reset } = useNavigation();

    const setSettingDaysToBeNext = useCallback(
        async (days: number) => {
            await setHowManyDaysToBeNextExp(days);

            setPreferences({
                ...preferences,
                howManyDaysToBeNextToExpire: days,
            });
        },
        [setPreferences, preferences]
    );

    useEffect(() => {
        setDaysToBeNext(String(preferences.howManyDaysToBeNextToExpire));
    }, [preferences]);

    useEffect(() => {
        async function SetNewDays() {
            const previousDaysToBeNext = String(
                preferences.howManyDaysToBeNextToExpire
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
        preferences.howManyDaysToBeNextToExpire,
    ]);

    const cancelSubscriptionLink = useMemo(() => {
        return Platform.OS === 'ios'
            ? 'https://apps.apple.com/account/subscriptions'
            : 'https://play.google.com/store/account/subscriptions?sku=expirybusiness_monthly_default_1person&package=dev.douglasndm.expirychecker.business';
    }, []);

    const handleNavigateCancel = useCallback(async () => {
        await Linking.openURL(cancelSubscriptionLink);

        reset({
            routes: [{ name: 'Home' }],
        });
    }, [cancelSubscriptionLink, reset]);

    return (
        <>
            <Container>
                <StatusBar />
                <ScrollView>
                    <PageHeader>
                        <BackButton handleOnPress={goBack} />

                        <PageTitle>
                            {translate('View_Settings_PageTitle')}
                        </PageTitle>
                    </PageHeader>

                    <SettingsContent>
                        <Category>
                            <CategoryTitle>
                                {translate(
                                    'View_Settings_CategoryName_General'
                                )}
                            </CategoryTitle>

                            <CategoryOptions>
                                <SettingDescription>
                                    {translate(
                                        'View_Settings_SettingName_HowManyDaysToBeNextToExp'
                                    )}
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
                            </CategoryOptions>
                        </Category>

                        <Appearance />

                        <Account />

                        <ButtonCancel onPress={handleNavigateCancel}>
                            <ButtonCancelText>
                                Cancelar assinatura
                            </ButtonCancelText>
                        </ButtonCancel>
                    </SettingsContent>
                </ScrollView>
            </Container>
        </>
    );
};

export default Settings;
