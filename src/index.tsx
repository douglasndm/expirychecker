import * as Sentry from '@sentry/react-native';
import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import EnvConfig from 'react-native-config';

import RealmContext from './Contexts/RealmContext';

import Realm from './Services/Realm';
import './Services/Admob';
import './Services/BackgroundJobs';

import { getDaysToBeNextToExp, getMultipleStores } from './Functions/Settings';
import { CheckIfSubscriptionIsActive, GetPremium } from './Functions/Premium';

import Themes, { getActualAppTheme } from './Themes';

import Routes from './Routes/DrawerContainer';
import PreferencesContext from './Contexts/PreferencesContext';

if (!__DEV__) {
    Sentry.init({
        dsn: EnvConfig.SENTRY_DSN,
        enableAutoSessionTracking: true,
    });
}

const App: React.FC = () => {
    const [theme, setTheme] = useState(Themes.Light);

    const getTheme = useCallback(async () => {
        const appTheme = await getActualAppTheme();
        setTheme(appTheme);
    }, []);

    useEffect(() => {
        getTheme();

        async function checkIfUserIsPremium() {
            await CheckIfSubscriptionIsActive();
        }

        checkIfUserIsPremium();
    }, []);

    // Troca o tema do app a cada alteração em tempo real na pagina de configurações
    useEffect(() => {
        async function setThemeModificationNotification() {
            Realm.addListener('change', async () => {
                await getTheme();
            });
        }

        setThemeModificationNotification();
    }, [getTheme]);

    const [preferences, setPreferences] = useState({
        howManyDaysToBeNextToExpire: 30,
        isUserPremium: true,
        appTheme: 'system',
        multiplesStores: false,
    });

    useEffect(() => {
        async function getData() {
            const daysToBeNext = await getDaysToBeNextToExp();
            const isPremium = await GetPremium();
            const appTheme = await getActualAppTheme();
            const multiplesStores = await getMultipleStores();

            setPreferences({
                howManyDaysToBeNextToExpire: daysToBeNext,
                isUserPremium: isPremium,
                appTheme,
                multiplesStores,
            });
        }

        getData();
    }, []);

    return (
        <RealmContext.Provider value={{ Realm }}>
            <PreferencesContext.Provider value={preferences}>
                <ThemeProvider theme={theme}>
                    <PaperProvider>
                        <Portal>
                            <NavigationContainer>
                                <StatusBar
                                    backgroundColor={theme.colors.accent}
                                />
                                <Routes />
                            </NavigationContainer>
                        </Portal>
                    </PaperProvider>
                </ThemeProvider>
            </PreferencesContext.Provider>
        </RealmContext.Provider>
    );
};

export default App;
