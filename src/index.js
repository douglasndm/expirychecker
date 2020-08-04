import * as Sentry from '@sentry/react-native';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import Analytics from 'appcenter-analytics';
import EnvConfig from 'react-native-config';

import Realm from './Services/Realm';
import './Services/Admob';
import './Services/BackgroundJobs';

import { CheckIfSubscriptionIsActive, GetPremium } from './Functions/Premium';

import Themes, { getActualAppTheme } from './Themes';

import Routes from './Routes/DrawerContainer';

if (!__DEV__) {
    Sentry.init({
        dsn: EnvConfig.SENTRY_DSN,
        enableAutoSessionTracking: true,
    });
}

enableScreens();

async function disableAppCenterIfInDevMode() {
    await Analytics.setEnabled(false);
}

if (__DEV__) {
    disableAppCenterIfInDevMode();
}

export default () => {
    const [theme, setTheme] = useState(Themes.Light);

    useEffect(() => {
        async function checkIfUserIsPremium() {
            await CheckIfSubscriptionIsActive();
        }

        checkIfUserIsPremium();
    }, []);

    async function getTheme() {
        const appTheme = await getActualAppTheme();
        setTheme(appTheme);
    }
    getTheme();

    // Troca o tema do app a cada alteração em tempo real na pagina de configurações
    useEffect(() => {
        async function setThemeModificationNotification() {
            const realm = await Realm();

            realm.addListener('change', async () => {
                await getTheme();
            });
        }

        setThemeModificationNotification();
    }, []);

    return (
        <PaperProvider theme={theme}>
            <Portal>
                <NavigationContainer>
                    <StatusBar backgroundColor={theme.colors.accent} />
                    <Routes />
                </NavigationContainer>
            </Portal>
        </PaperProvider>
    );
};
