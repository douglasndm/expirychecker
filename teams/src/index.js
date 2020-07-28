import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import Crashes from 'appcenter-crashes';
import Analytics from 'appcenter-analytics';
import { enableScreens } from 'react-native-screens';
import BackgroundJob from 'react-native-background-job';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import admob, { MaxAdContentRating } from '@react-native-firebase/admob';

import { getAllProductsNextToExp } from './Functions/ProductsNotifications';
import { getDarkModeEnabled } from './Functions/Settings';

import DarkTheme from './Themes/Dark';
import LightTheme from './Themes/Light';

import Routes from './Routes/DrawerContainer';

enableScreens();

async function disableAppCenterIfInDevMode() {
    await Crashes.setEnabled(false);
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
        if (__DEV__) console.tron(err);
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
    period: 86400000,
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
    const [theme, setTheme] = useState(LightTheme);

    async function getTheme() {
        const result = (await getDarkModeEnabled()) ? DarkTheme : LightTheme;

        setTheme(result);
    }
    getTheme();

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
