import 'react-native-gesture-handler';

import React from 'react';
import { enableScreens } from 'react-native-screens';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, Portal } from 'react-native-paper';

import Routes from './routes';

enableScreens();

export default () => {
    return (
        <PaperProvider>
            <Portal>
                <NavigationContainer>
                    <StatusBar backgroundColor="#14d48f" />
                    <Routes />
                </NavigationContainer>
            </Portal>
        </PaperProvider>
    );
};
