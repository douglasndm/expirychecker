import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import Routes from './routes';

export default () => {
    return (
        <NavigationContainer>
            <StatusBar backgroundColor="#14d48f" />
            <Routes />
        </NavigationContainer>
    );
};
