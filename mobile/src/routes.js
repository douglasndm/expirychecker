import React from 'react';
import { Text } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Home from './Views/Home';
import AddProduct from './Views/AddProduct';
import TestDb from './Views/TestDB';

const Drawer = createDrawerNavigator();

export default () => {
    return (
        <Drawer.Navigator>
            <Drawer.Screen
                name="Home"
                component={Home}
                options={{ title: 'Início' }}
            />
            <Drawer.Screen
                name="AddProduct"
                component={AddProduct}
                options={{ title: 'Adicionar produto' }}
            />

            <Drawer.Screen name="Database Test" component={TestDb} />
        </Drawer.Navigator>
    );
};
