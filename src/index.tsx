import * as Sentry from '@sentry/react-native';
import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { StatusBar } from 'react-native';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import { ThemeProvider } from 'styled-components';
import { NavigationContainer } from '@react-navigation/native';
import EnvConfig from 'react-native-config';

import Realm from './Services/Realm';
import './Services/Admob';
import './Services/BackgroundJobs';

import { CheckIfSubscriptionIsActive } from './Functions/Premium';

import Themes, { getActualAppTheme } from './Themes';

import Routes from './Routes/DrawerContainer';

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

    return (
        <ThemeProvider theme={theme}>
            <PaperProvider>
                <Portal>
                    <NavigationContainer>
                        <StatusBar backgroundColor={theme.colors.accent} />
                        <Routes />
                    </NavigationContainer>
                </Portal>
            </PaperProvider>
        </ThemeProvider>
    );
};

export default App;
