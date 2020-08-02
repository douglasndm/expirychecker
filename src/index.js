import * as Sentry from '@sentry/react-native';
import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import Analytics from 'appcenter-analytics';
import { enableScreens } from 'react-native-screens';
import BackgroundJob from 'react-native-background-job';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import admob, { MaxAdContentRating } from '@react-native-firebase/admob';

import EnvConfig from 'react-native-config';

import Realm from './Services/Realm';

import { getAllProductsNextToExp } from './Functions/ProductsNotifications';

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

admob()
    .setRequestConfiguration({
        // Update all future requests suitable for parental guidance
        maxAdContentRating: MaxAdContentRating.PG,

        // Indicates that you want your content treated as child-directed for purposes of COPPA.
        tagForChildDirectedTreatment: false,

        // Indicates that you want the ad request to be handled in a
        // manner suitable for users under the age of consent.
        tagForUnderAgeOfConsent: true,
    })
    .catch((err) => {
        if (__DEV__) console.warn(err);
        else throw new Error(err);
    });

// REGISTRA O SERVIÇO QUE VAI RODAR AS NOTIFICAÇÕES
const backgroundJob = {
    jobKey: 'backgroundNotification',
    job: () => {
        getAllProductsNextToExp();
    },
};
BackgroundJob.register(backgroundJob);

const backgroundSchedule = {
    jobKey: 'backgroundNotification',
    period: __DEV__ ? 900000 : 86400000,
};

BackgroundJob.schedule(backgroundSchedule)
    .then(() => console.log('Success'))
    .catch((err) => {
        if (__DEV__) {
            console.warn(err);
        } else {
            Analytics.trackEvent(
                `Erro ao tentar agendar evento de notificação. ${err}`
            );
        }
    });

export default () => {
    const [theme, setTheme] = useState(Themes.Light);

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
